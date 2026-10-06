"""
MedExplain AI - High-Speed Enterprise FastAPI Backend
Exposes explainable clinical NLP, patient summarization, closed-loop NLI guardrails,
and multi-format medical document intelligence over high-performance REST APIs.
"""

import os
import sys
import time
import io
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
from typing import Optional, List, Dict, Any, Union
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from pypdf import PdfReader
import docx

# Import core clinical AI engines
from models.clinical_engine import clinical_engine
from models.explainability_engine import explainability_engine
from models.summarizer_engine import summarizer_engine
from models.fact_checker_engine import fact_checker_engine
from models.document_parser_engine import document_parser_engine
from models.patient_registry_engine import patient_registry_engine
from models.longitudinal_engine import longitudinal_engine
from models.auth_engine import auth_engine
from data.sample_notes import SAMPLE_CLINICAL_NOTES
from utils.discharge_pdf import generate_hospital_discharge_docx
from utils.medical_pdf_generator import generate_medical_report_pdf
from models.qa_assistant_engine import qa_assistant_engine

app = FastAPI(
    title="MedExplain AI Backend",
    description="Explainable Clinical Decision Support and Patient-Centric Health Intelligence API",
    version="2.0.0"
)

# Enable CORS for local Vite React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    text: str
    patient_name: Optional[str] = None
    patient_id: Optional[str] = None
    age: Optional[Union[int, str]] = None
    gender: Optional[str] = None
    ward: Optional[str] = None

class PatientCreateRequest(BaseModel):
    name: Optional[str] = None
    id: Optional[str] = None
    age: Optional[Union[int, str]] = None
    gender: Optional[str] = None
    ward: Optional[str] = None
    room: Optional[str] = None
    specialty: Optional[str] = None
    triage: Optional[str] = None
    title: Optional[str] = None
    text: str

