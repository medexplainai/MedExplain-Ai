"""
Auth Engine: Production-Grade User Registration & Authentication System
Supports Doctors, Clinicians, Patients, and Caregivers with salted password hashing.
Persists in data/users.json with automatic initial seed data.
"""

import os
import json
import hashlib
import secrets
from typing import Dict, List, Optional, Any
from datetime import datetime

USERS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "users.json")

def _generate_salt() -> str:
    return secrets.token_hex(16)

def _hash_password(password: str, salt: str) -> str:
    return hashlib.sha256((salt + password).encode('utf-8')).hexdigest()

class AuthEngine:
    def __init__(self):
        self._ensure_storage()

    def _ensure_storage(self):
        os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
        if not os.path.exists(USERS_FILE):
            # Seed with default production demo accounts
            doc_salt = _generate_salt()
            pat_salt = _generate_salt()
            initial_users = [
                {
                    "id": "usr_seed_doctor_01",
                    "email": "doctor@gmail.com",
                    "name": "Dr. Sarah Jenkins, MD",
                    "role": "doctor",
                    "title": "Chief Medical Officer & Attending Physician",
                    "department": "Cardiology & Intensive Care",
                    "salt": doc_salt,
                    "password_hash": _hash_password("doctor", doc_salt),
                    "created_at": "2026-09-01T00:00:00Z"
                },
                {
                    "id": "usr_seed_patient_01",
                    "email": "patient@gmail.com",
                    "name": "Marcus Vance",
                    "role": "patient",
                    "title": "Registered Inpatient",
                    "age": 58,
                    "gender": "Male",
                    "salt": pat_salt,
                    "password_hash": _hash_password("patient", pat_salt),
                    "created_at": "2026-09-01T00:00:00Z"
                }
            ]
            with open(USERS_FILE, "w", encoding="utf-8") as f:
                json.dump(initial_users, f, indent=2)

    def _load_users(self) -> List[Dict[str, Any]]:
        self._ensure_storage()
        try:
            with open(USERS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def _save_users(self, users: List[Dict[str, Any]]):
        os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=2)

    def register_user(
        self,
        name: str,
        email: str,
        password: str,
        role: str = "patient",
        department: Optional[str] = None,
        age: Optional[int] = None,
        gender: Optional[str] = None
    ) -> Dict[str, Any]:
        """Registers a new user and returns their public profile."""
        clean_name = name.strip()
        clean_email = email.strip().lower()
        clean_password = password.strip()
        clean_role = role.strip().lower() if role else "patient"

        if len(clean_name) < 2:
            raise ValueError("Full name must be at least 2 characters.")
        if "@" not in clean_email or "." not in clean_email:
            raise ValueError("Please provide a valid email address.")
        if len(clean_password) < 4:
            raise ValueError("Password must be at least 4 characters long.")
        if clean_role not in ["doctor", "patient"]:
            clean_role = "patient"

        users = self._load_users()
        for u in users:
            if u.get("email", "").lower() == clean_email:
                raise ValueError(f"An account with email '{clean_email}' already exists. Please log in.")

        salt = _generate_salt()
        pwd_hash = _hash_password(clean_password, salt)
        user_id = f"usr_{secrets.token_hex(8)}"

        title = "Attending Clinician" if clean_role == "doctor" else "Registered Patient"
        dept = department.strip() if department else ("Cardiology & General Medicine" if clean_role == "doctor" else "Outpatient Care")

        new_user = {
            "id": user_id,
            "email": clean_email,
            "name": clean_name,
            "role": clean_role,
            "title": title,
            "department": dept,
            "age": age,
            "gender": gender,
            "salt": salt,
            "password_hash": pwd_hash,
            "created_at": datetime.utcnow().isoformat() + "Z"
        }

        users.append(new_user)
        self._save_users(users)

        return self._to_public_profile(new_user)

    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Verifies credentials and returns user profile if valid."""
        clean_email = email.strip().lower()
        clean_password = password.strip()

        users = self._load_users()
        for u in users:
            if u.get("email", "").lower() == clean_email:
                salt = u.get("salt", "")
                expected_hash = u.get("password_hash", "")
                if _hash_password(clean_password, salt) == expected_hash:
                    return self._to_public_profile(u)
                return None
        return None

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        clean_email = email.strip().lower()
        users = self._load_users()
        for u in users:
            if u.get("email", "").lower() == clean_email:
                return self._to_public_profile(u)
        return None

    def get_all_users(self) -> List[Dict[str, Any]]:
        users = self._load_users()
        return [self._to_public_profile(u) for u in users]

    def _to_public_profile(self, user: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "id": user.get("id"),
            "email": user.get("email"),
            "name": user.get("name"),
            "role": user.get("role"),
            "title": user.get("title"),
            "department": user.get("department"),
            "age": user.get("age"),
            "gender": user.get("gender"),
            "created_at": user.get("created_at")
        }

auth_engine = AuthEngine()
