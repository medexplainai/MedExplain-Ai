import React from 'react';
import { Eye, FileCheck, Layers, AlertCircle } from 'lucide-react';

export default function RadiologyVisualizer({ imagingResults }) {
  if (!imagingResults) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
      border: '1.5px solid #a5f3fc',
      borderRadius: '14px',
      padding: '22px',
      marginBottom: '24px',
      boxShadow: '0 4px 18px rgba(6, 182, 212, 0.08)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '14px',
        marginBottom: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#ecfeff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Eye size={18} color="#0891b2" />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Diagnostic Imaging & Radiology Intelligence
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              Automated scan segmentation, technique validation, and impression parsing
            </p>
          </div>
        </div>

        <span style={{
          background: '#ecfeff',
          color: '#0e7490',
          border: '1px solid #a5f3fc',
          borderRadius: '6px',
          padding: '4px 12px',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Layers size={13} /> {imagingResults.modality}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {/* Clinical Indication */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '16px'
        }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Clinical Indication / Reason for Exam
          </span>
          <p style={{ fontSize: '13px', color: '#1e293b', marginTop: '6px', lineHeight: '1.5' }}>
            {imagingResults.indication}
          </p>
        </div>

        {/* Radiologist Impression Callout */}
        <div style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '10px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#be123c', marginBottom: '6px' }}>
            <AlertCircle size={15} />
            <span style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Final Radiologist Impression / Conclusion
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#881337', margin: 0, lineHeight: '1.5', fontWeight: 600 }}>
            {imagingResults.impression}
          </p>
        </div>
      </div>

      {/* Anatomical Findings */}
      <div style={{
        marginTop: '16px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', marginBottom: '8px' }}>
          <FileCheck size={15} color="#2563eb" />
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Detailed Anatomical Examination & Findings
          </span>
        </div>
        <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
          {imagingResults.findings}
        </p>
      </div>
    </div>
  );
}