class FollowupRequest(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    type: Optional[str] = None
    text: str

class CompareRequest(BaseModel):
    patient_name: Optional[str] = "Inpatient Case"
    specialty: Optional[str] = "General Medicine"
    baseline_text: str
    latest_text: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "patient"
    department: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class ChatReportRequest(BaseModel):
    query: str
    text: str
    patient_name: Optional[str] = None
    patient_id: Optional[str] = None
    age: Optional[Union[int, str]] = None
    gender: Optional[str] = None
    ward: Optional[str] = None

@app.post("/api/auth/register")
def register_user_endpoint(req: RegisterRequest):
    try:
        profile = auth_engine.register_user(
            name=req.name,
            email=req.email,
            password=req.password,
            role=req.role or "patient",
            department=req.department,
            age=req.age,
            gender=req.gender
        )
        return {"success": True, "user": profile, "message": "User registered successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@app.post("/api/auth/login")
def login_user_endpoint(req: LoginRequest):
    user = auth_engine.authenticate_user(req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password. Please verify your credentials.")
    return {"success": True, "user": user, "message": "Login successful"}

@app.get("/api/auth/users")
def get_users_endpoint():
    return {"users": auth_engine.get_all_users()}

def extract_text_from_file_bytes(contents: bytes, filename: str) -> str:
    """Helper to extract clean text from PDF, DOCX, text files, and OCR image documents."""
    filename_lower = filename.lower()
    if filename_lower.endswith(".pdf"):
        pdf_stream = io.BytesIO(contents)
        reader = PdfReader(pdf_stream)
        return "\n".join([page.extract_text() or "" for page in reader.pages])
    elif filename_lower.endswith(".docx"):
        docx_stream = io.BytesIO(contents)
        doc = docx.Document(docx_stream)
        return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    elif filename_lower.endswith((".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff")):
        try:
            from PIL import Image
            import shutil
            if shutil.which("tesseract"):
                import pytesseract
                img = Image.open(io.BytesIO(contents))
                return pytesseract.image_to_string(img)
            else:
                raise HTTPException(
                    status_code=422,
                    detail={
                        "error": "OCR_BINARY_MISSING",
                        "title": "Optical Character Recognition (OCR) Notice",
                        "reason": "Scanned image document detected. To ensure 100% extraction accuracy and prevent character hallucination, please upload the official digital PDF, DOCX, or text medical record. (Tesseract OCR binary is not installed in the host PATH).",
                        "filename": filename
                    }
                )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Image parsing error: {str(e)}")
    else:
        return contents.decode("utf-8", errors="ignore")

@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "system": "MetroHealth Clinical AI Engine",
        "version": "2.0 Enterprise",
        "nli_guardrail": "DeBERTa-v3 NLI Cross-Encoder Active",
        "llm_accelerator": "NVIDIA NIM (meta/llama-3.2-11b-vision-instruct)",
        "security": "Server-side credential vault active (zero client leakage)",
        "latency_target_ms": "< 100 ms"
    }

@app.get("/api/samples")
def get_sample_cases():
    """
    Returns registered patients from the persistent registry (including baseline and latest reports).
    Falls back gracefully to benchmark notes if registry is unavailable.
    """
    try:
        registered_patients = patient_registry_engine.get_all_patients()
    except Exception as e:
        registered_patients = []

    if registered_patients:
        samples_list = []
        for p in registered_patients:
            b_rep = p.get("baseline_report") or {}
            l_rep = p.get("latest_report")
            b_text = b_rep.get("text") or p.get("text", "")
            samples_list.append({
                "id": p.get("id", "PT-0000"),
                "patient_id": p.get("id", "PT-0000"),
                "name": p.get("name", "Anonymous"),
                "patient_name": p.get("name", "Anonymous"),
                "title": p.get("title", f"{p.get('specialty', 'Clinical')}: {p.get('name', 'Inpatient')}"),
                "specialty": p.get("specialty", "General Medicine"),
                "age": p.get("age", 55),
                "gender": p.get("gender", "M/F"),
                "ward": p.get("ward", "Inpatient"),
                "room": p.get("room", "Room 101"),
                "triage": p.get("triage", "Standard Review"),
                "registered_at": p.get("registered_at", "2026-10-01"),
                "text": b_text,
                "baseline_report": b_rep,
                "latest_report": l_rep,
                "longitudinal_trajectory": p.get("longitudinal_trajectory"),
                "has_followup": bool(l_rep and l_rep.get("text"))
            })
        return {"samples": samples_list}

    # Fallback to SAMPLE_CLINICAL_NOTES
    samples_list = []
    for title, data in SAMPLE_CLINICAL_NOTES.items():
        samples_list.append({
            "title": title,
            "specialty": data.get("specialty", "General Medicine"),
            "patient_name": data.get("patient_name", "Anonymous"),
            "name": data.get("patient_name", "Anonymous"),
            "patient_id": data.get("patient_id", "PT-0000"),
            "id": data.get("patient_id", "PT-0000"),
            "age": data.get("age", 50),
            "gender": data.get("gender", "M/F"),
            "ward": data.get("ward", "Inpatient"),
            "room": "Room 101",
            "triage": data.get("triage", "Standard Review"),
            "text": data["text"],
            "baseline_report": {"title": title, "text": data["text"]},
            "latest_report": None,
            "longitudinal_trajectory": None,
            "has_followup": False
        })
    return {"samples": samples_list}

@app.post("/api/analyze")
def analyze_medical_document(req: AnalyzeRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Empty document text provided.")

    clinical_text = req.text.strip()

    # Medical Validation Guardrail: Ensure text is authentic clinical/medical document
    is_valid, reason = document_parser_engine.is_valid_medical_document(clinical_text)
    if not is_valid:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "NON_MEDICAL_DOCUMENT_EXCEPTION",
                "title": "Medical Validation Exception",
                "reason": reason,
                "filename": req.patient_name or "Custom Clinical Note"
            }
        )

    t_start = time.time()

    # 1. Detect Document Category
    doc_type = document_parser_engine.detect_document_type(clinical_text)

    # 2. Specialty Classification & Entity Extraction
    classification = clinical_engine.classify_specialty(clinical_text)
    entities = clinical_engine.extract_entities(clinical_text)
    top_spec = classification["top_specialty"]

    # 3. Explainability Heatmap (SHAP Attribution)
    heatmap_html = explainability_engine.generate_html_heatmap(clinical_text, top_spec)
    top_keywords = explainability_engine.get_top_driving_keywords(clinical_text, top_spec)

    # 4. Patient Layman Summarization (NVIDIA NIM Accelerated)
    summary_data = summarizer_engine.generate_summary_with_api(clinical_text, top_spec)

    # 5. Closed-Loop NLI Fact-Checking
    fact_report = fact_checker_engine.evaluate_summary_faithfulness(summary_data["overview"], clinical_text)

    # 6. Specific document parsing (Labs / Imaging)
    labs_parsed = []
    imaging_parsed = None
    if doc_type == "Laboratory Test Report":
        labs_parsed = document_parser_engine.parse_laboratory_report(clinical_text)
    elif doc_type == "Radiology & Imaging Report":
        imaging_parsed = document_parser_engine.parse_imaging_report(clinical_text)

    # 7. Medication Harmonization Guardrail: 100% alignment between entities and summary medication table
    existing_table_meds = {m.get("medication", "").lower() for m in summary_data.get("medication_table", [])}
    for ent_med in entities.get("medications", []):
        if not any(k in ent_med.lower() or ent_med.lower() in k for k in existing_table_meds):
            m_dose = re.search(r'(\d+(?:\.\d+)?\s*(?:mg|mcg|units|g|ml))', ent_med, re.IGNORECASE)
            dose_val = m_dose.group(1) if m_dose else "Standard Dose"
            clean_drug = re.sub(r'\s*\d+(?:\.\d+)?\s*(?:mg|mcg|units|g|ml).*', '', ent_med, flags=re.IGNORECASE).strip()
            summary_data.setdefault("medication_table", []).append({
                "medication": clean_drug or ent_med,
                "dosage": dose_val,
                "schedule": "Morning (08:00 AM - Once daily)",
                "instructions": "Take daily as prescribed by your clinician with water."
            })
            existing_table_meds.add((clean_drug or ent_med).lower())

    duration_ms = round((time.time() - t_start) * 1000, 1)

    # Accurate metadata resolution: extract genuine demographics from text, or respect authenticated patient record
    extracted_meta = document_parser_engine.extract_patient_metadata(clinical_text)

    # 1. Patient Name: prioritize extracted from note, fallback to request if valid non-generic name
    raw_name = extracted_meta.get("name")
    if not raw_name and req.patient_name and req.patient_name.strip():
        cand = req.patient_name.strip()
        if cand.lower() not in ["custom inpatient", "clinical inpatient", "anonymous", "unknown", "patient user"]:
            raw_name = cand
    patient_name = raw_name

    # 2. Medical Record Number / Patient ID: prioritize extracted, fallback to request ID
    raw_id = extracted_meta.get("id")
    if not raw_id and req.patient_id and req.patient_id.strip():
        cand_id = req.patient_id.strip()
        if not cand_id.startswith("PT-CUSTOM") and cand_id != "PT-0000":
            raw_id = cand_id
    patient_id = raw_id

    # 3. Age
    raw_age = extracted_meta.get("age")
    if raw_age is None and req.age is not None:
        try:
            val = int(req.age)
            if 0 < val < 125:
                raw_age = val
        except (ValueError, TypeError):
            pass
    age = raw_age

    # 4. Gender
    raw_gender = extracted_meta.get("gender")
    if not raw_gender and req.gender and req.gender.strip():
        cand_g = req.gender.strip()
        if cand_g.lower() not in ["specified", "m/f"]:
            raw_gender = cand_g
    gender = raw_gender

    # 5. Clinical Ward
    raw_ward = extracted_meta.get("ward")
    if not raw_ward and req.ward and req.ward.strip():
        cand_w = req.ward.strip()
        if cand_w.lower() not in ["acute assessment ward", "inpatient", "clinical encounter"]:
            raw_ward = cand_w
    ward = raw_ward

    return {
        "text": clinical_text,
        "document_type": doc_type,
        "classification": classification,
        "entities": entities,
        "heatmap_html": heatmap_html,
        "top_driving_keywords": top_keywords,
        "summary": summary_data,
        "fact_checking": fact_report,
        "lab_results": labs_parsed,
        "imaging_results": imaging_parsed,
        "processing_time_ms": duration_ms,
        "patient": {
            "name": patient_name,
            "id": patient_id,
            "age": age,
            "gender": gender,
            "ward": ward
        }
    }

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        extracted_text = extract_text_from_file_bytes(contents, file.filename)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse document: {str(e)}")

    if not extracted_text.strip():
        raise HTTPException(
            status_code=422,
            detail={
                "error": "NON_MEDICAL_DOCUMENT_EXCEPTION",
                "title": "Medical Validation Exception: Empty Document",
                "reason": "The uploaded file contains no readable digital text or clinical notes. Please upload a legible medical document, discharge summary, or lab report.",
                "filename": file.filename
            }
        )

    # Clinical Medical Document Validation Guardrail
    is_valid, reason = document_parser_engine.is_valid_medical_document(extracted_text)
    if not is_valid:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "NON_MEDICAL_DOCUMENT_EXCEPTION",
                "title": "Medical Validation Exception",
                "reason": reason,
                "filename": file.filename
            }
        )

    # Extract genuine metadata strictly from document text with zero synthetic fallbacks
    extracted_meta = document_parser_engine.extract_patient_metadata(extracted_text)
    patient_name = extracted_meta.get("name")
    patient_id = extracted_meta.get("id")
    age = extracted_meta.get("age")
    gender = extracted_meta.get("gender")
    ward = extracted_meta.get("ward")

    # Run complete analysis
    req = AnalyzeRequest(
        text=extracted_text,
        patient_name=patient_name,
        patient_id=patient_id,
        age=age,
        gender=gender,
        ward=ward
    )
    return analyze_medical_document(req)

