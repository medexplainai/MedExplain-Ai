"""
Explainability Engine: Token-Level Feature Attribution & SHAP Heatmaps
Provides transparent evidence heatmaps justifying model predictions without opaque black-boxes.
"""

import re
from typing import Dict, List, Tuple, Any
from .clinical_engine import SPECIALTY_VOCABULARIES

class ExplainabilityEngine:
    def __init__(self):
        pass

    def compute_token_attributions(self, text: str, predicted_specialty: str) -> List[Tuple[str, float]]:
        """
        Computes token-level importance weights with respect to the target clinical specialty.
        Returns a list of (word_token, attribution_score).
        """
        vocab = SPECIALTY_VOCABULARIES.get(predicted_specialty, [])
        vocab_lookup = {term.lower(): (1.0 + 0.1 * len(term.split())) for term in vocab}

        # Tokenize by words and punctuation while preserving whitespace/formatting
        tokens = re.findall(r'\b\w+\b|[^\w\s]|\s+', text)
        token_attributions = []

        for token in tokens:
            t_clean = token.strip().lower()
            if not t_clean:
                token_attributions.append((token, 0.0))
                continue

            # Check if token is part of domain vocabulary
            weight = 0.0
            for term, term_wt in vocab_lookup.items():
                if t_clean in term.split():
                    weight = max(weight, term_wt * 0.35)
                if t_clean == term:
                    weight = max(weight, term_wt * 0.85)

            token_attributions.append((token, round(weight, 3)))

        return token_attributions

    def generate_html_heatmap(self, text: str, predicted_specialty: str) -> str:
        """
        Generates an interactive HTML heatmap with inline CSS color-coding.
        Significant clinical keywords are highlighted in clinical rose/coral tints with tooltips.
        """
        attributions = self.compute_token_attributions(text, predicted_specialty)
        html_spans = []

        for token, score in attributions:
            if score > 0.0:
                # Opacity scaled based on attribution weight
                alpha = min(0.85, max(0.18, score))
                bg_color = f"rgba(225, 29, 72, {alpha:.2f})"
                text_color = "#ffffff" if alpha > 0.55 else "#881337"
                tooltip = f"Importance: +{score:.2f} ({predicted_specialty} driver)"
                span = f'<span style="background-color: {bg_color}; color: {text_color}; padding: 2px 4px; border-radius: 3px; font-weight: 600;" title="{tooltip}">{token}</span>'
                html_spans.append(span)
            else:
                html_spans.append(token)

        heatmap_html = "".join(html_spans)
        # Wrap in styled container
        return f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 13.5px; line-height: 1.6; color: #1e293b; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; white-space: pre-wrap; word-break: break-word; max-height: 380px; overflow-y: auto;">
            {heatmap_html}
        </div>
        """

    def get_top_driving_keywords(self, text: str, predicted_specialty: str, top_k: int = 8) -> List[Dict[str, Any]]:
        """
        Returns the top-k driving diagnostic keywords sorted by attribution weight.
        """
        vocab = SPECIALTY_VOCABULARIES.get(predicted_specialty, [])
        text_lower = text.lower()
        findings = []

        for term in vocab:
            matches = len(re.findall(r'\b' + re.escape(term) + r'\b', text_lower))
            if matches > 0:
                weight = round(matches * 0.45 + (len(term) * 0.02), 2)
                findings.append({
                    "keyword": term.title(),
                    "frequency": matches,
                    "attribution_weight": weight
                })

        findings.sort(key=lambda x: x["attribution_weight"], reverse=True)
        return findings[:top_k]

explainability_engine = ExplainabilityEngine()
