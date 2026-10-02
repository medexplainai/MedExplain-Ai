import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  Loader2,
  Activity
} from 'lucide-react';

export default function UploadFollowupModal({
  isOpen,
  onClose,
  patient,
  onFollowupAdded
}) {
  const [activeInputMode, setActiveInputMode] = useState('upload'); // 'upload' | 'text'
  const [file, setFile] = useState(null);
  const [clinicalText, setClinicalText] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);

  if (!isOpen || !patient) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setValidationError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    if (activeInputMode === 'upload' && !file) {
      setValidationError({
        title: 'Document Required',
        reason: 'Please choose a follow-up medical report file (.pdf, .docx, .txt).'
      });
      return;
    }

    if (activeInputMode === 'text' && !clinicalText.trim()) {
      setValidationError({
        title: 'Clinical Text Required',
        reason: 'Please enter the serial test results or follow-up clinical note.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let resp;
      if (activeInputMode === 'upload') {
        const formData = new FormData();
        formData.append('file', file);
        if (reportTitle) formData.append('title', reportTitle);
        if (reportDate) formData.append('date', reportDate);

        resp = await fetch(`/api/patients/${encodeURIComponent(patient.id)}/followup/upload`, {
          method: 'POST',
          body: formData
        });
      } else {
        resp = await fetch(`/api/patients/${encodeURIComponent(patient.id)}/followup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: reportTitle || `Serial Follow-Up: ${patient.name}`,
            date: reportDate,
            type: 'Serial Outpatient Follow-Up',
            text: clinicalText
          })
        });
      }

      const data = await resp.json();

      if (!resp.ok) {
        const detail = data.detail || {};
        let errTitle = 'Medical Validation Exception';
        let errReason = 'The follow-up document could not be verified as an authentic medical report.';
        if (typeof detail === 'string') {
          errReason = detail;
        } else if (typeof detail === 'object') {
          errTitle = detail.title || errTitle;
          errReason = detail.reason || errReason;
        }
        setValidationError({
          title: errTitle,
          reason: errReason
        });
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      if (onFollowupAdded && data.patient) {
        onFollowupAdded(data.patient);
      }
      onClose();
    } catch (err) {
      console.error('Follow-up upload error:', err);
      setValidationError({
        title: 'Network / Server Error',
        reason: 'Could not upload serial report. Please try again.'
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        border: '1.5px solid #cbd5e1',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
            }}>
              <UploadCloud size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                Upload Follow-Up / Serial Report
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Attaching to <strong>{patient.name}</strong> ({patient.id}) to compare biomarkers with baseline.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#334155',
              border: 'none',
              borderRadius: '10px',
              color: '#cbd5e1',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Validation Error Alert */}
          {validationError && (
            <div style={{
              background: '#fef2f2',
              border: '1.5px solid #fecaca',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <AlertOctagon size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#991b1b' }}>
                  {validationError.title}
                </div>
                <div style={{ fontSize: '12.5px', color: '#b91c1c', marginTop: '3px', lineHeight: '1.4' }}>
                  {validationError.reason}
                </div>
              </div>
            </div>
          )}

          {/* Mode Switcher */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
              Select Upload Mode:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveInputMode('upload')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: activeInputMode === 'upload' ? '2px solid #0d9488' : '1px solid #cbd5e1',
                  background: activeInputMode === 'upload' ? '#f0fdfa' : '#ffffff',
                  color: activeInputMode === 'upload' ? '#0f766e' : '#64748b',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <UploadCloud size={16} />
                <span>Upload Report File</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputMode('text')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: activeInputMode === 'text' ? '2px solid #0d9488' : '1px solid #cbd5e1',
                  background: activeInputMode === 'text' ? '#f0fdfa' : '#ffffff',
                  color: activeInputMode === 'text' ? '#0f766e' : '#64748b',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <FileText size={16} />
                <span>Paste Clinical Text</span>
              </button>
            </div>
          </div>

          {/* Title & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Follow-Up Title:
              </label>
              <input
                type="text"
                placeholder={`e.g., Day 14 Follow-Up & Biomarker Evaluation`}
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Date:
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  background: '#ffffff'
                }}
              />
            </div>
          </div>

          {/* Document Input */}
          {activeInputMode === 'upload' ? (
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Report File (.pdf, .docx, .txt):
              </label>
              <div style={{
                border: '2px dashed #99f6e4',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                background: '#f0fdfa',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('followup-file-input').click()}
              >
                <input
                  id="followup-file-input"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <UploadCloud size={32} color="#0d9488" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  {file ? file.name : 'Click to select serial report file'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Contains repeat vitals, lipid panel, troponin, HbA1c, etc.'}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Follow-Up Clinical Text / Lab Findings:
              </label>
              <textarea
                rows={6}
                value={clinicalText}
                onChange={(e) => setClinicalText(e.target.value)}
                placeholder="Paste latest follow-up note containing updated vitals or lab markers..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  color: '#0f172a',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Computing Deltas...</span>
                </>
              ) : (
                <>
                  <Activity size={16} />
                  <span>Attach & Recompute Deltas</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
