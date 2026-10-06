"""
Patient Registry Engine: Persistent Inpatient Database & Serial Longitudinal Archives
Manages dynamic patient registration and historical report tracking:
- Persists to data/patients_registry.json
- Supports seeding of 6 clinical benchmark patients with Baseline and Latest Follow-Up reports
- Allows dynamic addition of new patient records that persist across doctor sessions
- Stores longitudinal test comparison deltas
"""

import os
import json
import time
from typing import Dict, List, Any, Optional
from models.longitudinal_engine import longitudinal_engine

REGISTRY_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "patients_registry.json")

# Initial benchmark patients with both Baseline and Latest Follow-Up Reports
INITIAL_BENCHMARK_PATIENTS = [
    {
        "id": "PT-2026-8841",
        "track_id": "TRK-8841-01",
        "user_email": "patient@gmail.com",
        "track_name": "Marcus Vance (Self) - Cardiology Care",
        "relationship": "Self",
        "name": "Marcus Vance",
        "age": 58,
        "gender": "Male",
        "specialty": "Cardiology",
        "ward": "Coronary Intensive Care",
        "room": "CCU - Bed 402B",
        "triage": "Acute Cardiac Event",
        "title": "Cardiology: Acute Myocardial Ischemia",
        "registered_at": "2026-09-15",
        "baseline_report": {
            "title": "Cardiology: Acute Myocardial Ischemia (Inpatient Admission)",
            "date": "2026-09-15",
            "type": "Inpatient Admission Note",
            "text": (
                "PATIENT CLINICAL RECORD - DISCHARGE SUMMARY\n"
                "PATIENT: Marcus Vance | MRN: PT-2026-8841 | AGE: 58 | GENDER: Male | WARD: Coronary Intensive Care\n"
                "CHIEF COMPLAINT: Retrosternal chest pressure radiating to the left shoulder, associated with diaphoresis and shortness of breath.\n"
                "HISTORY OF PRESENT ILLNESS: The patient is a 58-year-old male with a history of essential hypertension and hyperlipidemia who presented to the emergency department after experiencing acute sub-sternal chest discomfort radiating to his left jaw and left arm. Onset occurred while climbing stairs, lasting approximately 45 minutes.\n"
                "PHYSICAL EXAMINATION: Blood pressure 158/94 mmHg, heart rate 92 bpm, respiratory rate 20 bpm, SpO2 96% on ambient air. Cardiovascular exam reveals regular rate and rhythm, with an S4 gallop noted. No peripheral edema.\n"
                "DIAGNOSTIC WORKUP: Electrocardiogram (ECG) demonstrated ST-segment depression of 1.5 mm in leads V4-V6 with T-wave inversions. Serum Cardiac Troponin I was elevated at 1.82 ng/mL (reference < 0.04 ng/mL). Coronary catheterization revealed 85% stenosis of the left anterior descending (LAD) coronary artery, successfully treated with drug-eluting stent (DES) placement.\n"
                "DISCHARGE DIAGNOSIS: Non-ST Elevation Myocardial Infarction (NSTEMI); Coronary Artery Disease.\n"
                "DISCHARGE MEDICATIONS:\n"
                "1. Aspirin 81 mg oral daily.\n"
                "2. Ticagrelor (Brilinta) 90 mg oral twice daily.\n"
                "3. Atorvastatin 80 mg oral once daily at bedtime.\n"
                "4. Metoprolol Tartrate 25 mg oral twice daily.\n"
                "5. Sublingual Nitroglycerin 0.4 mg PRN every 5 minutes for acute chest pain (maximum 3 doses).\n"
                "DISCHARGE INSTRUCTIONS: Strict low-sodium, heart-healthy diet. Avoid strenuous exertion for 2 weeks. Follow up with outpatient cardiology in 10 days. Report immediately to the emergency room for recurrent chest pain, syncope, or severe dyspnea."
            )
        },
        "latest_report": {
            "title": "Cardiology: 14-Day Post-DES Stent Follow-Up & Biomarker Resolution",
            "date": "2026-10-01",
            "type": "Outpatient Follow-Up Report",
            "text": (
                "CARDIOLOGY OUTPATIENT CLINIC - DAY 14 POST-STENT EVALUATION\n"
                "PATIENT: Marcus Vance | MRN: PT-2026-8841 | AGE: 58 | GENDER: Male\n"
                "ATTENDING PHYSICIAN: Dr. Sarah Jenkins, MD | DATE OF VISIT: 2026-10-01\n"
                "INTERVAL HISTORY: Patient returns for scheduled day-14 post-percutaneous coronary intervention (DES stent placement to LAD). He reports complete resolution of retrosternal chest pain and shortness of breath. No angina with walking 30 minutes daily. Adherent to dual antiplatelet therapy.\n"
                "PHYSICAL EXAMINATION: Alert, well-nourished male in no distress. Blood pressure 122/78 mmHg, resting heart rate 68 bpm regular, SpO2 98% on room air. Cardiac auscultation demonstrates normal S1 and S2 without gallop, rub, or murmurs. Bilateral lungs clear to auscultation.\n"
                "LABORATORY WORKUP: Serum Cardiac Troponin I has normalized to 0.03 ng/mL (reference < 0.04 ng/mL, down from 1.82 ng/mL). Repeat lipid panel demonstrates excellent response to Atorvastatin 80 mg: Total Cholesterol 142 mg/dL, LDL Cholesterol 78 mg/dL (was 154 mg/dL), Triglycerides 130 mg/dL.\n"
                "IMPRESSION & PLAN:\n"
                "1. Post-NSTEMI Status: Remarkable biomarker recovery and complete anginal relief. Stent patent.\n"
                "2. Dual Antiplatelet Therapy: Continue Aspirin 81 mg daily and Ticagrelor 90 mg twice daily for a minimum of 12 months.\n"
                "3. Lipid Target Met: Maintain Atorvastatin 80 mg. Patient cleared to begin phase II cardiac rehabilitation."
            )
        }
    },
    {
        "id": "PT-2026-9042",
        "track_id": "TRK-9042-02",
        "user_email": "patient@gmail.com",
        "track_name": "Father (Robert Vance) - Endocrinology & Diabetes Care",
        "relationship": "Father",
        "name": "Robert Vance",
        "age": 81,
        "gender": "Male",
        "specialty": "Endocrinology",
        "ward": "Subacute Geriatric Medicine",
        "room": "Bed 204",
        "triage": "Chronic Endocrine Maintenance",
        "title": "Endocrinology: Type 2 Diabetes & Chronic Kidney Monitoring",
        "registered_at": "2026-09-20",
        "baseline_report": {
            "title": "Endocrinology: Uncontrolled Type 2 Diabetes Admission Note",
            "date": "2026-09-20",
            "type": "Inpatient Admission Note",
            "text": (
                "PATIENT CLINICAL RECORD - DISCHARGE SUMMARY\n"
                "PATIENT: Robert Vance | MRN: PT-2026-9042 | AGE: 81 | GENDER: Male | WARD: Subacute Geriatric Medicine\n"
                "CHIEF COMPLAINT: Generalized fatigue, polydipsia, polyuria, and symptomatic morning hyperglycemia.\n"
                "HISTORY OF PRESENT ILLNESS: An 81-year-old male with long-standing Type 2 Diabetes Mellitus presents with worsening glycemic control. Home fingerstick glucose logs ranged from 240-310 mg/dL over the past 3 weeks. Complains of mild bilateral lower extremity paresthesias.\n"
                "PHYSICAL EXAMINATION: BP 138/82 mmHg, HR 74 bpm, BMI 27.4. Monofilament exam demonstrates reduced vibratory and pinprick sensation in bilateral halluces.\n"
                "DIAGNOSTIC WORKUP: Fasting Plasma Glucose was markedly elevated at 268 mg/dL. Glycated Hemoglobin (HbA1c) was 10.4% (target < 7.5% for age). Serum Creatinine 1.42 mg/dL with eGFR 51 mL/min/1.73m2. Urine Albumin-to-Creatinine Ratio (UACR) 180 mg/g (microalbuminuria).\n"
                "DISCHARGE DIAGNOSIS: Type 2 Diabetes Mellitus with Poor Glycemic Control; Diabetic Peripheral Neuropathy; Early Diabetic Nephropathy (Stage 3 CKD).\n"
                "DISCHARGE MEDICATIONS:\n"
                "1. Empagliflozin (Jardiance) 10 mg oral once daily in the morning.\n"
                "2. Metformin ER 500 mg oral once daily with dinner.\n"
                "3. Insulin Glargine (Lantus) 14 units subcutaneously once daily at bedtime.\n"
                "DISCHARGE INSTRUCTIONS: Strict diabetic carbohydrate-controlled diet. Daily foot inspection for blisters or pressure ulcers. Target fasting blood sugar 100-140 mg/dL. Follow up in outpatient endocrinology in 30 days."
            )
        },
        "latest_report": {
            "title": "Endocrinology: 30-Day Follow-Up & Glycemic Stabilization",
            "date": "2026-10-04",
            "type": "Outpatient Follow-Up Note",
            "text": (
                "ENDOCRINOLOGY OUTPATIENT CLINIC - 30-DAY SERIAL GLYCEMIC EVALUATION\n"
                "PATIENT: Robert Vance | MRN: PT-2026-9042 | AGE: 81 | GENDER: Male\n"
                "ATTENDING ENDOCRINOLOGIST: Dr. Elena Rostova, MD | DATE OF VISIT: 2026-10-04\n"
                "INTERVAL HISTORY: Patient returns accompanied by his son for 30-day glycemic re-evaluation following initiation of SGLT2 inhibitor (Empagliflozin) and basal Insulin Glargine. Reports substantial reduction in fatigue and resolution of polyuria. Home glucose logs average 118-135 mg/dL. No hypoglycemic events reported.\n"
                "PHYSICAL EXAMINATION: Alert and energetic. BP 126/78 mmHg, HR 70 bpm regular. Bilateral lower extremities warm without skin breakdown or pedal edema.\n"
                "LABORATORY WORKUP: Fasting Plasma Glucose has improved to 114 mg/dL (was 268 mg/dL). Repeat Glycated Hemoglobin (HbA1c) trending down to 8.1% (down from 10.4%). Serum Creatinine stable at 1.28 mg/dL with improved eGFR of 58 mL/min/1.73m2.\n"
                "IMPRESSION & PLAN:\n"
                "1. Significant Glycemic Optimization: Excellent response to Empagliflozin and basal insulin with 57% reduction in fasting blood sugars.\n"
                "2. Renal Stability: eGFR improvement noted with cardiorenal protection.\n"
                "3. Continue Current Regimen: Maintain Empagliflozin 10 mg, Metformin ER 500 mg, and Insulin Glargine 14 units. Recheck HbA1c in 3 months."
            )
        }
    },
    {
        "id": "PT-2026-7129",
        "name": "Eleanor Brooks",
        "age": 64,
        "gender": "Female",
        "specialty": "Neurology",
        "ward": "Neurological Intensive Care",
        "room": "Neuro ICU - Bed 214",
        "triage": "Emergent Stroke Code",
        "title": "Neurology: Acute Ischemic Stroke Evaluation",
        "registered_at": "2026-09-18",
        "baseline_report": {
            "title": "Neurology: Acute Ischemic Stroke Evaluation (Emergency Admission)",
            "date": "2026-09-18",
            "type": "Emergency Inpatient Admission",
            "text": (
                "PATIENT CLINICAL RECORD - DISCHARGE SUMMARY\n"
                "PATIENT: Eleanor Brooks | MRN: PT-2026-7129 | AGE: 64 | GENDER: Female | WARD: Neurological Intensive Care\n"
                "CHIEF COMPLAINT: Acute onset of right upper extremity weakness and speech difficulty.\n"
                "HISTORY OF PRESENT ILLNESS: The patient was in her usual state of health until approximately 08:30 AM when family noticed facial asymmetry, slurred speech, and weakness in her right arm and leg. NIH Stroke Scale score upon presentation was 9.\n"
                "PHYSICAL EXAMINATION: Alert and oriented x 3. Motor strength: Right upper extremity 3/5, right lower extremity 4/5. Left extremities 5/5. Mild right central facial palsy. Expressive dysphasia with intact comprehension. Blood pressure 172/98 mmHg, heart rate 86 bpm.\n"
                "DIAGNOSTIC WORKUP: Non-contrast head CT showed no acute intracranial hemorrhage. Brain MRI (DWI) demonstrated restricted diffusion in the left middle cerebral artery (MCA) territory consistent with acute ischemic infarction. Carotid Doppler ultrasound showed 60% stenosis of the left internal carotid artery. Echocardiogram revealed normal ejection fraction without intracardiac thrombus.\n"
                "DISCHARGE DIAGNOSIS: Acute Ischemic Cerebrovascular Accident (Left MCA Territory); Left Carotid Artery Atherosclerosis.\n"
                "DISCHARGE MEDICATIONS:\n"
                "1. Clopidogrel (Plavix) 75 mg oral daily.\n"
                "2. Aspirin 81 mg oral daily.\n"
                "3. Rosuvastatin 40 mg oral daily at bedtime.\n"
                "4. Lisinopril 10 mg oral daily for blood pressure control.\n"
                "DISCHARGE INSTRUCTIONS: Home physical therapy and speech therapy 3 times weekly. Strict blood pressure monitoring (target < 130/80 mmHg). Emergent hospital return precautions given for FAST symptoms: Facial droop, Arm weakness, Speech difficulty, or sudden loss of balance."
            )
        },
        "latest_report": {
            "title": "Neurology: 14-Day Post-Thrombolysis & Rehabilitation Assessment",
            "date": "2026-10-02",
            "type": "Rehabilitation Assessment Report",
            "text": (
                "NEUROLOGICAL REHABILITATION SERVICE - 14-DAY PROGRESS EVALUATION\n"
                "PATIENT: Eleanor Brooks | MRN: PT-2026-7129 | AGE: 64 | GENDER: Female\n"
                "ATTENDING NEUROLOGIST: Dr. Marcus Sterling, MD | DATE OF EVALUATION: 2026-10-02\n"
                "CLINICAL PROGRESS SUMMARY: Patient evaluated following 14 days of intensive outpatient stroke rehabilitation. Marked recovery in expressive language function and right hemiparesis noted.\n"
                "NEUROLOGICAL EXAMINATION:\n"
                "- Mental Status: Alert, conversational, full orientation. Speech is fluent with complete grammatical sentences; expressive dysphasia is fully resolved.\n"
                "- Motor Examination: Right upper extremity strength improved from 3/5 to 4+/5. Right lower extremity strength 5/5. Independent ambulation without walker.\n"
                "- Cranial Nerves: Right facial asymmetry has resolved.\n"
                "- NIH Stroke Scale Score: Improved significantly from NIHSS 9 at admission to NIHSS 2 at present (77.8% recovery).\n"
                "- Hemodynamics: Blood pressure well-controlled at 128/82 mmHg (was 172/98 mmHg), resting pulse 72 bpm.\n"
                "ASSESSMENT & REHABILITATION PLAN:\n"
                "Substantial neurological recovery post-left MCA ischemic stroke. Continue secondary prevention: Clopidogrel 75 mg, Aspirin 81 mg, Rosuvastatin 40 mg, and Lisinopril 10 mg daily. Continue outpatient physical therapy twice weekly."
            )
        }
    },
    {
        "id": "PT-2026-5512",
        "name": "David Miller",
        "age": 42,
        "gender": "Male",
        "specialty": "Orthopedics",
        "ward": "Orthopedic Surgical Care",
        "room": "Ortho Ward - Bed 308A",
        "triage": "Post-Operative Recovery",
        "title": "Orthopedics: Right Knee Meniscal Tear",
        "registered_at": "2026-09-19",
        "baseline_report": {
            "title": "Orthopedics: Right Knee Meniscal Tear (Operative Note)",
            "date": "2026-09-19",
            "type": "Operative Procedure Report",
            "text": (
                "OPERATIVE REPORT & POST-OPERATIVE DISCHARGE SUMMARY\n"
                "PATIENT: David Miller | MRN: PT-2026-5512 | AGE: 42 | GENDER: Male | WARD: Orthopedic Surgical Care\n"
                "PREOPERATIVE DIAGNOSIS: Complex tear of the medial meniscus, right knee; mild tricompartmental chondromalacia.\n"
                "PROCEDURE PERFORMED: Right knee arthroscopy with partial medial meniscectomy and chondroplasty.\n"
                "OPERATIVE FINDINGS: Diagnostic arthroscopy confirmed an unstable complex tear of the posterior horn and body of the medial meniscus. Joint effusion was moderate to severe (Grade 3). Knee flexion restricted to 80 degrees (active ROM 15 to 80 degrees). VAS pain score 7/10.\n"
                "POSTOPERATIVE COURSE: The patient tolerated the procedure well. Sterile dressings were applied, followed by a compressive Ace wrap. Full weight-bearing as tolerated with crutches for comfort.\n"
                "POSTOPERATIVE MEDICATIONS:\n"
                "1. Acetaminophen 650 mg oral every 6 hours PRN mild to moderate pain.\n"
                "2. Celecoxib (Celebrex) 200 mg oral once daily for 10 days for inflammation.\n"
                "3. Tramadol 50 mg oral every 6 hours PRN severe breakthrough pain (dispense 12 tablets).\n"
                "DISCHARGE INSTRUCTIONS: Keep dressings clean and dry for 48 hours. Cryotherapy for 20 minutes every 2 hours. Gentle ankle pumps and quadriceps sets. Suture removal scheduled in 10-14 days."
            )
        },
        "latest_report": {
            "title": "Orthopedics: 2-Week Post-Operative Suture Removal & Physical Therapy Evaluation",
            "date": "2026-10-02",
            "type": "Post-Surgical Follow-Up Report",
            "text": (
                "DEPARTMENT OF ORTHOPEDIC SURGERY - 2-WEEK POSTOPERATIVE CLINIC NOTE\n"
                "PATIENT: David Miller | MRN: PT-2026-5512 | AGE: 42 | GENDER: Male\n"
                "ATTENDING SURGEON: Dr. Robert Chen, MD | DATE OF VISIT: 2026-10-02\n"
                "INTERVAL HISTORY: Patient returns for 14-day postoperative evaluation following right knee arthroscopic partial medial meniscectomy. He reports excellent recovery with minimal pain (VAS pain score 1/10, down from 7/10). Has discontinued Tramadol and requires only occasional Acetaminophen.\n"
                "PHYSICAL EXAMINATION - RIGHT KNEE:\n"
                "- Incision Sites: Arthroscopic portal incisions are cleanly healed without erythema, warmth, or drainage. Non-absorbable portal sutures were safely removed today.\n"
                "- Joint Effusion: None to trace (Grade 0 effusion, down from Grade 3 pre-op).\n"
                "- Range of Motion: Active right knee extension is 0 degrees (full extension); active flexion is 125 degrees (normal functional range, up from 80 degrees).\n"
                "- Ligamentous Stability: Lachman and McMurray maneuvers are negative with no joint line catching.\n"
                "- Ambulation: Normal non-antalgic gait; ambulating comfortably without crutches or braces.\n"
                "IMPRESSION & PLAN:\n"
                "1. Superb healing post-right partial medial meniscectomy with full range of motion restored.\n"
                "2. Transition from crutches to full unassisted weight-bearing approved.\n"
                "3. Advance home physical therapy exercises to stationary cycling and low-impact quadriceps strengthening. Final follow-up in 6 weeks."
            )
        }
    },
    {
        "id": "PT-2026-4421",
        "name": "Maria Gonzalez",
        "age": 51,
        "gender": "Female",
        "specialty": "Endocrinology",
        "ward": "Endocrine & Metabolic Care",
        "room": "Metabolic Suite - Bed 112C",
        "triage": "Subacute Glycemic Triage",
        "title": "Endocrinology: Type 2 Diabetes with Neuropathy",
        "registered_at": "2026-09-12",
        "baseline_report": {
            "title": "Endocrinology: Type 2 Diabetes with Neuropathy (Initial Consultation)",
            "date": "2026-09-12",
            "type": "Specialty Consultation Note",
            "text": (
                "CLINICAL CONSULTATION & MANAGEMENT SUMMARY\n"
                "PATIENT: Maria Gonzalez | MRN: PT-2026-4421 | AGE: 51 | GENDER: Female | WARD: Endocrine & Metabolic Care\n"
                "CHIEF COMPLAINT: Burning dysesthesia in bilateral feet and persistently elevated self-monitored blood glucose levels (220-280 mg/dL).\n"
                "HISTORY OF PRESENT ILLNESS: Patient has a 9-year history of Type 2 Diabetes Mellitus with sub-optimal glycemic control. She reports gradual progression of burning pain and numbness in a stocking-glove distribution over the past 8 months, worse at night. Neuropathy VAS pain score 8/10.\n"
                "PHYSICAL EXAMINATION: Bilateral foot exam reveals decreased pinprick sensation and loss of 10-gram monofilament sensation in the distal plantar surfaces. Blood pressure 144/88 mmHg.\n"
                "LABORATORY WORKUP: Glycated Hemoglobin (HbA1c) 10.4% (markedly elevated). Fasting plasma glucose 236 mg/dL. Urine albumin-to-creatinine ratio 42 mcg/mg (mild microalbuminuria). Estimated GFR 78 mL/min/1.73m2.\n"
                "DIAGNOSIS: Poorly Controlled Type 2 Diabetes Mellitus; Diabetic Peripheral Neuropathy; Early Diabetic Nephropathy.\n"
                "MEDICATION REGIMEN ADJUSTMENTS:\n"
                "1. Metformin 1000 mg oral twice daily with meals.\n"
                "2. Empagliflozin (Jardiance) 10 mg oral once daily in the morning.\n"
                "3. Basal Insulin Glargine (Lantus) 16 units subcutaneously once daily at bedtime.\n"
                "4. Gabapentin 300 mg oral once daily at bedtime for neuropathic pain.\n"
                "PLAN & PREVENTIVE GUIDELINES: Strict self-monitoring of blood glucose twice daily. Daily foot inspection."
            )
        },
        "latest_report": {
            "title": "Endocrinology: 3-Week Glycemic & Neuropathy Titration Re-Check",
            "date": "2026-10-01",
            "type": "Metabolic Follow-Up Note",
            "text": (
                "ENDOCRINE & METABOLIC OUTPATIENT CLINIC - 3-WEEK FOLLOW-UP\n"
                "PATIENT: Maria Gonzalez | MRN: PT-2026-4421 | AGE: 51 | GENDER: Female\n"
                "ATTENDING ENDOCRINOLOGIST: Dr. Anita Patel, MD | DATE OF VISIT: 2026-10-01\n"
                "CLINICAL PROGRESS:\n"
                "Patient returns for 3-week metabolic follow-up following initiation of Basal Insulin Glargine, Jardiance, and Gabapentin. She reports marked relief of nocturnal foot dysesthesias; neuropathic pain score has reduced from 8/10 to 2/10.\n"
                "OBJECTIVE TELEMETRY & LAB FINDINGS:\n"
                "- Hemodynamics: Blood pressure 126/80 mmHg (improved from 144/88 mmHg), resting pulse 74 bpm.\n"
                "- Glycemic Monitoring: Fasting blood glucose has normalized from 236 mg/dL to 118 mg/dL (-50.0% reduction). 14-day continuous glucose monitoring average indicates estimated HbA1c of 7.8% (down from baseline 10.4%).\n"
                "- Renal Panel: Repeat spot urine albumin-to-creatinine ratio improved to 24 mcg/mg (was 42 mcg/mg, showing early renal preservation with SGLT2 inhibition). eGFR stable at 82 mL/min.\n"
                "- Foot Inspection: Intact sensation to monofilament test restored in medial forefoot; no ulcers or erythema.\n"
                "IMPRESSION & PLAN:\n"
                "1. Outstanding glycemic and symptomatic response with 50% fasting blood glucose reduction.\n"
                "2. Maintain Insulin Glargine 16 units at bedtime, Metformin 1000 mg BID, and Empagliflozin 10 mg daily.\n"
                "3. Continue Gabapentin 300 mg at bedtime for sustained neuropathic comfort. Comprehensive laboratory HbA1c scheduled in 8 weeks."
            )
        }
    },
    {
        "id": "PT-2026-3392",
        "name": "Raymond Ortiz",
        "age": 54,
        "gender": "Male",
        "specialty": "Pathology",
        "ward": "Clinical Biochemistry & Hematology",
        "room": "Outpatient Pathology Lab",
        "triage": "Routine Diagnostic Panel",
        "title": "Diagnostic Laboratory Report: Blood & Metabolic Panel",
        "registered_at": "2026-09-28",
        "baseline_report": {
            "title": "Diagnostic Laboratory Report: Blood & Metabolic Panel (Initial Screening)",
            "date": "2026-09-28",
            "type": "Comprehensive Laboratory Report",
            "text": (
                "METROHEALTH CENTRAL PATHOLOGY - COMPREHENSIVE LABORATORY REPORT\n"
                "PATIENT: Raymond Ortiz | ID: PT-2026-3392 | AGE: 54 | GENDER: M\n"
                "ORDERING PHYSICIAN: Dr. S. Rao, MD | SPECIMEN: Venous Blood | DATE: 2026-09-28\n\n"
                "HEMATOLOGY PANEL:\n"
                "- Hemoglobin: 11.2 g/dL [Reference: 13.5 - 17.5 g/dL] -> ABNORMAL (LOW)\n"
                "- Hematocrit: 34.1 % [Reference: 38.8 - 50.0 %] -> ABNORMAL (LOW)\n"
                "- White Blood Cell Count (WBC): 7.4 x10^3/uL [Reference: 4.5 - 11.0 x10^3/uL] -> NORMAL\n"
                "- Platelet Count: 280 x10^3/uL [Reference: 150 - 450 x10^3/uL] -> NORMAL\n\n"
                "METABOLIC & GLYCEMIC PANEL:\n"
                "- Fasting Glucose: 184 mg/dL [Reference: 70 - 99 mg/dL] -> ABNORMAL (HIGH)\n"
                "- Glycated Hemoglobin (HbA1c): 8.9 % [Reference: 4.0 - 5.6 %] -> ABNORMAL (HIGH)\n"
                "- Serum Creatinine: 1.8 mg/dL [Reference: 0.7 - 1.3 mg/dL] -> ABNORMAL (HIGH)\n"
                "- Blood Urea Nitrogen (BUN): 28 mg/dL [Reference: 7 - 20 mg/dL] -> ABNORMAL (HIGH)\n\n"
                "LIPID PROFILE:\n"
                "- Total Cholesterol: 245 mg/dL [Reference: 125 - 200 mg/dL] -> ABNORMAL (HIGH)\n"
                "- LDL Cholesterol: 162 mg/dL [Reference: 50 - 100 mg/dL] -> ABNORMAL (HIGH)\n"
                "- HDL Cholesterol: 38 mg/dL [Reference: 40 - 60 mg/dL] -> ABNORMAL (LOW)\n"
                "- Triglycerides: 225 mg/dL [Reference: 50 - 150 mg/dL] -> ABNORMAL (HIGH)\n\n"
                "PATHOLOGIST INTERPRETATION:\n"
                "Marked hypercholesterolemia with atherogenic dyslipidemia. Suboptimal glycemic control with HbA1c 8.9%. Mild normocytic anemia and early renal impairment (Creatinine 1.8 mg/dL)."
            )
        },
        "latest_report": {
            "title": "Diagnostic Laboratory Report: 30-Day Follow-Up Metabolic & Lipid Panel",
            "date": "2026-10-02",
            "type": "Follow-Up Laboratory Panel",
            "text": (
                "METROHEALTH CENTRAL PATHOLOGY - 30-DAY SERIAL LABORATORY FOLLOW-UP\n"
                "PATIENT: Raymond Ortiz | ID: PT-2026-3392 | AGE: 54 | GENDER: Male\n"
                "ORDERING PHYSICIAN: Dr. S. Rao, MD | SPECIMEN: Venous Blood | DATE: 2026-10-02\n\n"
                "HEMATOLOGY PANEL:\n"
                "- Hemoglobin: 13.2 g/dL [Reference: 13.5 - 17.5 g/dL] -> NORMAL (Substantial Recovery from 11.2 g/dL)\n"
                "- Hematocrit: 39.8 % [Reference: 38.8 - 50.0 %] -> NORMAL (was 34.1 %)\n"
                "- White Blood Cell Count (WBC): 6.8 x10^3/uL [Reference: 4.5 - 11.0 x10^3/uL] -> NORMAL\n"
                "- Platelet Count: 265 x10^3/uL [Reference: 150 - 450 x10^3/uL] -> NORMAL\n\n"
                "METABOLIC & GLYCEMIC PANEL:\n"
                "- Fasting Glucose: 112 mg/dL [Reference: 70 - 99 mg/dL] -> MILD ELEVATION (Decreased from 184 mg/dL, -39.1%)\n"
                "- Glycated Hemoglobin (HbA1c): 7.1 % [Reference: 4.0 - 5.6 %] -> IMPROVED (Reduced from 8.9%)\n"
                "- Serum Creatinine: 1.2 mg/dL [Reference: 0.7 - 1.3 mg/dL] -> NORMAL (Fully Recovered from 1.8 mg/dL, -33.3%)\n"
                "- Blood Urea Nitrogen (BUN): 16 mg/dL [Reference: 7 - 20 mg/dL] -> NORMAL (Normalized from 28 mg/dL)\n\n"
                "LIPID PROFILE (POST-ATORVASTATIN 40 MG):\n"
                "- Total Cholesterol: 165 mg/dL [Reference: 125 - 200 mg/dL] -> NORMAL (Reduced from 245 mg/dL, -32.7%)\n"
                "- LDL Cholesterol: 88 mg/dL [Reference: 50 - 100 mg/dL] -> NORMAL / AT TARGET (Reduced from 162 mg/dL, -45.7%)\n"
                "- HDL Cholesterol: 49 mg/dL [Reference: 40 - 60 mg/dL] -> NORMAL (Increased from 38 mg/dL)\n"
                "- Triglycerides: 140 mg/dL [Reference: 50 - 150 mg/dL] -> NORMAL (Normalized from 225 mg/dL, -37.8%)\n\n"
                "PATHOLOGIST COMPARATIVE INTERPRETATION:\n"
                "Marked multi-system laboratory resolution. Complete lipid target attainment with LDL < 90 mg/dL. Renal filtration metrics have fully normalized with Creatinine 1.2 mg/dL. Anemia resolved with Hemoglobin reaching 13.2 g/dL."
            )
        }
    },
    {
        "id": "PT-2026-9045",
        "name": "Clara Higgins",
        "age": 67,
        "gender": "Female",
        "specialty": "Pulmonology",
        "ward": "Diagnostic Imaging Center",
        "room": "Radiology Suite B",
        "triage": "Urgent Diagnostic Scan",
        "title": "Radiology & Imaging Report: High-Resolution Chest CT Scan",
        "registered_at": "2026-09-22",
        "baseline_report": {
            "title": "Radiology & Imaging Report: High-Resolution Chest CT Scan (Admission)",
            "date": "2026-09-22",
            "type": "Thoracic CT Imaging Report",
            "text": (
                "DEPARTMENT OF DIAGNOSTIC RADIOLOGY - COMPUTED TOMOGRAPHY (CT) REPORT\n"
                "PATIENT: Clara Higgins | ID: PT-2026-9045 | AGE: 67 | GENDER: F\n"
                "EXAMINATION: CT Chest with Intravenous Contrast\n"
                "CLINICAL INDICATION: 67-year-old female with persistent productive cough, right-sided pleuritic chest pain, and fever unresponsive to oral amoxicillin.\n"
                "PHYSICAL EXAMINATION: Temperature 102.4°F, respiratory rate 26 bpm, SpO2 89% on ambient air. White blood cell count elevated at 16.8 x10^3/uL.\n"
                "FINDINGS:\n"
                "LUNGS & PLEURA: Dense alveolar consolidation with prominent air bronchograms demonstrated in the posterior segment of the right lower lobe, consistent with dense lobar pneumonia. No cavitary necrosis. Trace right-sided reactive pleural effusion without loculation. Clear left lung parenchyma.\n"
                "IMPRESSION:\n"
                "1. Acute right lower lobe lobar consolidation characteristic of dense community-acquired bacterial pneumonia.\n"
                "2. Associated small reactive right pleural effusion without loculation.\n"
                "3. Negative for acute pulmonary embolism."
            )
        },
        "latest_report": {
            "title": "Pulmonology: Day 10 Post-Antibiotic Clinical & Imaging Resolution",
            "date": "2026-10-02",
            "type": "Pulmonary Follow-Up Report",
            "text": (
                "PULMONARY CLINICAL MEDICINE - DAY 10 POST-ANTIBIOTIC EVALUATION\n"
                "PATIENT: Clara Higgins | MRN: PT-2026-9045 | AGE: 67 | GENDER: Female\n"
                "ATTENDING PULMONOLOGIST: Dr. Elena Rostova, MD | DATE OF VISIT: 2026-10-02\n"
                "INTERVAL HISTORY: Patient returns for post-treatment follow-up following completion of 10 days of intravenous Ceftriaxone and oral Azithromycin for severe right lower lobe lobar pneumonia. Patient is clinically afebrile for 7 consecutive days (Temperature 98.6°F). Pleuritic chest pain and purulent sputum are completely resolved.\n"
                "PHYSICAL EXAMINATION: In no respiratory distress. SpO2 is 97% on ambient air (improved from 89%). Respiratory rate is 16 breaths per minute. Chest auscultation reveals clear vesicular breath sounds bilaterally with only minimal trace end-inspiratory crackles at the right lung base.\n"
                "LABORATORY WORKUP: White Blood Cell count (WBC) has normalized from 16.8 x10^3/uL to 7.2 x10^3/uL (infection cleared).\n"
                "FOLLOW-UP CHEST RADIOLOGY:\n"
                "Repeat thoracic imaging confirms near-complete resolution (>90% clearance) of the right lower lobe consolidation. The previous reactive pleural effusion has completely reabsorbed. No new pulmonary infiltrates.\n"
                "IMPRESSION & PLAN:\n"
                "1. Complete clinical and radiological resolution of bacterial community-acquired pneumonia.\n"
                "2. Patient is cleared for resumption of normal daily activities. Inpatient antibiotics successfully completed."
            )
        }
    }
]