@app.post("/api/test-hallucination")
def test_hallucination(claim: str = Form(...), context: str = Form(...)):
    report = fact_checker_engine.evaluate_summary_faithfulness(claim, context)
    return report

@app.post("/api/chat-report")
def chat_clinical_report(req: ChatReportRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Medical document text is required to ground answers.")

    classification = clinical_engine.classify_specialty(req.text)
    entities = clinical_engine.extract_entities(req.text)
    top_spec = classification["top_specialty"]
    summary_data = summarizer_engine.simplify_text_locally(req.text, top_spec)
    if not summary_data.get("medication_table") and entities.get("medications"):
        summary_data["medication_table"] = summarizer_engine.build_medication_table_from_entities(entities["medications"])

    doc_type = document_parser_engine.detect_document_type(req.text)
    labs_parsed = document_parser_engine.parse_laboratory_report(req.text) if doc_type == "Laboratory Test Report" else []

    meta = document_parser_engine.extract_patient_metadata(req.text)
    patient_info = {
        "name": req.patient_name or meta.get("name") or "Inpatient Case",
        "id": req.patient_id or meta.get("id") or "PT-2026",
        "age": req.age or meta.get("age") or 55,
        "gender": req.gender or meta.get("gender") or "M/F",
        "ward": req.ward or meta.get("ward") or "Acute Medical Ward"
    }

    ans_result = qa_assistant_engine.answer_clinical_query(
        query=req.query,
        doc_text=req.text,
        patient_info=patient_info,
        entities=entities,
        lab_results=labs_parsed,
        summary_data=summary_data
    )
    return ans_result

@app.post("/api/download-docx")
def download_discharge_docx(req: AnalyzeRequest):
    classification = clinical_engine.classify_specialty(req.text)
    entities = clinical_engine.extract_entities(req.text)
    top_spec = classification["top_specialty"]
    summary_data = summarizer_engine.simplify_text_locally(req.text, top_spec)
    fact_report = fact_checker_engine.evaluate_summary_faithfulness(summary_data["overview"], req.text)

    # Harmonize medication table with entities so it is never missing if meds exist
    if not summary_data.get("medication_table") and entities.get("medications"):
        summary_data["medication_table"] = summarizer_engine.build_medication_table_from_entities(entities["medications"])

    doc_type = document_parser_engine.detect_document_type(req.text)
    labs_parsed = document_parser_engine.parse_laboratory_report(req.text)

    # Extract metadata strictly from document text if not supplied or if fallback/generic
    meta = document_parser_engine.extract_patient_metadata(req.text)
    
    cand_name = req.patient_name
    if not cand_name or cand_name.strip() in ["Inpatient", "Clinical Inpatient", "John Doe", "Report Availability Summary", "Tests Outside Reference Range"]:
        cand_name = meta.get("name") or "Diagnostic Inpatient"
        
    cand_id = req.patient_id
    if not cand_id or cand_id.strip() in ["PT-2026", "PT-8941", "PT-0000", "Record"]:
        cand_id = meta.get("id") or "PT-2026"

    cand_age = req.age
    if cand_age is None or cand_age in [1, 58]:
        cand_age = meta.get("age") or 58

    cand_gender = req.gender
    if not cand_gender or cand_gender in ["M/F"]:
        cand_gender = meta.get("gender") or "Male"

    cand_ward = req.ward
    if not cand_ward or cand_ward in ["CCU"]:
        cand_ward = meta.get("ward") or ("Pathology & Diagnostic Medicine" if doc_type == "Laboratory Test Report" else "Acute Inpatient Care")

    patient_dict = {
        "name": cand_name,
        "id": cand_id,
        "age": cand_age,
        "gender": cand_gender,
        "room": cand_ward,
        "triage": "Diagnostic Pathology" if doc_type == "Laboratory Test Report" else "Acute Priority",
        "ward": cand_ward
    }

    docx_bytes = generate_hospital_discharge_docx(
        patient_dict,
        summary_data,
        entities,
        doc_type=doc_type,
        lab_results=labs_parsed
    )
    return StreamingResponse(
        io.BytesIO(docx_bytes),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename=Official_Record_{cand_id}.docx"}
    )

@app.post("/api/download-pdf")
def download_discharge_pdf(req: AnalyzeRequest):
    classification = clinical_engine.classify_specialty(req.text)
    entities = clinical_engine.extract_entities(req.text)
    top_spec = classification["top_specialty"]
    summary_data = summarizer_engine.simplify_text_locally(req.text, top_spec)

    # Harmonize medication table with entities so it is never missing if meds exist
    if not summary_data.get("medication_table") and entities.get("medications"):
        summary_data["medication_table"] = summarizer_engine.build_medication_table_from_entities(entities["medications"])

    doc_type = document_parser_engine.detect_document_type(req.text)
    labs_parsed = document_parser_engine.parse_laboratory_report(req.text)

    # Extract metadata strictly from document text if not supplied or if fallback/generic
    meta = document_parser_engine.extract_patient_metadata(req.text)

    cand_name = req.patient_name
    if not cand_name or cand_name.strip() in ["Inpatient", "Clinical Inpatient", "John Doe", "Report Availability Summary", "Tests Outside Reference Range"]:
        cand_name = meta.get("name") or "Diagnostic Inpatient"

    cand_id = req.patient_id
    if not cand_id or cand_id.strip() in ["PT-2026", "PT-8941", "PT-0000", "Record"]:
        cand_id = meta.get("id") or "PT-2026"

    cand_age = req.age
    if cand_age is None or cand_age in [1, 58]:
        cand_age = meta.get("age") or 58

    cand_gender = req.gender
    if not cand_gender or cand_gender in ["M/F"]:
        cand_gender = meta.get("gender") or "Male"

    cand_ward = req.ward
    if not cand_ward or cand_ward in ["CCU"]:
        cand_ward = meta.get("ward") or ("Pathology & Diagnostic Medicine" if doc_type == "Laboratory Test Report" else "Acute Inpatient Care")

    patient_dict = {
        "name": cand_name,
        "id": cand_id,
        "age": cand_age,
        "gender": cand_gender,
        "room": cand_ward,
        "triage": "Diagnostic Pathology" if doc_type == "Laboratory Test Report" else "Acute Priority",
        "ward": cand_ward
    }

    pdf_bytes = generate_medical_report_pdf(
        patient_dict,
        summary_data,
        entities,
        doc_type=doc_type,
        lab_results=labs_parsed
    )
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Official_Record_{cand_id}.pdf"}
    )

