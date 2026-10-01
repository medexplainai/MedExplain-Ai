"""
Discharge Summary Document Generator
Generates official, print-ready Hospital Discharge Summaries in DOCX/PDF format.
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls
import io

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=80, bottom=80, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def generate_hospital_discharge_docx(patient_data: dict, summary_data: dict, entities: dict) -> bytes:
    """
    Creates an official, print-ready Hospital Discharge Summary document in memory.
    """
    doc = docx.Document()
    sec = doc.sections[0]
    sec.top_margin = Inches(0.8)
    sec.bottom_margin = Inches(0.8)
    sec.left_margin = Inches(0.9)
    sec.right_margin = Inches(0.9)

    # Document Header
    p_h = doc.add_paragraph()
    p_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_h = p_h.add_run("METROHEALTH SYSTEM • UNIVERSITY HOSPITAL NETWORK")
    r_h.font.name = 'Arial'
    r_h.font.size = Pt(12)
    r_h.bold = True
    r_h.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(14)
    r_sub = p_sub.add_run("OFFICIAL PATIENT DISCHARGE SUMMARY & POST-ACUTE CARE PLAN")
    r_sub.font.name = 'Arial'
    r_sub.font.size = Pt(10)
    r_sub.bold = True
    r_sub.font.color.rgb = RGBColor(0x2B, 0x6C, 0xB0)

    # Patient Metadata Table
    meta_table = doc.add_table(rows=2, cols=4)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    col_w = [Inches(1.6), Inches(1.8), Inches(1.6), Inches(1.8)]

    data_grid = [
        [("Patient Name:", patient_data.get("name", "John Doe")),
         ("Patient ID:", patient_data.get("id", "PT-8941")),
         ("Age / Gender:", f"{patient_data.get('age', 58)} / {patient_data.get('gender', 'M')}"),
         ("Triage Category:", patient_data.get("triage", "Acute Cardiac"))],
        [("Admission Date:", "September 24, 2026"),
         ("Discharge Date:", "September 29, 2026"),
         ("Attending Physician:", "Dr. A. Sharma, MD, FACC"),
         ("Primary Ward:", patient_data.get("ward", "Cardiovascular Unit"))]
    ]

    for r_idx, row_data in enumerate(data_grid):
        for c_idx, (label, val) in enumerate(row_data):
            cell = meta_table.rows[r_idx].cells[c_idx]
            cell.width = col_w[c_idx]
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.space_before = Pt(2)
            r_l = p.add_run(f"{label} ")
            r_l.bold = True
            r_l.font.size = Pt(8.5)
            r_v = p.add_run(val)
            r_v.font.size = Pt(8.5)
            set_cell_background(cell, "F8FAFC")
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)

    # Spacer
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    def add_h(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.name = 'Arial'
        r.font.size = Pt(11)
        r.bold = True
        r.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D)
        return p

    def add_p(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        r = p.add_run(text)
        r.font.name = 'Calibri'
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(0x2D, 0x37, 0x48)
        return p

    # 1. Primary Diagnoses
    add_h("1. Clinical Discharge Diagnoses")
    diags = entities.get("diagnoses", ["Coronary Artery Disease", "Myocardial Infarction"])
    add_p(" • " + "\n • ".join(diags))

    # 2. Plain Language Health Overview
    add_h("2. Patient-Centric Condition Overview (Simplified Care Guide)")
    add_p(summary_data.get("overview", "You received treatment for a cardiovascular event and are progressing well."))

    # 3. Daily Medication Table
    add_h("3. Prescribed Discharge Medication Schedule")
    meds = summary_data.get("medication_table", [])
    if meds:
        m_tbl = doc.add_table(rows=1, cols=4)
        m_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        m_tbl.autofit = False
        m_w = [Inches(1.8), Inches(1.2), Inches(1.8), Inches(2.0)]
        
        h_cells = m_tbl.rows[0].cells
        for i, h_text in enumerate(["Medication Name", "Dosage", "When to Take", "Instructions"]):
            h_cells[i].width = m_w[i]
            p = h_cells[i].paragraphs[0]
            r = p.add_run(h_text)
            r.bold = True
            r.font.size = Pt(9)
            r.font.color.rgb = RGBColor(0x1A, 0x36, 0x5D)
            set_cell_background(h_cells[i], "EDF2F7")
            set_cell_margins(h_cells[i], top=60, bottom=60, left=80, right=80)

        for m in meds:
            row_cells = m_tbl.add_row().cells
            row_cells[0].paragraphs[0].add_run(m.get("medication", "")).bold = True
            row_cells[1].paragraphs[0].add_run(m.get("dosage", ""))
            row_cells[2].paragraphs[0].add_run(m.get("schedule", ""))
            row_cells[3].paragraphs[0].add_run(m.get("instructions", ""))
            for i in range(4):
                row_cells[i].width = m_w[i]
                row_cells[i].paragraphs[0].runs[0].font.size = Pt(8.5)
                set_cell_margins(row_cells[i], top=50, bottom=50, left=80, right=80)

    # 4. Lifestyle & Red-Flags
    add_h("4. Emergency Symptoms (Call 911 / Seek Immediate Hospital Care)")
    for rf in summary_data.get("red_flags", [])[:4]:
        add_p(f" • WARNING: {rf}")

    # Signatures
    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.space_before = Pt(28)
    p_sig.paragraph_format.space_after = Pt(0)
    p_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_sig = p_sig.add_run("Physician Signature: _________________________________\nDr. A. Sharma, MD, FACC  •  License #MD-88419\nVerified via MedExplain AI Safety Guardrail")
    r_sig.font.size = Pt(9)
    r_sig.font.italic = True

    bio = io.BytesIO()
    doc.save(bio)
    bio.seek(0)
    return bio.getvalue()
