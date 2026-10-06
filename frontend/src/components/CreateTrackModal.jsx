import React, { useState, useRef } from 'react';
import {
  Users,
  UserPlus,
  X,
  FileText,
  UploadCloud,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Activity,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';

const RELATIONSHIP_OPTIONS = [
  { id: 'Self', label: 'Self (Personal)' },
  { id: 'Father', label: 'Father' },
  { id: 'Mother', label: 'Mother' },
  { id: 'Spouse', label: 'Spouse / Partner' },
  { id: 'Child', label: 'Child / Dependent' },
  { id: 'Family Member', label: 'Other Family Member' }
];

export default function CreateTrackModal({
  isOpen,
  onClose,
  currentUser,
  onTrackCreated
}) {
  const [trackName, setTrackName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [relationship, setRelationship] = useState('Family Member');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [activeTab, setActiveTab] = useState('file'); // 'file' | 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setErrorMessage('Please provide the family member or patient name.');
      return;
    }

    if (activeTab === 'file' && !selectedFile) {
      setErrorMessage('Please select a medical report file (PDF, DOCX, or scanned image).');
      return;
    }

    if (activeTab === 'text' && !pastedText.trim()) {
      setErrorMessage('Please paste the medical note or discharge summary text.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const email = currentUser?.email || 'patient@gmail.com';
    const computedTrackName = trackName.trim() || `${patientName.trim()} (${relationship}) Health Track`;

    try {
      if (activeTab === 'file' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('user_email', email);
        formData.append('track_name', computedTrackName);
        formData.append('relationship', relationship);
        formData.append('name', patientName.trim());
        if (age) formData.append('age', age);
        if (gender) formData.append('gender', gender);

        const resp = await fetch('/api/user/tracks/upload', {
          method: 'POST',
          body: formData
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          const reason = errData.detail?.reason || errData.detail || 'Failed to create new health track.';
          throw new Error(reason);
        }

        const data = await resp.json();
        onTrackCreated(data.track, data.analysis);
        onClose();
      } else {
        const resp = await fetch('/api/user/tracks/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_email: email,
            track_name: computedTrackName,
            relationship: relationship,
            name: patientName.trim(),
            age: age ? parseInt(age, 10) : null,
            gender: gender,
            text: pastedText.trim()
          })
        });

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          const reason = errData.detail?.reason || errData.detail || 'Failed to create new health track.';
          throw new Error(reason);
        }

        const data = await resp.json();
        onTrackCreated(data.track, data.analysis);
        onClose();
      }
    } catch (err) {
      console.error('Create track error:', err);
      setErrorMessage(err.message || 'Error occurred while creating track.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: '640px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
        border: '1.5px solid #cbd5e1',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
          color: '#ffffff',
          padding: '22px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserPlus size={22} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0, letterSpacing: '-0.3px' }}>
                Start New Medical Track
              </h2>
              <p style={{ fontSize: '12px', color: '#ccfbf1', margin: '3px 0 0 0' }}>
                Track multiple health threads or family members under your single account
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          {errorMessage && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              color: '#991b1b',
              fontSize: '13px'
            }}>
              <AlertOctagon size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Track Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Patient / Family Member Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Robert Vance, Elena, Liam..."
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Relationship *
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  background: '#ffffff',
                  boxSizing: 'border-box'
                }}
              >
                {RELATIONSHIP_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Track Title (Optional)
            </label>
            <input
              type="text"
              placeholder={`e.g. ${patientName ? patientName : 'Father'} - Diabetes & Kidney Care, Annual Health Track...`}
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Age
              </label>
              <input
                type="number"
                placeholder="e.g. 52"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  background: '#ffffff',
                  boxSizing: 'border-box'
                }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Initial Document Intake Tabs */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f766e' }}>
                Initial Medical Document / Baseline Report *
              </label>
              <div style={{ display: 'inline-flex', background: '#e0f2fe', padding: '2px', borderRadius: '6px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('file')}
                  style={{
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '5px',
                    fontSize: '11px',
                    fontWeight: activeTab === 'file' ? 800 : 600,
                    background: activeTab === 'file' ? '#0284c7' : 'transparent',
                    color: activeTab === 'file' ? '#ffffff' : '#0369a1',
                    cursor: 'pointer'
                  }}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  style={{
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '5px',
                    fontSize: '11px',
                    fontWeight: activeTab === 'text' ? 800 : 600,
                    background: activeTab === 'text' ? '#0284c7' : 'transparent',
                    color: activeTab === 'text' ? '#ffffff' : '#0369a1',
                    cursor: 'pointer'
                  }}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {activeTab === 'file' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #99f6e4',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: '#f0fdfa',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt,image/*"
                  style={{ display: 'none' }}
                />
                <UploadCloud size={32} color="#0d9488" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f766e' }}>
                  {selectedFile ? selectedFile.name : 'Click to select PDF, DOCX, or scanned test document'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Supports hospital discharge notes, pathology lab reports, and doctor prescriptions
                </div>
              </div>
            ) : (
              <textarea
                rows={5}
                placeholder="Paste the clinical summary, hospital discharge note, or lab report text here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '12.5px',
                  lineHeight: '1.5',
                  boxSizing: 'border-box'
                }}
              />
            )}
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '9px 18px',
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
              style={{
                padding: '9px 22px',
                borderRadius: '8px',
                border: 'none',
                background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 800,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)'
              }}
            >
              {isSubmitting ? (
                <span>Ingesting & Analyzing...</span>
              ) : (
                <>
                  <span>Create Track & Analyze</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
