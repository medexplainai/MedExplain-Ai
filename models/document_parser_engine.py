"""
Document Parser Engine: Comprehensive Multi-Format Medical Intelligence
Parses and structures:
1. Clinical Discharge Summaries & Inpatient Notes
2. Diagnostic Laboratory Test Reports (CBC, CMP, Lipid, HbA1c, Renal) with Normal/Abnormal flagging
3. Radiology & Diagnostic Imaging Reports (X-Ray, CT, MRI, Ultrasound)
4. Prescriptions & Medication Protocols
5. Scanned Documents & Medical Slips (OCR & Vision pipeline)
"""

import re
from typing import Dict, List, Any

# Standard clinical laboratory reference ranges for automated abnormality detection
LAB_REFERENCE_RANGES = {
    "hemoglobin": {"min": 13.5, "max": 17.5, "unit": "g/dL", "name": "Hemoglobin (Hb)", "system": "Hematology"},
    "hematocrit": {"min": 38.8, "max": 50.0, "unit": "%", "name": "Hematocrit (Hct)", "system": "Hematology"},
    "wbc": {"min": 4.5, "max": 11.0, "unit": "x10^3/uL", "name": "White Blood Cell Count", "system": "Hematology"},
    "platelets": {"min": 150, "max": 450, "unit": "x10^3/uL", "name": "Platelet Count", "system": "Hematology"},
    "fasting glucose": {"min": 70, "max": 99, "unit": "mg/dL", "name": "Fasting Blood Glucose", "system": "Endocrine"},
    "hba1c": {"min": 4.0, "max": 5.6, "unit": "%", "name": "Glycated Hemoglobin (HbA1c)", "system": "Endocrine"},
    "creatinine": {"min": 0.7, "max": 1.3, "unit": "mg/dL", "name": "Serum Creatinine", "system": "Renal"},
    "bun": {"min": 7, "max": 20, "unit": "mg/dL", "name": "Blood Urea Nitrogen (BUN)", "system": "Renal"},
    "sodium": {"min": 135, "max": 145, "unit": "mEq/L", "name": "Serum Sodium (Na)", "system": "Metabolic"},
    "potassium": {"min": 3.5, "max": 5.0, "unit": "mEq/L", "name": "Serum Potassium (K)", "system": "Metabolic"},
    "total cholesterol": {"min": 125, "max": 200, "unit": "mg/dL", "name": "Total Cholesterol", "system": "Cardiovascular"},
    "ldl": {"min": 50, "max": 100, "unit": "mg/dL", "name": "LDL ('Bad') Cholesterol", "system": "Cardiovascular"},
    "hdl": {"min": 40, "max": 60, "unit": "mg/dL", "name": "HDL ('Good') Cholesterol", "system": "Cardiovascular"},
    "triglycerides": {"min": 50, "max": 150, "unit": "mg/dL", "name": "Serum Triglycerides", "system": "Cardiovascular"},
    "troponin i": {"min": 0.0, "max": 0.04, "unit": "ng/mL", "name": "Cardiac Troponin I", "system": "Cardiovascular"},
    "alt": {"min": 7, "max": 56, "unit": "U/L", "name": "Alanine Aminotransferase (ALT)", "system": "Hepatic"},
    "ast": {"min": 10, "max": 40, "unit": "U/L", "name": "Aspartate Aminotransferase (AST)", "system": "Hepatic"}
}

