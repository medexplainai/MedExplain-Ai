"""
Longitudinal Comparison Engine: Serial Patient Report Tracking & Clinical Trajectory Analysis
Compares baseline admission records with latest follow-up/serial test reports to compute:
- Numerical parameter deltas (Vitals, Lab Panels, Diagnostic Scores)
- Trajectory classification: IMPROVED, STABLE, or WORSENED
- Objective clinical progress narratives
"""

import re
from typing import Dict, List, Any, Optional

class LongitudinalEngine:
    def __init__(self):
        pass

    def extract_biomarkers(self, text: str) -> Dict[str, Any]:
        """
        Extracts key quantitative clinical markers, vitals, and lab parameters from text.
        """
        lower = text.lower()
        markers = {}

        # 1. Blood Pressure (systolic/diastolic)
        bp_match = re.search(r'(?:blood pressure|bp)[:\s]*(\d{2,3})[/](\d{2,3})', lower) or re.search(r'(\d{2,3})[/](\d{2,3})\s*mm\s*hg', lower)
        if bp_match:
            sys = int(bp_match.group(1))
            dia = int(bp_match.group(2))
            markers["blood_pressure"] = {
                "display": f"{sys}/{dia}",
                "value": sys,
                "systolic": sys,
                "diastolic": dia,
                "unit": "mmHg",
                "name": "Blood Pressure",
                "category": "Vital Signs"
            }

        # 2. Heart Rate / Pulse
        hr_match = re.search(r'(?:heart rate|pulse|hr)[:\s]*(\d{2,3})\s*(?:bpm|beats)?', lower) or re.search(r'(\d{2,3})\s*bpm', lower)
        if hr_match:
            val = int(hr_match.group(1))
            if 40 <= val <= 200:
                markers["heart_rate"] = {
                    "display": f"{val} bpm",
                    "value": val,
                    "unit": "bpm",
                    "name": "Heart Rate",
                    "category": "Vital Signs"
                }

        # 3. Oxygen Saturation (SpO2)
        spo2_match = re.search(r'(?:spo2|oxygen saturation|o2 sat)[:\s]*(\d{2,3})\s*%', lower) or re.search(r'(\d{2,3})\s*%\s*(?:on ambient|on room air|on room)?', lower)
        if spo2_match:
            val = int(spo2_match.group(1))
            if 70 <= val <= 100:
                markers["spo2"] = {
                    "display": f"{val}%",
                    "value": val,
                    "unit": "%",
                    "name": "SpO2 (Oxygen Saturation)",
                    "category": "Vital Signs"
                }

        # 4. Temperature
        temp_match = re.search(r'(?:temperature|temp)[:\s]*(\d{2,3}(?:\.\d+)?)\s*(?:°?f|f\b)', lower)
        if temp_match:
            val = float(temp_match.group(1))
            markers["temperature"] = {
                "display": f"{val}°F",
                "value": val,
                "unit": "°F",
                "name": "Body Temperature",
                "category": "Vital Signs"
            }

        # 5. Cardiac Troponin I
        trop_match = re.search(r'(?:troponin[- ]?i|cardiac troponin)[:\s]*(\d+(?:\.\d+)?)\s*(?:ng/ml)?', lower)
        if trop_match:
            val = float(trop_match.group(1))
            markers["troponin_i"] = {
                "display": f"{val} ng/mL",
                "value": val,
                "unit": "ng/mL",
                "name": "Cardiac Troponin-I",
                "category": "Cardiac Biomarkers"
            }

        # 6. LDL Cholesterol
        ldl_match = re.search(r'(?:ldl|ldl[- ]cholesterol)[:\s]*(\d{2,3})\s*(?:mg/dl)?', lower)
        if ldl_match:
            val = int(ldl_match.group(1))
            markers["ldl_cholesterol"] = {
                "display": f"{val} mg/dL",
                "value": val,
                "unit": "mg/dL",
                "name": "LDL ('Bad') Cholesterol",
                "category": "Lipid Panel"
            }

        # 7. Total Cholesterol
        tc_match = re.search(r'(?:total cholesterol)[:\s]*(\d{2,3})\s*(?:mg/dl)?', lower)
        if tc_match:
            val = int(tc_match.group(1))
            markers["total_cholesterol"] = {
                "display": f"{val} mg/dL",
                "value": val,
                "unit": "mg/dL",
                "name": "Total Cholesterol",
                "category": "Lipid Panel"
            }

        # 8. Triglycerides
        trig_match = re.search(r'(?:triglycerides)[:\s]*(\d{2,3})\s*(?:mg/dl)?', lower)
        if trig_match:
            val = int(trig_match.group(1))
            markers["triglycerides"] = {
                "display": f"{val} mg/dL",
                "value": val,
                "unit": "mg/dL",
                "name": "Serum Triglycerides",
                "category": "Lipid Panel"
            }

        # 9. Fasting Blood Glucose
        glu_match = re.search(r'(?:fasting (?:plasma )?glucose|glucose)[:\s]*(\d{2,3})\s*(?:mg/dl)?', lower)
        if glu_match:
            val = int(glu_match.group(1))
            markers["glucose"] = {
                "display": f"{val} mg/dL",
                "value": val,
                "unit": "mg/dL",
                "name": "Fasting Blood Glucose",
                "category": "Glycemic Panel"
            }

        # 10. Glycated Hemoglobin (HbA1c)
        hba1c_match = re.search(r'(?:hba1c|glycated hemoglobin)[:\s]*(\d+(?:\.\d+)?)\s*%', lower)
        if hba1c_match:
            val = float(hba1c_match.group(1))
            markers["hba1c"] = {
                "display": f"{val}%",
                "value": val,
                "unit": "%",
                "name": "Glycated Hemoglobin (HbA1c)",
                "category": "Glycemic Panel"
            }

        # 11. Serum Creatinine
        creat_match = re.search(r'(?:serum creatinine|creatinine)[:\s]*(\d+(?:\.\d+)?)\s*(?:mg/dl)?', lower)
        if creat_match:
            val = float(creat_match.group(1))
            markers["creatinine"] = {
                "display": f"{val} mg/dL",
                "value": val,
                "unit": "mg/dL",
                "name": "Serum Creatinine",
                "category": "Renal Panel"
            }

        # 12. White Blood Cell Count (WBC)
        wbc_match = re.search(r'(?:wbc|white blood cell count)[:\s]*(\d+(?:\.\d+)?)\s*(?:x10\^3/ul|k/ul)?', lower)
        if wbc_match:
            val = float(wbc_match.group(1))
            markers["wbc"] = {
                "display": f"{val} x10^3/uL",
                "value": val,
                "unit": "x10^3/uL",
                "name": "White Blood Cell Count",
                "category": "Hematology"
            }

        # 13. Hemoglobin
        hb_match = re.search(r'(?:hemoglobin)[:\s]*(\d+(?:\.\d+)?)\s*(?:g/dl)?', lower)
        if hb_match:
            val = float(hb_match.group(1))
            markers["hemoglobin"] = {
                "display": f"{val} g/dL",
                "value": val,
                "unit": "g/dL",
                "name": "Hemoglobin (Hb)",
                "category": "Hematology"
            }

        # 14. NIH Stroke Scale (NIHSS)
        nihss_match = re.search(r'(?:nih stroke scale|nihss)(?:\s*score)?[:\s]*(\d{1,2})', lower)
        if nihss_match:
            val = int(nihss_match.group(1))
            markers["nihss"] = {
                "display": f"NIHSS {val}",
                "value": val,
                "unit": "pts",
                "name": "NIH Stroke Scale (NIHSS)",
                "category": "Neurology Score"
            }

        # 15. VAS Pain Score
        pain_match = re.search(r'(?:vas pain score|pain score|vas)[:\s]*(\d{1,2})[/]10', lower)
        if pain_match:
            val = int(pain_match.group(1))
            markers["vas_pain"] = {
                "display": f"{val}/10",
                "value": val,
                "unit": "/10",
                "name": "VAS Pain Severity Scale",
                "category": "Surgical Recovery"
            }

        # 16. Knee Range of Motion
        rom_match = re.search(r'(?:knee range of motion|knee rom|rom)[:\s]*(\d{1,2})[°]?\s*(?:to|-)\s*(\d{2,3})[°]?', lower)
        if rom_match:
            ext = int(rom_match.group(1))
            flex = int(rom_match.group(2))
            markers["knee_rom"] = {
                "display": f"{ext}° - {flex}°",
                "value": flex,
                "unit": "degrees",
                "name": "Knee Range of Motion (Flexion)",
                "category": "Surgical Recovery"
            }

        return markers

    def compare_markers(self, baseline_markers: Dict[str, Any], latest_markers: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Computes numerical deltas, percentage changes, and status classification
        (IMPROVED, STABLE, WORSENED) across shared and distinct markers.
        """
        comparisons = []
        all_keys = set(baseline_markers.keys()).union(set(latest_markers.keys()))

        # Define which direction represents clinical improvement
        lower_is_better = {
            "troponin_i", "ldl_cholesterol", "total_cholesterol", "triglycerides",
            "glucose", "hba1c", "creatinine", "wbc", "nihss", "vas_pain", "temperature"
        }
        higher_is_better = {
            "spo2", "hemoglobin", "knee_rom"
        }

        for key in sorted(all_keys):
            b_data = baseline_markers.get(key)
            l_data = latest_markers.get(key)

            if not b_data or not l_data:
                # If only present in one, report baseline or latest presence
                item_data = l_data or b_data
                comparisons.append({
                    "key": key,
                    "name": item_data["name"],
                    "category": item_data.get("category", "Clinical Metric"),
                    "unit": item_data["unit"],
                    "baseline_display": b_data["display"] if b_data else "Not Recorded",
                    "latest_display": l_data["display"] if l_data else "Not Recorded",
                    "delta_display": "--",
                    "status": "STABLE",
                    "status_label": "Recorded in Single Report",
                    "color": "#64748b"
                })
                continue

            b_val = b_data["value"]
            l_val = l_data["value"]

            # Handle blood pressure comparison specifically (Systolic & Diastolic)
            if key == "blood_pressure":
                b_sys = b_data["systolic"]
                l_sys = l_data["systolic"]
                b_dia = b_data["diastolic"]
                l_dia = l_data["diastolic"]

                sys_delta = l_sys - b_sys
                # Target is ~120/80
                improved = (b_sys > 135 and l_sys < b_sys) or (b_sys < 100 and l_sys > b_sys)
                status = "IMPROVED" if improved else ("STABLE" if abs(sys_delta) <= 5 else "WORSENED")
                pct = round(((l_sys - b_sys) / b_sys) * 100, 1)

                comparisons.append({
                    "key": key,
                    "name": "Blood Pressure",
                    "category": "Vital Signs",
                    "unit": "mmHg",
                    "baseline_display": b_data["display"],
                    "latest_display": l_data["display"],
                    "delta_display": f"{sys_delta:+d} mmHg ({pct:+.1f}%)",
                    "status": status,
                    "status_label": "Blood Pressure Controlled" if status == "IMPROVED" else "Blood Pressure Stable",
                    "color": "#10b981" if status == "IMPROVED" else ("#0284c7" if status == "STABLE" else "#ef4444")
                })
                continue

            # Standard scalar comparisons
            diff = l_val - b_val
            pct_change = round((diff / b_val) * 100, 1) if b_val != 0 else 0.0

            if key in lower_is_better:
                if diff < -0.05:
                    status = "IMPROVED"
                    label = f"Decreased favorably ({pct_change:+.1f}%)"
                    color = "#10b981"
                elif abs(diff) <= 0.05 or abs(pct_change) < 3.0:
                    status = "STABLE"
                    label = "Clinically Stable"
                    color = "#0284c7"
                else:
                    status = "WORSENED"
                    label = f"Elevated ({pct_change:+.1f}%)"
                    color = "#ef4444"
            elif key in higher_is_better:
                if diff > 0.05:
                    status = "IMPROVED"
                    label = f"Increased favorably ({pct_change:+.1f}%)"
                    color = "#10b981"
                elif abs(diff) <= 0.05 or abs(pct_change) < 2.0:
                    status = "STABLE"
                    label = "Clinically Stable"
                    color = "#0284c7"
                else:
                    status = "WORSENED"
                    label = f"Decreased ({pct_change:+.1f}%)"
                    color = "#ef4444"
            else:
                status = "STABLE"
                label = "Monitored Metric"
                color = "#0284c7"

            sign = "+" if diff > 0 else ""
            delta_str = f"{sign}{round(diff, 2)} {b_data['unit']} ({pct_change:+.1f}%)"

            comparisons.append({
                "key": key,
                "name": b_data["name"],
                "category": b_data.get("category", "Clinical Metric"),
                "unit": b_data["unit"],
                "baseline_display": b_data["display"],
                "latest_display": l_data["display"],
                "delta_display": delta_str,
                "status": status,
                "status_label": label,
                "color": color
            })

        return comparisons

    def generate_longitudinal_trajectory(
        self,
        patient_name: str,
        specialty: str,
        baseline_text: str,
        latest_text: str,
        custom_metrics: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Synthesizes a complete longitudinal trajectory analysis between previous and latest test reports.
        """
        baseline_markers = self.extract_biomarkers(baseline_text)
        latest_markers = self.extract_biomarkers(latest_text)

        metric_comparisons = self.compare_markers(baseline_markers, latest_markers)

        # If custom pre-calibrated metrics provided (for rich clinical benchmark notes), merge them
        if custom_metrics:
            existing_keys = {m["key"] for m in metric_comparisons}
            for cm in custom_metrics:
                if cm["key"] not in existing_keys:
                    metric_comparisons.append(cm)

        # Count statuses
        improved_count = sum(1 for m in metric_comparisons if m["status"] == "IMPROVED")
        worsened_count = sum(1 for m in metric_comparisons if m["status"] == "WORSENED")
        stable_count = sum(1 for m in metric_comparisons if m["status"] == "STABLE")
        total_eval = len(metric_comparisons) or 1

        if improved_count > worsened_count and improved_count >= 1:
            overall_status = "Significant Clinical Improvement"
            trajectory_badge = "IMPROVED"
            badge_color = "#10b981"
        elif worsened_count > improved_count:
            overall_status = "Clinical Attention & Review Required"
            trajectory_badge = "WORSENED"
            badge_color = "#ef4444"
        else:
            overall_status = "Clinically Stable / Controlled Trajectory"
            trajectory_badge = "STABLE"
            badge_color = "#0284c7"

        # Generate progress narrative
        narrative_parts = [
            f"Serial evaluation of {patient_name} demonstrates a {overall_status.lower()} relative to baseline admission."
        ]
        improved_names = [m["name"] for m in metric_comparisons if m["status"] == "IMPROVED"]
        if improved_names:
            narrative_parts.append(
                f"Favorable clinical resolution observed across {len(improved_names)} parameters, including {', '.join(improved_names[:3])}."
            )
        worsened_names = [m["name"] for m in metric_comparisons if m["status"] == "WORSENED"]
        if worsened_names:
            narrative_parts.append(
                f"Close monitoring warranted for {', '.join(worsened_names)}."
            )
        else:
            narrative_parts.append(
                "No adverse biomarker deterioration detected across evaluated clinical targets."
            )

        return {
            "patient_name": patient_name,
            "specialty": specialty,
            "overall_status": overall_status,
            "trajectory_badge": trajectory_badge,
            "badge_color": badge_color,
            "improved_count": improved_count,
            "worsened_count": worsened_count,
            "stable_count": stable_count,
            "total_metrics_evaluated": total_eval,
            "metrics": metric_comparisons,
            "clinical_narrative": " ".join(narrative_parts)
        }

longitudinal_engine = LongitudinalEngine()