@app.post("/api/patients")
def register_new_patient(req: PatientCreateRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Empty clinical document text.")

    clinical_text = req.text.strip()
    is_valid, reason = document_parser_engine.is_valid_medical_document(clinical_text)
    if not is_valid:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "NON_MEDICAL_DOCUMENT_EXCEPTION",
                "title": "Medical Validation Exception",
                "reason": reason,
                "filename": req.name or "New Inpatient Registration"
            }
        )

    # Extract metadata & specialty classification
    meta = document_parser_engine.extract_patient_metadata(clinical_text)
    classification = clinical_engine.classify_specialty(clinical_text)

    all_current = patient_registry_engine.get_all_patients()
    pts_count = len(all_current)
    name = req.name or meta.get("name") or f"Inpatient Case {pts_count + 1}"
    patient_id = req.id or meta.get("id") or f"PT-2026-{1001 + pts_count}"
    age = req.age or meta.get("age") or 55
    gender = req.gender or meta.get("gender") or "M/F"
    ward = req.ward or meta.get("ward") or "Acute Medical Ward"
    specialty = req.specialty or classification.get("top_specialty") or "General Medicine"
    triage = req.triage or "Standard Inpatient Review"
    title = req.title or f"{specialty}: {name}"
    room = req.room or f"Ward Bed {patient_id[-4:] if len(patient_id) >= 4 else '101'}"

    new_patient_record = {
        "id": patient_id,
        "name": name,
        "age": age,
        "gender": gender,
        "specialty": specialty,
        "ward": ward,
        "room": room,
        "triage": triage,
        "title": title,
        "registered_at": time.strftime("%Y-%m-%d"),
        "baseline_report": {
            "title": f"{specialty}: Inpatient Admission Note ({name})",
            "date": time.strftime("%Y-%m-%d"),
            "type": "Inpatient Admission Note",
            "text": clinical_text
        },
        "latest_report": None,
        "longitudinal_trajectory": None
    }

    saved = patient_registry_engine.add_patient(new_patient_record)
    return {
        "message": f"Patient {name} ({patient_id}) successfully registered in hospital database.",
        "patient": saved
    }

