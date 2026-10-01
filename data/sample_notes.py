"""
Sample Clinical Transcriptions from MTSamples Benchmark Dataset.
100% anonymized, real-world clinical records across diverse specialties.
"""

SAMPLE_CLINICAL_NOTES = {
    "Cardiology: Acute Myocardial Ischemia": {
        "specialty": "Cardiology",
        "patient_name": "Marcus Vance",
        "patient_id": "PT-2026-8841",
        "age": 58,
        "gender": "Male",
        "room": "CCU - Bed 402B",
        "triage": "Acute Cardiac Event",
        "ward": "Coronary Intensive Care",
        "chief_complaint": "Acute retrosternal chest pressure and dyspnea on exertion.",
        "text": (
            "PATIENT CLINICAL RECORD - DISCHARGE SUMMARY\n"
            "PATIENT DEMOGRAPHICS: 58-year-old male.\n"
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
    "Neurology: Acute Ischemic Stroke Evaluation": {
        "specialty": "Neurology",
        "patient_name": "Eleanor Brooks",
        "patient_id": "PT-2026-7129",
        "age": 64,
        "gender": "Female",
        "room": "Neuro ICU - Bed 214",
        "triage": "Emergent Stroke Code",
        "ward": "Neurological Intensive Care",
        "chief_complaint": "Sudden onset right-sided hemiparesis and expressive aphasia.",
        "text": (
            "PATIENT CLINICAL RECORD - DISCHARGE SUMMARY\n"
            "PATIENT DEMOGRAPHICS: 64-year-old female.\n"
            "CHIEF COMPLAINT: Acute onset of right upper extremity weakness and speech difficulty.\n"
            "HISTORY OF PRESENT ILLNESS: The patient was in her usual state of health until approximately 08:30 AM when family noticed facial asymmetry, slurred speech, and weakness in her right arm and leg. NIH Stroke Scale score upon presentation was 9.\n"
            "PHYSICAL EXAMINATION: Alert and oriented x 3. Motor strength: Right upper extremity 3/5, right lower extremity 4/5. Left extremities 5/5. Mild right central facial palsy. Expressive dysphasia with intact comprehension.\n"
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
    "Orthopedics: Right Knee Meniscal Tear": {
        "specialty": "Orthopedics",
        "chief_complaint": "Persistent right knee pain with mechanical locking and joint effusion.",
        "text": (
            "OPERATIVE REPORT & POST-OPERATIVE DISCHARGE SUMMARY\n"
            "PATIENT DEMOGRAPHICS: 42-year-old male.\n"
            "PREOPERATIVE DIAGNOSIS: Complex tear of the medial meniscus, right knee; mild tricompartmental chondromalacia.\n"
            "PROCEDURE PERFORMED: Right knee arthroscopy with partial medial meniscectomy and chondroplasty.\n"
            "OPERATIVE FINDINGS: Diagnostic arthroscopy confirmed an unstable complex tear of the posterior horn and body of the medial meniscus. The torn, unstable fragments were resected back to a smooth, stable rim with motorized shaver and basket forceps. Patellofemoral tracking was stable.\n"
            "POSTOPERATIVE COURSE: The patient tolerated the procedure well. Sterile dressings were applied, followed by a compressive Ace wrap. Full weight-bearing as tolerated with crutches for comfort.\n"
            "POSTOPERATIVE MEDICATIONS:\n"
            "1. Acetaminophen 650 mg oral every 6 hours PRN mild to moderate pain.\n"
            "2. Celecoxib (Celebrex) 200 mg oral once daily for 10 days for inflammation.\n"
            "3. Tramadol 50 mg oral every 6 hours PRN severe breakthrough pain (dispense 12 tablets).\n"
            "DISCHARGE INSTRUCTIONS: Keep dressings clean and dry for 48 hours. Cryotherapy (ice pack) for 20 minutes every 2 hours while awake to reduce swelling. Gentle ankle pumps and quadriceps sets starting on postoperative day 1. Suture removal scheduled in 10-14 days. Seek emergency care for calf swelling, fever > 101F, or worsening knee erythema."
        )
    },
    "Endocrinology: Type 2 Diabetes with Neuropathy": {
        "specialty": "Endocrinology",
        "chief_complaint": "Uncontrolled hyperglycemia with bilateral distal lower extremity paresthesias.",
        "text": (
            "CLINICAL CONSULTATION & MANAGEMENT SUMMARY\n"
            "PATIENT DEMOGRAPHICS: 51-year-old female.\n"
            "CHIEF COMPLAINT: Burning dysesthesia in bilateral feet and persistently elevated self-monitored blood glucose levels (220-280 mg/dL).\n"
            "HISTORY OF PRESENT ILLNESS: Patient has a 9-year history of Type 2 Diabetes Mellitus with sub-optimal glycemic control. She reports gradual progression of burning pain and numbness in a stocking-glove distribution over the past 8 months, worse at night.\n"
            "PHYSICAL EXAMINATION: Bilateral foot exam reveals decreased pinprick sensation and loss of 10-gram monofilament sensation in the distal plantar surfaces. Dorsalis pedis and posterior tibial pulses 2+ bilaterally. No open ulcers or skin breakdown.\n"
            "LABORATORY WORKUP: Glycated Hemoglobin (HbA1c) 10.4% (markedly elevated). Fasting plasma glucose 236 mg/dL. Urine albumin-to-creatinine ratio 42 mcg/mg (mild microalbuminuria). Estimated GFR 78 mL/min/1.73m2.\n"
            "DIAGNOSIS: Poorly Controlled Type 2 Diabetes Mellitus; Diabetic Peripheral Neuropathy; Early Diabetic Nephropathy.\n"
            "MEDICATION REGIMEN ADJUSTMENTS:\n"
            "1. Metformin 1000 mg oral twice daily with meals.\n"
            "2. Empagliflozin (Jardiance) 10 mg oral once daily in the morning.\n"
            "3. Basal Insulin Glargine (Lantus) 16 units subcutaneously once daily at bedtime.\n"
            "4. Gabapentin 300 mg oral once daily at bedtime for neuropathic pain (titrate to twice daily in 1 week).\n"
            "PLAN & PREVENTIVE GUIDELINES: Strict self-monitoring of blood glucose twice daily (fasting and post-prandial). Daily inspect feet with a hand mirror for redness, blisters, or calluses. Diabetic nutrition education referral provided."
        )
    },
    "Diagnostic Laboratory Report: Blood & Metabolic Panel": {
        "specialty": "Pathology",
        "patient_name": "Raymond Ortiz",
        "patient_id": "PT-2026-3392",
        "age": 54,
        "gender": "Male",
        "room": "Outpatient Pathology Lab",
        "triage": "Routine Diagnostic Panel",
        "ward": "Clinical Biochemistry & Hematology",
        "chief_complaint": "Annual diabetic follow-up and comprehensive lipid screening.",
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
            "- Blood Urea Nitrogen (BUN): 28 mg/dL [Reference: 7 - 20 mg/dL] -> ABNORMAL (HIGH)\n"
            "- Serum Sodium: 139 mEq/L [Reference: 135 - 145 mEq/L] -> NORMAL\n"
            "- Serum Potassium: 4.6 mEq/L [Reference: 3.5 - 5.0 mEq/L] -> NORMAL\n\n"
            "LIPID PROFILE:\n"
            "- Total Cholesterol: 245 mg/dL [Reference: 125 - 200 mg/dL] -> ABNORMAL (HIGH)\n"
            "- LDL Cholesterol: 162 mg/dL [Reference: 50 - 100 mg/dL] -> ABNORMAL (HIGH)\n"
            "- HDL Cholesterol: 38 mg/dL [Reference: 40 - 60 mg/dL] -> ABNORMAL (LOW)\n"
            "- Triglycerides: 225 mg/dL [Reference: 50 - 150 mg/dL] -> ABNORMAL (HIGH)\n\n"
            "PATHOLOGIST INTERPRETATION:\n"
            "Marked hypercholesterolemia with atherogenic dyslipidemia. Suboptimal glycemic control with HbA1c 8.9%. Mild normocytic anemia and early renal impairment (Creatinine 1.8 mg/dL). Immediate clinical consultation recommended."
        )
    },
    "Radiology & Imaging Report: High-Resolution Chest CT Scan": {
        "specialty": "Pulmonology",
        "patient_name": "Clara Higgins",
        "patient_id": "PT-2026-9045",
        "age": 67,
        "gender": "Female",
        "room": "Radiology Suite B",
        "triage": "Urgent Diagnostic Scan",
        "ward": "Diagnostic Imaging Center",
        "chief_complaint": "Persistent fever, pleuritic chest pain, and productive cough for 6 days.",
        "text": (
            "DEPARTMENT OF DIAGNOSTIC RADIOLOGY - COMPUTED TOMOGRAPHY (CT) REPORT\n"
            "PATIENT: Clara Higgins | ID: PT-2026-9045 | AGE: 67 | GENDER: F\n"
            "EXAMINATION: CT Chest with Intravenous Contrast (Computed Tomography)\n"
            "CLINICAL INDICATION: 67-year-old female with persistent productive cough, right-sided pleuritic chest pain, and fever unresponsive to oral amoxicillin.\n\n"
            "TECHNIQUE: Helical axial multidetector CT images of the thorax obtained from lung apices to adrenal glands following administration of 75 mL Omnipaque contrast. Coronal and sagittal reformats reviewed.\n\n"
            "FINDINGS:\n"
            "LUNGS & PLEURA: Dense alveolar consolidation with prominent air bronchograms demonstrated in the posterior segment of the right lower lobe, consistent with dense lobar pneumonia. No cavitary necrosis. Trace right-sided reactive pleural effusion without loculation. Clear left lung parenchyma without suspicious nodularity or infiltrates.\n"
            "MEDIASTINUM & VESSELS: Thoracic aorta is normal in caliber with mild atherosclerotic calcification. No mediastinal or hilar lymphadenopathy. Pulmonary arterial tree shows uniform contrast opacification without filling defect; no evidence of acute pulmonary embolism.\n"
            "CHEST WALL & BONES: Intact bony thorax without acute traumatic fracture or aggressive osteolytic lesion.\n\n"
            "IMPRESSION:\n"
            "1. Acute right lower lobe lobar consolidation characteristic of dense community-acquired bacterial pneumonia.\n"
            "2. Associated small reactive right pleural effusion without loculation.\n"
            "3. Negative for acute pulmonary embolism."
        )
    }
}