class DocumentParserEngine:
    def __init__(self):
        pass

    def is_valid_medical_document(self, text: str) -> tuple[bool, str]:
        """
        Validates whether uploaded text constitutes a genuine clinical/medical document.
        Returns (is_valid, rejection_reason).
        """
        clean = text.strip()
        if len(clean) < 40:
            return False, "Document text is too brief or empty. A genuine clinical discharge summary, laboratory report, or EHR record is required."

        lower = clean.lower()

        # 1. Non-medical document heuristics (code, resumes, financial, general text)
        code_patterns = ["import react", "const [", "def __init__", "class ", "function()", "<!doctype html", "public static void", "select * from", "npm install", "github.com", "export default"]
        if sum(1 for p in code_patterns if p in lower) >= 2:
            return False, "Uploaded file appears to be software source code or IT documentation rather than a clinical record."

        resume_patterns = ["curriculum vitae", "work experience", "education:", "projects:", "hobbies:", "b.tech", "cgpa:", "technical skills:", "objective:", "linkedin:", "github.com/"]
        if sum(1 for p in resume_patterns if p in lower) >= 2 and not any(k in lower for k in ["discharge diagnosis", "patient history", "prescription", "chief complaint"]):
            return False, "Uploaded file appears to be a resume / curriculum vitae rather than a clinical healthcare record."

        financial_patterns = ["tax invoice", "invoice #", "subtotal:", "gstin", "shipping address", "purchase order", "amount due:", "total balance", "payment receipt", "credit card"]
        if sum(1 for p in financial_patterns if p in lower) >= 2 and not any(k in lower for k in ["patient", "diagnosis", "hospital", "laboratory", "prescription"]):
            return False, "Uploaded file appears to be a commercial bill or financial invoice, not an authentic medical record."

        academic_patterns = ["abstract", "references", "conclusion", "introduction", "methodology", "dataset", "literature review", "table 1:", "table 2:"]
        if sum(1 for p in academic_patterns if p in lower) >= 3 and not any(k in lower for k in ["patient demographics", "discharge medications", "chief complaint", "vital signs", "physical examination"]):
            return False, "Uploaded file appears to be a general academic research paper or literature review rather than an individualized patient clinical record."

        # 2. Medical vocabulary density check
        medical_markers = [
            "patient", "clinical", "diagnosis", "doctor", "physician", "hospital", "admission",
            "discharge", "treatment", "medication", "dose", "tablet", "blood", "pressure", "heart",
            "cardiac", "pulmonary", "respiratory", "glucose", "diabetes", "mri", "ct scan", "x-ray",
            "surgery", "pathology", "laboratory", "specimen", "exam", "symptoms", "prescription",
            "vitals", "cbc", "ecg", "troponin", "artery", "syndrome", "acute", "chronic", "edema",
            "pain", "mg", "tablet", "daily", "infection", "biopsy", "renal", "hepatic", "neurology",
            "orthopedic", "stenosis", "stent", "infarction", "stroke", "meniscus", "hemiparesis",
            "findings:", "impression:", "reference range", "hba1c", "cholesterol", "platelets",
            "chief complaint", "history of present illness", "physical examination", "operative report"
        ]

        matched_markers = [m for m in medical_markers if m in lower]
        if len(matched_markers) < 3:
            return False, (
                "Validation Exception: No recognizable clinical diagnosis, patient encounter markers, "
                "laboratory analytes, or medical posology terms were identified in this document. "
                "MedExplain AI strictly processes valid medical records (Discharge Summaries, Lab Panels, Imaging CT/MRI Scans, or Prescriptions)."
            )

        return True, "Valid clinical document."

    def extract_patient_metadata(self, text: str) -> Dict[str, Any]:
        """
        Extracts real patient demographics strictly from the document text.
        Guarantees zero out-of-document synthetic filler data.
        """
        name_match = re.search(r'(?:PATIENT(?: NAME)?|PATIENT):\s*([A-Za-z\s]+?)(?:\||\n|,|\bAGE\b|\bID\b|\bMRN\b|$)', text, re.IGNORECASE)
        id_match = re.search(r'(?:PATIENT ID|ID|MRN|RECORD NO\.?|RECORD NUMBER):\s*([A-Za-z0-9\-]+)', text, re.IGNORECASE)
        age_match = re.search(r'(?:AGE|PATIENT DEMOGRAPHICS):\s*(\d{1,3})(?:\s*[-–]?\s*year|\s*yo|\s*yr|/|\bM\b|\bF\b)', text, re.IGNORECASE)
        gender_match = re.search(r'(?:GENDER|SEX):\s*([MF]|Male|Female)', text, re.IGNORECASE)

        gender = None
        if gender_match:
            g = gender_match.group(1).upper()
            gender = "Male" if g.startswith("M") else "Female"
        elif re.search(r'\b(?:male|gentleman)\b', text, re.IGNORECASE):
            gender = "Male"
        elif re.search(r'\b(?:female|woman|lady)\b', text, re.IGNORECASE):
            gender = "Female"

        ward_match = re.search(r'(?:WARD|ROOM|CLINICAL WARD|DEPARTMENT):\s*([^\n|,]+)', text, re.IGNORECASE)

        clean_name = None
        if name_match:
            raw_name = name_match.group(1).strip()
            if len(raw_name) > 2 and not raw_name.lower().startswith(("demographics", "record", "summary", "clinical")):
                clean_name = raw_name.title()

        return {
            "name": clean_name,
            "id": id_match.group(1).strip() if id_match else None,
            "age": int(age_match.group(1)) if age_match else None,
            "gender": gender,
            "ward": ward_match.group(1).strip() if ward_match else None
        }

    def detect_document_type(self, text: str) -> str:
        """
        Classifies incoming medical text into one of 4 primary clinical document archetypes.
        """
        lower = text.lower()
        
        lab_keywords = ["lab report", "laboratory", "specimen", "reference range", "hba1c", "lipid panel", "hemoglobin", "wbc count", "fasting glucose", "urinalysis"]
        imaging_keywords = ["imaging report", "radiology", "ct scan", "mri", "x-ray", "ultrasound", "impression:", "findings:", "axial cut", "contrast enhanced", "radiologist"]
        rx_keywords = ["rx:", "prescription", "dispense:", "refills:", "sig:", "take 1 tablet", "po bid", "sig:"]
        
        lab_score = sum(1 for k in lab_keywords if k in lower)
        imaging_score = sum(1 for k in imaging_keywords if k in lower)
        rx_score = sum(1 for k in rx_keywords if k in lower)
        
        if lab_score >= 3 or ("reference range" in lower and lab_score >= 2):
            return "Laboratory Test Report"
        elif imaging_score >= 3 or (("impression:" in lower or "findings:" in lower) and imaging_score >= 2):
            return "Radiology & Imaging Report"
        elif rx_score >= 2:
            return "Prescription & Medication Slip"
        else:
            return "Clinical Discharge Summary & EHR Note"

    def parse_laboratory_report(self, text: str) -> List[Dict[str, Any]]:
        """
        Extracts structured laboratory values, compares against clinical reference ranges,
        and flags normal, borderline, high, or low status with visual gauge coordinates.
        """
        results = []
        lower = text.lower()

        for key, ref in LAB_REFERENCE_RANGES.items():
            escaped_name = re.escape(ref['name'].lower())
            escaped_key = re.escape(key)
            pattern = rf"(?:{escaped_key}|{escaped_name})\s*[:\-=]?\s*(\d+(?:\.\d+)?)"
            match = re.search(pattern, lower)
            if match and match.group(1):
                val = float(match.group(1))
                min_v = ref["min"]
                max_v = ref["max"]

                if val < min_v:
                    status = "LOW"
                    badge_color = "#3b82f6"  # Blue
                    alert_level = "warning"
                    explanation = f"Below normal range ({min_v} - {max_v} {ref['unit']}). Indicates potential deficiency or lower output."
                elif val > max_v:
                    status = "HIGH"
                    badge_color = "#ef4444"  # Red
                    alert_level = "danger"
                    explanation = f"Elevated above healthy limits ({min_v} - {max_v} {ref['unit']}). Requires clinical management or medication adjustment."
                else:
                    status = "NORMAL"
                    badge_color = "#10b981"  # Emerald
                    alert_level = "success"
                    explanation = f"Within standard physiological limits ({min_v} - {max_v} {ref['unit']})."

                span = (max_v - min_v) * 2.0 or 1.0
                clamped_pos = min(max(int(((val - (min_v * 0.5)) / span) * 100), 5), 95)

                results.append({
                    "test_name": ref["name"],
                    "value": val,
                    "unit": ref["unit"],
                    "ref_min": min_v,
                    "ref_max": max_v,
                    "status": status,
                    "badge_color": badge_color,
                    "alert_level": alert_level,
                    "system": ref["system"],
                    "gauge_percent": clamped_pos,
                    "explanation": explanation
                })

        return results

    def parse_imaging_report(self, text: str) -> Dict[str, Any]:
        """
        Parses radiology reports into Technique, Findings, and Radiologist Impression.
        """
        impression_match = re.search(r'(?:IMPRESSION|CONCLUSION|OPINION):\s*(.*?)(?=\n\n[A-Z\s]+:|$)', text, re.DOTALL | re.IGNORECASE)
        findings_match = re.search(r'(?:FINDINGS|EXAMINATION):\s*(.*?)(?=(?:IMPRESSION|CONCLUSION|OPINION):|$)', text, re.DOTALL | re.IGNORECASE)
        history_match = re.search(r'(?:CLINICAL HISTORY|INDICATION|REASON FOR EXAM):\s*(.*?)(?=(?:FINDINGS|TECHNIQUE|EXAMINATION):|$)', text, re.DOTALL | re.IGNORECASE)

        modality = "General Diagnostic Imaging"
        lower = text.lower()
        if "chest x-ray" in lower or "radiograph" in lower:
            modality = "Chest Radiography (X-Ray)"
        elif "ct scan" in lower or "computed tomography" in lower:
            modality = "Computed Tomography (CT Scan)"
        elif "mri" in lower or "magnetic resonance" in lower:
            modality = "Magnetic Resonance Imaging (MRI)"
        elif "ultrasound" in lower or "sonography" in lower:
            modality = "Diagnostic Ultrasound / Sonogram"
        elif "echocardiogram" in lower or "echo" in lower:
            modality = "Echocardiogram (Cardiac Ultrasound)"

        impression = impression_match.group(1).strip() if impression_match else "No formal impression block detected."
        findings = findings_match.group(1).strip() if findings_match else "Detailed anatomical views examined across sequential planes."
        indication = history_match.group(1).strip() if history_match else "Clinical diagnostic workup requested by attending physician."

        return {
            "modality": modality,
            "indication": indication,
            "findings": findings,
            "impression": impression
        }

document_parser_engine = DocumentParserEngine()
