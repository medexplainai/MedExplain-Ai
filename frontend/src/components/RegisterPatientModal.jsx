import React, { useState } from 'react';
import {
  UserPlus,
  Upload,
  FileText,
  X,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Loader2,
  Stethoscope
} from 'lucide-react';

export default function RegisterPatientModal({
  isOpen,
  onClose,
  onPatientRegistered
}) {
  const [activeInputMode, setActiveInputMode] = useState('upload'); // 'upload' | 'text'
  const [file, setFile] = useState(null);
  const [clinicalText, setClinicalText] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientWard, setPatientWard] = useState('Acute Inpatient Ward');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);

  if (!isOpen) return null;

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
        reason: 'Please select a clinical PDF, DOCX, or text file to upload.'
      });
      return;
    }

    if (activeInputMode === 'text' && !clinicalText.trim()) {
      setValidationError({
        title: 'Clinical Text Required',
        reason: 'Please enter or paste the clinical admission note or EHR record.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let resp;
      if (activeInputMode === 'upload') {
        const formData = new FormData();
        formData.append('file', file);
        if (patientName) formData.append('name', patientName);
        if (patientAge) formData.append('age', patientAge);
        if (patientGender) formData.append('gender', patientGender);
        if (patientWard) formData.append('ward', patientWard);
        if (specialty) formData.append('specialty', specialty);

        resp = await fetch('/api/patients/upload', {
          method: 'POST',
          body: formData
        });
      } else {
        resp = await fetch('/api/patients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: patientName || null,
            age: patientAge ? parseInt(patientAge, 10) : null,
            gender: patientGender || null,
            ward: patientWard || null,
            specialty: specialty || null,
            text: clinicalText
          })
        });
      }

      const data = await resp.json();

      if (!resp.ok) {
        const detail = data.detail || {};
        let errTitle = 'Medical Validation Exception';
        let errReason = 'The uploaded file or note could not be verified as an authentic clinical document.';
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

      // Success
      setIsSubmitting(false);
      if (onPatientRegistered && data.patient) {
        onPatientRegistered(data.patient);
      }
      onClose();
    } catch (err) {
      console.error('Registration error:', err);
      setValidationError({
        title: 'Registration Error',
        reason: 'Could not connect to the hospital registry service. Please ensure the server is active.'
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
        maxWidth: '720px',
        width: '100%',
        maxHeight: '92vh',
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
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                Register New Inpatient Record
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                Persists record to the hospital database to appear alongside all existing patients.
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

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Medical Validation Error Alert */}
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
              Input Source Mode:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveInputMode('upload')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: activeInputMode === 'upload' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: activeInputMode === 'upload' ? '#eff6ff' : '#ffffff',
                  color: activeInputMode === 'upload' ? '#1d4ed8' : '#64748b',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Upload size={16} />
                <span>Upload Clinical Document</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputMode('text')}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: activeInputMode === 'text' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: activeInputMode === 'text' ? '#eff6ff' : '#ffffff',
                  color: activeInputMode === 'text' ? '#1d4ed8' : '#64748b',
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
                <span>Paste EHR Clinical Text</span>
              </button>
            </div>
          </div>

          {/* Document Input */}
          {activeInputMode === 'upload' ? (
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Clinical Document File (.pdf, .docx, .txt):
              </label>
              <div style={{
                border: '2px dashed #93c5fd',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                background: '#f8fafc',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('register-file-input').click()}
              >
                <input
                  id="register-file-input"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <Upload size={32} color="#2563eb" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  {file ? file.name : 'Click to select or drop a medical note here'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px' }}>
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supports Hospital EHR PDFs, Word Discharge Summaries, and Clinical Notes'}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Clinical Note Content:
              </label>
              <textarea
                rows={6}
                value={clinicalText}
                onChange={(e) => setClinicalText(e.target.value)}
                placeholder="Paste authentic clinical record, discharge summary, or vital signs telemetry note..."
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

          {/* Patient Demographics (Optional overrides / hints) */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.4px' }}>
              Patient Demographics (Optional - Auto-extracted if left blank):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Patient Full Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g., Jonathan Hayes"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
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
                  Age:
                </label>
                <input
                  type="number"
                  placeholder="e.g., 62"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
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
                  Gender:
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    background: '#ffffff'
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Specialty Department:
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    background: '#ffffff'
                  }}
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="General Medicine">General Medicine</option>
                </select>
              </div>
            </div>
          </div>

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
                  <span>Validating & Registering...</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>Register Inpatient Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