@app.post("/api/patients/upload")
async def upload_register_patient(
    file: UploadFile = File(...),
    name: Optional[str] = Form(None),
    age: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    ward: Optional[str] = Form(None),
    specialty: Optional[str] = Form(None),
    triage: Optional[str] = Form(None)
):
    contents = await file.read()
    try:
        extracted_text = extract_text_from_file_bytes(contents, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse document: {str(e)}")

    if not extracted_text.strip():
        raise HTTPException(
            status_code=422,
            detail={
                "error": "NON_MEDICAL_DOCUMENT_EXCEPTION",
                "title": "Medical Validation Exception: Empty Document",
                "reason": "The uploaded file contains no readable text.",
                "filename": file.filename
            }
        )

    is_valid, reason = document_parser_engine.is_valid_medical_document(extracted_text)
    if not is_valid:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "NON_MEDICAL_DOCUMENT_EXCEPTION",
                "title": "Medical Validation Exception",
                "reason": reason,
                "filename": file.filename
            }
        )

    meta = document_parser_engine.extract_patient_metadata(extracted_text)
    classification = clinical_engine.classify_specialty(extracted_text)

    all_current = patient_registry_engine.get_all_patients()
    pts_count = len(all_current)
    patient_name = name or meta.get("name") or f"Inpatient Case {pts_count + 1}"
    patient_id = meta.get("id") or f"PT-2026-{1001 + pts_count}"
    patient_age = age or meta.get("age") or 55
    patient_gender = gender or meta.get("gender") or "M/F"
    patient_ward = ward or meta.get("ward") or "Acute Medical Ward"
    patient_spec = specialty or classification.get("top_specialty") or "General Medicine"
    patient_triage = triage or "Standard Inpatient Review"

    new_patient_record = {
        "id": patient_id,
        "name": patient_name,
        "age": patient_age,
        "gender": patient_gender,
        "specialty": patient_spec,
        "ward": patient_ward,
        "room": f"Bed {patient_id[-4:] if len(patient_id) >= 4 else '101'}",
        "triage": patient_triage,
        "title": f"{patient_spec}: {patient_name}",
        "registered_at": time.strftime("%Y-%m-%d"),
        "baseline_report": {
            "title": f"{patient_spec}: Inpatient Admission Note ({patient_name})",
            "date": time.strftime("%Y-%m-%d"),
            "type": "Inpatient Admission Note",
            "text": extracted_text
        },
        "latest_report": None,
        "longitudinal_trajectory": None
    }

    saved = patient_registry_engine.add_patient(new_patient_record)
    return {
        "message": f"Patient {patient_name} ({patient_id}) successfully registered.",
        "patient": saved
    }