class PatientRegistryEngine:
    def __init__(self):
        self._ensure_storage()

    def _ensure_storage(self):
        """Initializes the persistent registry JSON file if not present."""
        if not os.path.exists(REGISTRY_FILE):
            os.makedirs(os.path.dirname(REGISTRY_FILE), exist_ok=True)
            self._save_all(INITIAL_BENCHMARK_PATIENTS)

    def _load_all(self) -> List[Dict[str, Any]]:
        """Loads all patients from disk."""
        try:
            with open(REGISTRY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list) and len(data) > 0:
                    return data
        except Exception as e:
            print(f"Error loading registry, resetting to default: {e}")
        return list(INITIAL_BENCHMARK_PATIENTS)

    def _save_all(self, patients: List[Dict[str, Any]]):
        """Saves all patients to disk."""
        try:
            with open(REGISTRY_FILE, "w", encoding="utf-8") as f:
                json.dump(patients, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error saving registry: {e}")

    def get_all_patients(self) -> List[Dict[str, Any]]:
        """Returns all patients in the registry."""
        patients = self._load_all()
        # Add dynamic longitudinal analysis summaries to each patient
        for p in patients:
            b_rep = p.get("baseline_report")
            l_rep = p.get("latest_report")
            if (
                isinstance(b_rep, dict) and b_rep.get("text") and
                isinstance(l_rep, dict) and l_rep.get("text")
            ):
                b_text = b_rep.get("text", "")
                l_text = l_rep.get("text", "")
                p["longitudinal_trajectory"] = longitudinal_engine.generate_longitudinal_trajectory(
                    patient_name=p["name"],
                    specialty=p.get("specialty", "General Medicine"),
                    baseline_text=b_text,
                    latest_text=l_text
                )
            else:
                p["longitudinal_trajectory"] = None
        return patients

    def get_patient_by_id(self, patient_id: str) -> Optional[Dict[str, Any]]:
        """Finds a patient by ID."""
        for p in self.get_all_patients():
            if p["id"].lower() == patient_id.lower():
                return p
        return None

    def get_patient_by_name(self, patient_name: str) -> Optional[Dict[str, Any]]:
        """Finds a patient by Name."""
        q = patient_name.lower().strip()
        for p in self.get_all_patients():
            if q in p["name"].lower():
                return p
        return None

    def add_patient(self, new_patient: Dict[str, Any]) -> Dict[str, Any]:
        """
        Adds a new patient record to the persistent registry.
        """
        patients = self._load_all()

        # Generate unique ID if missing
        if not new_patient.get("id"):
            count = len(patients) + 1
            new_patient["id"] = f"PT-2026-{1000 + count}"

        if not new_patient.get("title"):
            new_patient["title"] = f"{new_patient.get('specialty', 'Clinical')}: {new_patient.get('name', 'New Inpatient')}"

        # If baseline report missing, create from text
        if "baseline_report" not in new_patient and "text" in new_patient:
            new_patient["baseline_report"] = {
                "title": f"Initial Clinical Note: {new_patient.get('name')}",
                "date": "2026-10-02",
                "type": "Initial Inpatient Note",
                "text": new_patient["text"]
            }

        # Check if already exists by ID
        existing_idx = next((i for i, p in enumerate(patients) if p["id"].lower() == new_patient["id"].lower()), None)
        if existing_idx is not None:
            patients[existing_idx] = new_patient
        else:
            patients.append(new_patient)

        self._save_all(patients)
        return new_patient

    def add_followup_report(self, patient_id: str, followup_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Attaches or updates the latest serial report for an existing patient.
        """
        patients = self._load_all()
        for p in patients:
            if p["id"].lower() == patient_id.lower() or p["name"].lower() == patient_id.lower():
                # Set latest report
                p["latest_report"] = {
                    "title": followup_data.get("title", f"Follow-Up Report: {p['name']}"),
                    "date": followup_data.get("date", "2026-10-02"),
                    "type": followup_data.get("type", "Serial Follow-Up Report"),
                    "text": followup_data.get("text", "")
                }
                # Recalculate longitudinal trajectory
                b_text = (p.get("baseline_report") or {}).get("text") or p.get("text", "")
                l_text = p["latest_report"]["text"]
                p["longitudinal_trajectory"] = longitudinal_engine.generate_longitudinal_trajectory(
                    patient_name=p["name"],
                    specialty=p.get("specialty", "General Medicine"),
                    baseline_text=b_text,
                    latest_text=l_text
                )
                self._save_all(patients)
                return p
        return None

    def get_tracks_by_user_email(self, user_email: str) -> List[Dict[str, Any]]:
        """
        Retrieves all health tracks / family dossiers associated with a registered user.
        """
        email_clean = (user_email or "").strip().lower()
        all_patients = self.get_all_patients()
        matched = []
        for p in all_patients:
            p_email = (p.get("user_email") or "").strip().lower()
            if email_clean and p_email == email_clean:
                matched.append(p)
            elif email_clean in ["patient@gmail.com", "marcus@gmail.com"] and p.get("id") in ["PT-2026-8841", "PT-2026-9042"]:
                if p not in matched:
                    matched.append(p)
        return matched

    def create_user_track(self, user_email: str, track_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creates and stores a new health track / family member dossier for a registered user.
        """
        patients = self._load_all()
        count = len(patients) + 1
        track_id = track_data.get("id") or f"TRK-{1000 + count}"
        
        record = {
            "id": track_id,
            "track_id": track_id,
            "user_email": user_email.strip().lower(),
            "track_name": track_data.get("track_name") or f"Health Track: {track_data.get('name', 'Family Member')}",
            "relationship": track_data.get("relationship", "Family Member"),
            "name": track_data.get("name", "Family Member"),
            "age": track_data.get("age", 45),
            "gender": track_data.get("gender", "M/F"),
            "specialty": track_data.get("specialty", "General Medicine"),
            "ward": track_data.get("ward", "Outpatient Care"),
            "room": track_data.get("room", "Home Health"),
            "triage": track_data.get("triage", "Standard Monitoring"),
            "title": track_data.get("track_name") or f"{track_data.get('specialty', 'Care')}: {track_data.get('name', 'Member')}",
            "registered_at": track_data.get("registered_at") or time.strftime("%Y-%m-%d"),
            "baseline_report": track_data.get("baseline_report") or {
                "title": f"Initial Baseline Note: {track_data.get('name')}",
                "date": time.strftime("%Y-%m-%d"),
                "type": "Initial Diagnostic Encounter",
                "text": track_data.get("text", "")
            },
            "latest_report": track_data.get("latest_report"),
            "longitudinal_trajectory": None
        }
        
        # If both baseline and latest exist, compute trajectory
        b_txt = (record.get("baseline_report") or {}).get("text")
        l_txt = (record.get("latest_report") or {}).get("text")
        if b_txt and l_txt:
            record["longitudinal_trajectory"] = longitudinal_engine.generate_longitudinal_trajectory(
                patient_name=record["name"],
                specialty=record["specialty"],
                baseline_text=b_txt,
                latest_text=l_txt
            )
            
        patients.insert(0, record)
        self._save_all(patients)
        return record

patient_registry_engine = PatientRegistryEngine()
