import React from 'react';
import { Award, BookOpen, GraduationCap } from 'lucide-react';

export default function CollegeTeamFooter() {
  return (
    <footer style={{
      marginTop: '40px',
      borderTop: '1px solid #e2e8f0',
      background: '#ffffff',
      borderRadius: '12px',
      padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e3a8a', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>
            <GraduationCap size={16} />
            <span>Academic Project Release (Team-8)</span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
            <strong>Department of Artificial Intelligence & Machine Learning</strong><br />
            JNTU College of Engineering • Final Year Major Project
          </p>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b' }}>
            • M. Deepika (23A51A4293) &nbsp;• U. Girishma (23A51A42B7)<br />
            • T. Satvika (23A51A42B5) &nbsp;• E. Jyothish Kumar (23A51A4275)
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e3a8a', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>
            <BookOpen size={16} />
            <span>Peer-Reviewed Base Research Papers</span>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5', margin: 0 }}>
            1. <strong>ClinicalBERT:</strong> <em>Publicly Available Clinical BERT Embeddings</em> (Alsentzer et al., NAACL-ClinicalNLP).<br />
            2. <strong>Med-HALT:</strong> <em>Medical Multimodal Hallucination Test</em> (Umapathi et al., EMNLP).
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e3a8a', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', marginBottom: '8px' }}>
            <Award size={16} />
            <span>Key Research Contributions</span>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5', margin: 0 }}>
            • Token-level Shapley attribution eliminating black-box opacity.<br />
            • Closed-loop DeBERTa-v3 NLI guardrail eradicating medical hallucinations.<br />
            • AMA Grade 6 patient health communication synthesizer.
          </p>
        </div>
      </div>
    </footer>
  );
}