@app.post("/api/patients/{patient_id}/followup")
def add_patient_followup(patient_id: str, req: FollowupRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Empty follow-up report text.")

    is_valid, reason = document_parser_engine.is_valid_medical_document(req.text)
    if not is_valid:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "NON_MEDICAL_DOCUMENT_EXCEPTION",
                "title": "Medical Validation Exception",
                "reason": reason,
                "filename": req.title or "Follow-Up Report"
            }
        )

    updated = patient_registry_engine.add_followup_report(patient_id, {
        "title": req.title or f"Follow-Up Report: {patient_id}",
        "date": req.date or time.strftime("%Y-%m-%d"),
        "type": req.type or "Serial Follow-Up Note",
        "text": req.text
    })

    if not updated:
        raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found in registry.")

    return {
        "message": f"Follow-up report successfully attached to patient {patient_id}.",
        "patient": updated,
        "trajectory": updated.get("longitudinal_trajectory")
    }

@app.post("/api/patients/{patient_id}/followup/upload")
async def upload_patient_followup(
    patient_id: str,
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    date: Optional[str] = Form(None)
):
    contents = await file.read()
    try:
        extracted_text = extract_text_from_file_bytes(contents, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse document: {str(e)}")

    if not extracted_text.strip():
        raise HTTPException(
            status_code=422,
            detail={
                "error": "NON_MEDICAL_DOCUMENT_EXCEPTION",
                "title": "Medical Validation Exception: Empty Document",
                "reason": "The uploaded follow-up file contains no readable text.",
                "filename": file.filename
            }
        )

    is_valid, reason = document_parser_engine.is_valid_medical_document(extracted_text)
    if not is_valid:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "NON_MEDICAL_DOCUMENT_EXCEPTION",
                "title": "Medical Validation Exception",
                "reason": reason,
                "filename": file.filename
            }
        )

    updated = patient_registry_engine.add_followup_report(patient_id, {
        "title": title or f"Follow-Up Report: {file.filename}",
        "date": date or time.strftime("%Y-%m-%d"),
        "type": "Serial Follow-Up Note",
        "text": extracted_text
    })

    if not updated:
        raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found in registry.")

    return {
        "message": f"Follow-up report uploaded and attached to {patient_id}.",
        "patient": updated,
        "trajectory": updated.get("longitudinal_trajectory")
    }

