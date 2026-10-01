import React, { useRef, useState } from 'react';
import { Upload, FileText, Check, AlertCircle, FileUp, Sparkles } from 'lucide-react';

export default function DocumentUploadBar({ onSelectSample, onUploadFile, onAnalyzeCustomText, isAnalyzing }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [customText, setCustomText] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '18px 22px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Medical Document Ingestion & Multimodal Diagnostic Intake
          </span>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
            Upload any clinical document (PDF, DOCX, TXT, Scans) or select a pre-verified hospital benchmark:
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => fileInputRef.current.click()}
            className="btn btn-primary"
            style={{ fontSize: '12.5px', padding: '6px 14px' }}
          >
            <Upload size={14} />
            <span>Upload Document</span>
          </button>
          <button
            onClick={() => setShowCustomModal(true)}
            className="btn btn-secondary"
            style={{ fontSize: '12.5px', padding: '6px 14px' }}
          >
            <FileText size={14} />
            <span>Paste EHR Note</span>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Drag & Drop Visual Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{
          border: `2px dashed ${dragActive ? '#2563eb' : '#cbd5e1'}`,
          background: dragActive ? '#eff6ff' : '#f8fafc',
          borderRadius: '10px',
          padding: '16px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#e0e7ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#3730a3'
        }}>
          <FileUp size={18} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
            Drag and drop clinical files here, or click to browse
          </div>
          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
            Supports: <strong>Discharge Summaries (PDF/Word)</strong>, <strong>Lab Reports (CBC/Lipid/HbA1c)</strong>, <strong>Radiology Scans (CT/MRI/X-Ray)</strong>, & <strong>Scanned Slips</strong>
          </div>
        </div>
      </div>

      {/* Custom Text Modal */}
      {showCustomModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '680px',
            padding: '24px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Paste Clinical Document or Doctor's Narrative
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px' }}>
              Paste any medical report, lab specimen results, or discharge instructions for instant explainable AI processing:
            </p>

            <textarea
              rows={10}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste patient clinical text here..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontFamily: 'JetBrains Mono, monospace',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowCustomModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customText.trim()) {
                    onAnalyzeCustomText(customText);
                    setShowCustomModal(false);
                  }
                }}
                className="btn btn-primary"
                disabled={!customText.trim()}
              >
                <Sparkles size={15} />
                <span>Analyze Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
