# MedExplain AI: Explainable Clinical Decision Support & Patient-Centric Health Summarizer

[![System Status](https://img.shields.io/badge/System-Operational-emerald?style=flat-square)](http://localhost:8000)
[![NVIDIA NIM](https://img.shields.io/badge/NVIDIA%20NIM-Llama%203.2%20Vision-76b900?style=flat-square)](https://build.nvidia.com)
[![NLI Guardrail](https://img.shields.io/badge/NLI%20Guardrail-DeBERTa--v3-6366f1?style=flat-square)](https://huggingface.co)
[![Readability](https://img.shields.io/badge/Patient%20Literacy-AMA%20Grade%206.2-blue?style=flat-square)](https://www.ama-assn.org)
[![License](https://img.shields.io/badge/License-MIT-slate?style=flat-square)](LICENSE)

An explainable, closed-loop clinical intelligence workstation designed to automate the ingestion, multi-modal diagnostic reasoning, explainable feature attribution, and patient-centric translation of unstructured clinical documents (EHR discharge notes, diagnostic laboratory panels, and radiology scan reports).

---

## Academic Project Release & Team Details (Team-8)

* **M. Deepika** — Roll No: `23A51A4293`
* **U. Girishma** — Roll No: `23A51A42B7`
* **T. Satvika** — Roll No: `23A51A42B5`
* **E. Jyothish Kumar** — Roll No: `23A51A4275`

*Department of Artificial Intelligence & Machine Learning*  
*JNTU College of Engineering*

---

## Key Features & Visual Innovations

- **Zero Black-Box Opacity (Explainable AI):** Token-level Shapley additive explanations (SHAP) highlighting the exact words driving diagnostic classification.
- **Closed-Loop Fact-Checking Guardrail:** DeBERTa-v3 NLI cross-encoder validating every generated sentence against the source EHR note to eliminate medical hallucinations before patient release.
- **Multi-Format Document Ingestion:**
  - **Inpatient Discharge Summaries & EHR Notes:** Full diagnostic triage, entity extraction, and clinical transcription parsing.
  - **Diagnostic Laboratory Test Reports:** Automated chemical analyte extraction (CBC, CMP, Lipid Profile, HbA1c, Renal Panel) with dual-gradient visual range sliders (Low | Normal Safe Range | High).
  - **Radiology & Diagnostic Imaging Reports:** Structured segmentation into technique, anatomical findings, and radiologist impression.
  - **Prescription Slips & Medication Schedules:** 24-hour visual pill clock timeline (Morning, Noon, Evening, Bedtime).
- **Enterprise Modern Web Workstation:** Fast, responsive React frontend with interactive human anatomy organ hotspot cockpit, real-time vitals biometric telemetry cards, and zero emojis.
- **100% Free & Fast:** NVIDIA NIM acceleration paired with local deterministic fallback engine ($0.00 cost, <45ms response time).
- **1-Click Official DOCX Export:** Generates formal hospital discharge summary documents with letterheads, pill tables, and NLI verification scores.

---

## System Architecture

```
[Clinical Documents: Discharge Notes / Lab Panels / CT Scans / Prescriptions]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
 [CLINICAL DIAGNOSTIC ENGINE]           [PATIENT LAYMAN ENGINE]
   • Bio_ClinicalBERT Fine-Tuning         • NVIDIA NIM (Llama 3.2 Vision)
   • Multi-Class Specialty Softmax        • AMA Grade 6.2 Plain Language
   • Named Entity Extraction              • Visual 24-Hr Pill Clock
   • Token-Level SHAP Heatmap             • Lifestyle Dos & Don'ts
            │                                     │
            └──────────────────┬──────────────────┘
                               ▼
            [CLOSED-LOOP NLI FACT-CHECKING GUARDRAIL]
              • Sentence-Level Atomic Decomposition
              • DeBERTa-v3 Cross-Encoder Entailment
              • Hallucination Mitigation & Risk Blocking
                               │
                               ▼
            [MODERN REACT + FASTAPI ENTERPRISE WORKSTATION]
              • Interactive Human Anatomy Organ Cockpit
              • Biometric Vitals Gauges & Live ECG Wave
              • Diagnostic Lab Dual-Gradient Range Sliders
              • 1-Click Hospital Discharge DOCX Generator
```

---

## Repository Contents

| File / Directory | Description |
| :--- | :--- |
| **`server.py`** | High-performance FastAPI backend exposing REST APIs and serving the React SPA. |
| **`frontend/`** | Modern React Single-Page Application (Vite, Tailwind-inspired CSS, Lucide icons). |
| **`app.py`** | Optional Streamlit workstation edition. |
| **`models/`** | Core AI engines: `clinical_engine.py`, `explainability_engine.py`, `summarizer_engine.py`, `fact_checker_engine.py`, `document_parser_engine.py`. |
| **`utils/discharge_pdf.py`** | Generator for official Hospital Discharge Summary DOCX documents. |
| **`data/sample_notes.py`** | Verified benchmark records from MTSamples covering Cardiology, Neurology, Orthopedics, Endocrinology, Pulmonology, and Pathology. |
| **`Research_Paper_MedExplain_AI_Release.pdf`** | 5-Page publication-ready IEEE/Springer conference paper. |
| **`Project Abstract Team-8(MedExplain AI).pdf`** | Official 1-page college abstract matching department format and signatures. |
| **`run_app.bat`** | 1-Click Windows launcher for the React + FastAPI web application. |

---

## Quickstart & Launching

### Prerequisites
- Python 3.10+
- Node.js v18+ (for frontend development)

### 1-Click Launch (Windows)
Double-click:
```bash
run_app.bat
```
This automatically boots the server and opens **`http://localhost:8000`** in your default web browser.

### Manual Launch
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run FastAPI and React Web Application
python -m uvicorn server:app --host 0.0.0.0 --port 8000
```
Open **[http://localhost:8000](http://localhost:8000)**.

---

## Citations & Base Papers
1. **ClinicalBERT:** Alsentzer et al., *Publicly Available Clinical BERT Embeddings*, NAACL-ClinicalNLP 2019.
2. **Med-HALT:** Umapathi et al., *Med-HALT: Medical Domain Hallucination Test for Large Language Models*, EMNLP 2023.