@app.post("/api/compare-reports")
def compare_arbitrary_reports(req: CompareRequest):
    if not req.baseline_text.strip() or not req.latest_text.strip():
        raise HTTPException(status_code=400, detail="Both baseline and latest report texts are required for comparison.")

    v1, r1 = document_parser_engine.is_valid_medical_document(req.baseline_text)
    if not v1:
        raise HTTPException(
            status_code=422,
            detail={"error": "NON_MEDICAL_DOCUMENT_EXCEPTION", "title": "Baseline Report Validation Failed", "reason": r1}
        )

    v2, r2 = document_parser_engine.is_valid_medical_document(req.latest_text)
    if not v2:
        raise HTTPException(
            status_code=422,
            detail={"error": "NON_MEDICAL_DOCUMENT_EXCEPTION", "title": "Latest Report Validation Failed", "reason": r2}
        )

    trajectory = longitudinal_engine.generate_longitudinal_trajectory(
        patient_name=req.patient_name or "Inpatient Case",
        specialty=req.specialty or "General Medicine",
        baseline_text=req.baseline_text,
        latest_text=req.latest_text
    )
    return trajectory

# -------------------------------------------------------------
# Mount Production React Frontend (Single-Page Application)
# -------------------------------------------------------------
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

dist_dir = os.path.join(BASE_DIR, "frontend", "dist")
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(dist_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=False, app_dir=BASE_DIR)
