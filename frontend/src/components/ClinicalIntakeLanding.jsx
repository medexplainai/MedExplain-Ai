import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Brain,
  HeartPulse,
  Wind,
  Activity,
  FlaskConical,
  Bone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  FileUp,
  Stethoscope,
  Cpu
} from 'lucide-react';

export default function ClinicalIntakeLanding({
  samples = [],
  onSelectBenchmark,
  onUploadFile,
  onAnalyzeCustomText
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [customText, setCustomText] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const benchmarks = [
    {
      id: 'Neurology',
      title: 'Neurology: Acute Ischemic Stroke Evaluation',
      name: 'Brain / Cerebrovascular',
      condition: 'Left MCA Stroke',
      color: '#8b5cf6',
      bg: '#faf5ff',
      border: '#ddd6fe',
      icon: Brain,
      patient: 'Eleanor Brooks, 64F'
    },
    {
      id: 'Cardiology',
      title: 'Cardiology: Acute Myocardial Ischemia',
      name: 'Heart / Coronary Arteries',
      condition: 'LAD Stenosis / Stent',
      color: '#ef4444',
      bg: '#fef2f2',
      border: '#fecaca',
      icon: HeartPulse,
      patient: 'Marcus Vance, 58M'
    },
    {
      id: 'Pulmonology',
      title: 'Radiology & Imaging Report: High-Resolution Chest CT Scan',
      name: 'Lungs / Thorax (Chest CT)',
      condition: 'Lobar Pneumonia CT',
      color: '#06b6d4',
      bg: '#ecfeff',
      border: '#a5f3fc',
      icon: Wind,
      patient: 'Clara Higgins, 67F'
    },
    {
      id: 'Endocrinology',
      title: 'Endocrinology: Type 2 Diabetes with Neuropathy',
      name: 'Pancreas & Glycemic Regulation',
      condition: 'HbA1c 10.4% / Neuropathy',
      color: '#f59e0b',
      bg: '#fffbeb',
      border: '#fde68a',
      icon: Activity,
      patient: 'Inpatient Female, 51F'
    },
    {
      id: 'Pathology',
      title: 'Diagnostic Laboratory Report: Blood & Metabolic Panel',
      name: 'Vascular & Blood Chemistry (Labs)',
      condition: 'Lipid & CBC Panel',
      color: '#10b981',
      bg: '#ecfdf5',
      border: '#a7f3d0',
      icon: FlaskConical,
      patient: 'Raymond Ortiz, 54M'
    },
    {
      id: 'Orthopedics',
      title: 'Orthopedics: Right Knee Meniscal Tear',
      name: 'Right Knee Joint & Meniscus',
      condition: 'Meniscal Tear / Repair',
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
      icon: Bone,
      patient: 'Inpatient Male, 42M'
    }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
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
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '10px 0 30px 0' }}>
      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
        borderRadius: '20px',
        padding: '36px 40px',
        color: '#ffffff',
        marginBottom: '32px',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient glow & vector curves */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '820px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{
              background: 'rgba(59, 130, 246, 0.25)',
              border: '1px solid rgba(147, 197, 253, 0.4)',
              color: '#93c5fd',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '11.5px',
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}>
              METROHEALTH CLINICAL AI V2.0 ENTERPRISE
            </span>
            <span style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(110, 231, 183, 0.4)',
              color: '#6ee7b7',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '11.5px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <ShieldCheck size={13} /> Clinical Safety Guardrail Active
            </span>
          </div>

          <h1 style={{ fontSize: '30px', fontWeight: 900, lineHeight: '1.25', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
            Explainable Clinical Decision Support & Patient Health Summarizer
          </h1>
          <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 20px 0' }}>
            Choose how you would like to proceed: select a pre-verified hospital benchmark across 6 major organ specialties, or ingest a new medical document with automated validation.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#38bdf8" /> Bio_ClinicalBERT & SHAP Heatmaps
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#34d399" /> AMA Grade 6 Patient Health Literacy
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#fbbf24" /> 100% Free & Open Architecture ($0.00)
            </span>
          </div>
        </div>
      </div>

      {/* Primary Intake Mode Selector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', gap: '26px' }}>
        {/* OPTION 1: Pre-Ingested Hospital Benchmarks */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '2px solid #bfdbfe',
          borderRadius: '18px',
          padding: '28px',
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}>
                <Stethoscope size={22} color="#ffffff" />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Option A • Instant Access
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Pre-Ingested Clinical Benchmarks
                </h2>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
              Select any of the 6 real-world hospital cases below to immediately launch the interactive anatomy cockpit, telemetry waves, and explainability heatmaps:
            </p>

            {/* 6 Benchmark Cases Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {benchmarks.map((bm) => {
                const Icon = bm.icon;
                return (
                  <div
                    key={bm.id}
                    onClick={() => onSelectBenchmark(bm.title, bm.id)}
                    style={{
                      background: bm.bg,
                      border: `1.5px solid ${bm.border}`,
                      borderLeft: `4px solid ${bm.color}`,
                      borderRadius: '10px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 6px 16px ${bm.color}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                      }}>
                        <Icon size={17} color={bm.color} />
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                          {bm.name}
                        </div>
                        <div style={{ fontSize: '11px', color: bm.color, fontWeight: 700, marginTop: '2px' }}>
                          {bm.condition}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onSelectBenchmark(benchmarks[1].title, 'Cardiology')}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 800,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
            }}
          >
            <span>Launch Default Cardiology Benchmark</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* OPTION 2: Upload New Clinical Document */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          border: '2px solid #a7f3d0',
          borderRadius: '18px',
          padding: '28px',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <FileUp size={22} color="#ffffff" />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Option B • Custom Intake
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Upload New Medical Document
                </h2>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6', marginBottom: '18px' }}>
              Upload any medical record (PDF, DOCX, TXT, or Scanned Slips). Automatically parsed with multi-format OCR and non-medical exception guardrail:
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* Drag & Drop Visual Ingestion Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              style={{
                border: `2px dashed ${dragActive ? '#10b981' : '#6ee7b7'}`,
                background: dragActive ? '#ecfdf5' : '#ffffff',
                borderRadius: '14px',
                padding: '24px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: '16px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px auto'
              }}>
                <Upload size={22} color="#059669" />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#065f46' }}>
                Drag & Drop Medical File or Click to Browse
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Supports PDF, DOCX, TXT, and Medical Scans
              </div>
            </div>

            {/* Acceptable Format Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
              {['Discharge Summaries', 'Blood / Lab Panels', 'Chest CT / X-Ray', 'Prescriptions'].map((fmt, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #d1fae5',
                    color: '#065f46',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: 700
                  }}
                >
                  ✓ {fmt}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => fileInputRef.current.click()}
              className="btn btn-primary"
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                fontWeight: 800,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                border: 'none'
              }}
            >
              <Upload size={16} />
              <span>Browse Medical File</span>
            </button>
            <button
              onClick={() => setShowCustomModal(true)}
              className="btn btn-secondary"
              style={{
                padding: '12px 18px',
                fontSize: '13.5px',
                fontWeight: 700,
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #cbd5e1'
              }}
            >
              <FileText size={16} />
              <span>Paste Text</span>
            </button>
          </div>
        </div>
      </div>

      {/* Paste Custom Note Modal */}
      {showCustomModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.72)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            padding: '26px 28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            border: '1px solid #cbd5e1'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
              Paste Clinical Note or EHR Narrative
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
              Paste any physician consultation text, lab report, or discharge instructions:
            </p>
            <textarea
              rows={8}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste clinical text here (e.g. 58-year-old male with chest pain...)"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontFamily: 'monospace',
                marginBottom: '16px',
                resize: 'vertical'
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
                    setShowCustomModal(false);
                    onAnalyzeCustomText(customText);
                  }
                }}
                className="btn btn-primary"
                disabled={!customText.trim()}
              >
                Process & Analyze Intake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
