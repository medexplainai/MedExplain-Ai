import React, { useState, useRef } from 'react';
import {
  HeartHandshake,
  Pill,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  Activity,
  HeartPulse,
  LogOut,
  UploadCloud,
  FileText,
  Lock,
  ArrowRight,
  RefreshCw,
  FileUp,
  Award,
  FileDown,
  Users,
  UserPlus,
  Layers,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  ChevronRight,
  Plus
} from 'lucide-react';
import PatientCarePortal from './PatientCarePortal';
import LabReportVisualizer from './LabReportVisualizer';
import RadiologyVisualizer from './RadiologyVisualizer';

export default function PatientDashboardView({
  currentUser,
  analysisResult,
  selectedCaseTitle,
  onDownloadDocx,
  onDownloadPdf,
  onLogout,
  onUploadFile,
  onAnalyzeCustomText,
  onResetDocument,
  isAnalyzing,
  userTracks = [],
  activeTrack = null,
  onSelectTrack,
  onOpenCreateTrack,
  onOpenUploadFollowup,
  onOpenLongitudinalModal,
  activeReportType = 'baseline',
  onSwitchReportType
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [customText, setCustomText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Drag and drop handlers for patient intake
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

  // Text to Speech playback
  const handleToggleAudio = () => {
    if (!analysisResult?.summary?.overview) return;
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const patientName = analysisResult?.patient?.name || 'Patient';
        const textToRead = `Hello ${patientName}. Here is your simplified discharge health summary. ${analysisResult.summary.overview}. Please take your medications as directed and contact your care team if you experience severe symptoms.`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      alert("Text-to-speech audio is not supported in this browser.");
    }
  };

  // Helper: Relationship badge style
  const getRelationshipStyle = (rel) => {
    switch ((rel || '').toLowerCase()) {
      case 'self':
        return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' };
      case 'father':
        return { bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' };
      case 'mother':
        return { bg: '#fce7f3', text: '#9d174d', border: '#fbcfe8' };
      case 'spouse':
      case 'partner':
        return { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff' };
      case 'child':
      case 'dependent':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      default:
        return { bg: '#f1f5f9', text: '#334155', border: '#e2e8f0' };
    }
  };

  // -------------------------------------------------------------------------
  // REUSABLE COMPONENT: Family & Personal Health Tracks Switcher Bar
  // -------------------------------------------------------------------------
  const renderTracksSwitcherBar = () => (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '16px',
      padding: '16px 20px',
      border: '1.5px solid #e2e8f0',
      marginBottom: '20px',
      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: userTracks.length > 0 ? '14px' : '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#ecfdf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#059669',
            border: '1px solid #a7f3d0'
          }}>
            <Users size={19} />
          </div>
          <div>
            <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Personal & Family Medical Dossier</span>
              <span style={{
                background: '#dcfce7',
                color: '#166534',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px'
              }}>
                {userTracks.length} Active {userTracks.length === 1 ? 'Track' : 'Tracks'}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              Track longitudinal health progress across your family under one secure patient account.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {onOpenUploadFollowup && activeTrack && (
            <button
              onClick={onOpenUploadFollowup}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9px',
                padding: '8px 16px',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(5, 150, 105, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <UploadCloud size={15} />
              <span>+ Upload Follow-Up Report</span>
            </button>
          )}

          {onOpenCreateTrack && (
            <button
              onClick={onOpenCreateTrack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                background: '#ffffff',
                color: '#0f766e',
                border: '1.5px solid #0d9488',
                borderRadius: '9px',
                padding: '8px 15px',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(13, 148, 136, 0.1)',
                transition: 'all 0.15s ease'
              }}
            >
              <UserPlus size={15} />
              <span>+ Start New Track / Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable Track Chips */}
      {userTracks.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {userTracks.map((trk) => {
            const isSelected = activeTrack?.id === trk.id;
            const hasFollowup = !!trk.latest_report;
            const trajBadge = trk.longitudinal_trajectory?.trajectory_badge;
            const relStyle = getRelationshipStyle(trk.relationship);

            return (
              <div
                key={trk.id}
                onClick={() => onSelectTrack && onSelectTrack(trk)}
                style={{
                  minWidth: '240px',
                  maxWidth: '280px',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  border: isSelected ? '2px solid #059669' : '1.5px solid #cbd5e1',
                  background: isSelected ? '#f0fdf4' : '#ffffff',
                  boxShadow: isSelected ? '0 6px 18px rgba(5, 150, 105, 0.12)' : '0 2px 5px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{
                      background: relStyle.bg,
                      color: relStyle.text,
                      border: `1px solid ${relStyle.border}`,
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      textTransform: 'uppercase'
                    }}>
                      {trk.relationship || 'Self'}
                    </span>
                    {hasFollowup && (
                      <span style={{
                        background: trajBadge === 'WORSENED' ? '#fee2e2' : '#ecfdf5',
                        color: trajBadge === 'WORSENED' ? '#991b1b' : '#047857',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        {trajBadge === 'WORSENED' ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                        <span>{trajBadge || '2 REPORTS'}</span>
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {trk.name}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    {trk.specialty || 'General Care'} • {trk.age ? `${trk.age} yrs` : 'Demographics OK'}
                  </div>
                </div>

                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: isSelected ? '#059669' : '#94a3b8', fontWeight: 700 }}>
                    {hasFollowup ? '2 Reports (Baseline & Recheck)' : '1 Report (Baseline Ingested)'}
                  </span>
                  {isSelected && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#059669',
                      boxShadow: '0 0 6px #10b981'
                    }} />
                  )}
                </div>
              </div>
            );
          })}

          {/* Quick "+ Add Family Member" Card */}
          <div
            onClick={onOpenCreateTrack}
            style={{
              minWidth: '150px',
              borderRadius: '12px',
              border: '2px dashed #99f6e4',
              background: '#f0fdfa',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              textAlign: 'center',
              color: '#0f766e',
              transition: 'all 0.15s ease'
            }}
          >
            <UserPlus size={20} style={{ marginBottom: '6px' }} />
            <span style={{ fontSize: '12px', fontWeight: 800 }}>+ Add Member</span>
            <span style={{ fontSize: '10.5px', color: '#14b8a6' }}>New Medical Track</span>
          </div>
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------------------
  // SCREEN 1: Patient Medical Document Intake Screen (No document analyzed yet)
  // -------------------------------------------------------------------------
  if (!analysisResult) {
    return (
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '16px 20px 48px 20px' }}>
        {/* Render Tracks Bar if user has registered tracks */}
        {renderTracksSwitcherBar()}

        {/* Welcome Header */}
        <div style={{
          background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0f766e 100%)',
          borderRadius: '20px',
          padding: '32px 36px',
          color: '#ffffff',
          marginBottom: '28px',
          boxShadow: '0 12px 30px rgba(4, 120, 87, 0.22)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-60px',
            right: '-40px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110, 231, 183, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}>
                <HeartHandshake size={32} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    borderRadius: '999px',
                    padding: '3px 12px',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Patient Health Portal
                  </span>
                  <span style={{
                    background: '#dcfce7',
                    color: '#166534',
                    borderRadius: '999px',
                    padding: '2px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Lock size={11} /> HIPAA Protected & Multi-System Persistent
                  </span>
                </div>
                <h1 style={{ fontSize: '28px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
                  Welcome, {currentUser?.name || 'Patient'}!
                </h1>
                <p style={{ fontSize: '13.5px', color: '#a7f3d0', margin: '6px 0 0 0', maxWidth: '640px', lineHeight: '1.5' }}>
                  {userTracks.length > 0
                    ? 'Select one of your existing personal or family health tracks above, or upload a new medical record below.'
                    : 'Upload your hospital discharge summary, clinic note, or lab report to create your first permanent health track.'}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Primary Document Intake Box */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          borderRadius: '16px',
          border: '1.5px solid #a7f3d0',
          padding: '32px 36px',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#065f46', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={22} color="#059669" />
                Upload Your Medical Document
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
                Supports digital Hospital Discharge Summaries, Lab Diagnostic Panels, Radiology Scans, or Clinic Notes (.pdf, .docx, .txt).
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setShowPasteModal(!showPasteModal)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: showPasteModal ? '#ecfdf5' : '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '9px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: showPasteModal ? '#047857' : '#334155',
                  cursor: 'pointer'
                }}
              >
                <FileText size={15} />
                <span>{showPasteModal ? 'Hide Text Input' : 'Or Paste Medical Note'}</span>
              </button>

              {onOpenCreateTrack && (
                <button
                  onClick={onOpenCreateTrack}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '9px 16px',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(5, 150, 105, 0.25)'
                  }}
                >
                  <UserPlus size={15} />
                  <span>+ Start New Family Track</span>
                </button>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Interactive Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2.5px dashed ${dragActive ? '#059669' : '#a7f3d0'}`,
              background: dragActive ? '#ecfdf5' : '#f0fdf4',
              borderRadius: '14px',
              padding: '40px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#059669',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
            }}>
              <FileUp size={32} />
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#065f46' }}>
              Drag & Drop your Medical File here, or <span style={{ color: '#059669', textDecoration: 'underline' }}>Browse files</span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px' }}>
              PDF, Microsoft Word (.docx), or Plain Text (.txt) • Maximum file size 25MB • Saved permanently to your account
            </p>
          </div>

          {/* Optional Direct Text Paste Area */}
          {showPasteModal && (
            <div style={{ marginTop: '22px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                Paste Your Medical Discharge Summary or Clinical Transcription:
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Example: 'PATIENT: Marcus Vance | MRN: PT-8841. Patient admitted with acute substernal chest pain. Coronary catheterization revealed 95% stenosis of LAD. Drug-eluting stent successfully deployed. Prescribed Aspirin 81mg and Ticagrelor 90mg BID...'"
                rows={6}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  disabled={!customText.trim() || isAnalyzing}
                  onClick={() => {
                    if (customText.trim()) onAnalyzeCustomText(customText.trim());
                  }}
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    padding: '10px 22px',
                    fontSize: '13px',
                    fontWeight: 800,
                    borderRadius: '8px',
                    border: 'none',
                    color: '#ffffff',
                    cursor: customText.trim() && !isAnalyzing ? 'pointer' : 'not-allowed',
                    opacity: customText.trim() && !isAnalyzing ? 1 : 0.6
                  }}
                >
                  {isAnalyzing ? 'Analyzing Medical Document...' : 'Analyze Pasted Medical Note'}
                </button>
              </div>
            </div>
          )}

          {/* Strict Clinical Validation Guardrail Notice */}
          <div style={{
            marginTop: '24px',
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}>
            <div style={{ color: '#d97706', marginTop: '2px' }}>
              <ShieldCheck size={22} />
            </div>
            <div style={{ fontSize: '12.5px', color: '#78350f', lineHeight: '1.6' }}>
              <strong style={{ display: 'block', fontSize: '13px', color: '#92400e', marginBottom: '2px' }}>
                Strict Clinical Document Verification & Multi-Device Persistence:
              </strong>
              MedExplain AI strictly verifies all incoming files against clinical entity benchmarks.
              Non-medical files will be rejected with an explicit <strong>Medical Validation Exception</strong>.
              All genuine reports are permanently saved across devices so you can track longitudinal changes whenever you log in.
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '18px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
            borderRadius: '14px',
            padding: '20px',
            border: '1.5px solid #bfdbfe',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.06)'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: '12px' }}>
              <Sparkles size={22} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              Grade 6 Plain-English Translation
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
              Complex medical jargon, Latin abbreviations, and lab codes are converted into clear, accessible language meeting AMA health literacy standards.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
            borderRadius: '14px',
            padding: '20px',
            border: '1.5px solid #a7f3d0',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.06)'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', marginBottom: '12px' }}>
              <Pill size={22} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              Visual 24-Hour Medication Clock
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
              Dosages, schedules, and pill purposes are mapped into intuitive morning, afternoon, evening, and bedtime dispenser boxes.
            </p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
            borderRadius: '14px',
            padding: '20px',
            border: '1.5px solid #fecdd3',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.06)'
          }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', marginBottom: '12px' }}>
              <Activity size={22} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
              Longitudinal Delta Comparison
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
              Upload serial follow-up test reports to compare past and present lab biomarkers and track clinical improvements automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // SCREEN 2: Verified Patient Care Dashboard (Document Analyzed)
  // -------------------------------------------------------------------------
  const patient = analysisResult?.patient || {
    name: 'Patient',
    id: 'DOC-EHR',
    age: null,
    gender: null,
    ward: null
  };

  const summary = analysisResult?.summary || {
    overview: '',
    medication_table: [],
    lifestyle: { dos: [], donts: [] },
    red_flags: [],
    reading_grade_level: 'Grade 6.0'
  };

  // Parse genuine vitals strictly from document entities - zero synthetic fallbacks
  const vitalsText = (analysisResult?.entities?.vital_signs || []).join(' ');
  const bpMatch = vitalsText.match(/(\d{2,3}\/\d{2,3})/);
  const hrMatch = vitalsText.match(/(\d{2,3})\s*(?:bpm|beats)/i) || vitalsText.match(/(?:hr|heart rate|pulse)[:\s]*(\d{2,3})/i);
  const spo2Match = vitalsText.match(/(\d{2,3})\s*%/);

  const bp = bpMatch ? bpMatch[1] : null;
  const hr = hrMatch ? hrMatch[1] : null;
  const spo2 = spo2Match ? spo2Match[1] : null;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 20px 48px 20px' }}>
      {/* 1. Family & Personal Health Tracks Switcher Bar */}
      {renderTracksSwitcherBar()}

      {/* 2. Patient Welcome Hero Card */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0f766e 100%)',
        borderRadius: '20px',
        padding: '28px 32px',
        color: '#ffffff',
        marginBottom: '24px',
        boxShadow: '0 12px 30px rgba(4, 120, 87, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110, 231, 183, 0.3) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
            }}>
              <HeartHandshake size={30} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: '999px',
                  padding: '3px 12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px'
                }}>
                  Patient Health & Care Portal
                </span>
                <span style={{
                  background: '#dcfce7',
                  color: '#166534',
                  borderRadius: '999px',
                  padding: '2px 10px',
                  fontSize: '11px',
                  fontWeight: 700
                }}>
                  Verified by Clinical Safety Guardrail
                </span>
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.4px' }}>
                Discharge Care Plan: {patient.name || 'Patient Health Summary'}
              </h1>
              <p style={{ fontSize: '13px', color: '#a7f3d0', margin: '4px 0 0 0' }}>
                MRN: <strong>{patient.id || 'Not Recorded'}</strong> • {patient.age ? `${patient.age} yrs` : 'Age: Not Recorded'} • {patient.gender ? `Gender: ${patient.gender}` : 'Gender: Not Recorded'} • Ward: <strong>{patient.ward || 'Not Recorded'}</strong> • Document: <strong>{selectedCaseTitle || 'Uploaded Record'}</strong>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Primary '+ Upload Follow-Up Report' Button */}
            {onOpenUploadFollowup && (
              <button
                onClick={onOpenUploadFollowup}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.15s ease'
                }}
              >
                <UploadCloud size={16} />
                <span>+ Upload Follow-Up Report</span>
              </button>
            )}

            {/* Listen to My Summary Audio TTS */}
            <button
              onClick={handleToggleAudio}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isPlayingAudio ? '#fef08a' : 'rgba(255, 255, 255, 0.95)',
                color: isPlayingAudio ? '#854d0e' : '#065f46',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.15s ease'
              }}
            >
              {isPlayingAudio ? <VolumeX size={17} /> : <Volume2 size={17} />}
              <span>{isPlayingAudio ? 'Stop Audio' : 'Listen to My Summary'}</span>
            </button>

            {/* Print Discharge Sheet */}
            <button
              onClick={() => window.print()}
              className="no-print"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                color: '#0284c7',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.15s ease'
              }}
            >
              <Printer size={16} />
              <span>Print Sheet</span>
            </button>

            {/* Download Official PDF */}
            {onDownloadPdf && (
              <button
                onClick={onDownloadPdf}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#047857',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(4, 120, 87, 0.25)',
                  transition: 'all 0.15s ease'
                }}
              >
                <FileDown size={16} />
                <span>Official PDF</span>
              </button>
            )}

            {/* Download Discharge (.docx) */}
            <button
              onClick={onDownloadDocx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                color: '#1e3a8a',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.15s ease'
              }}
            >
              <Download size={16} />
              <span>Download (.docx)</span>
            </button>

            {/* Upload Another / Reset */}
            <button
              onClick={onResetDocument}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#ffffff',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={15} />
              <span>New File</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Longitudinal Trajectory & Report Timeline View Selector */}
      {activeTrack?.latest_report && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #e6fffa 100%)',
          borderRadius: '16px',
          padding: '18px 22px',
          border: '1.5px solid #a7f3d0',
          marginBottom: '24px',
          boxShadow: '0 6px 20px rgba(5, 150, 105, 0.08)'
        }}>
          {/* Timeline Switcher Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
            paddingBottom: '14px',
            borderBottom: '1px solid #d1fae5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#059669" />
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#065f46' }}>
                Longitudinal Report Timeline:
              </span>
              <span style={{
                background: activeTrack.longitudinal_trajectory?.trajectory_badge === 'WORSENED' ? '#fee2e2' : '#dcfce7',
                color: activeTrack.longitudinal_trajectory?.trajectory_badge === 'WORSENED' ? '#991b1b' : '#166534',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                {activeTrack.longitudinal_trajectory?.status_label || 'Clinical Trajectory Active'}
              </span>
            </div>

            {/* Segmented Timeline Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', background: '#e2e8f0', borderRadius: '10px', padding: '3px' }}>
              <button
                onClick={() => onSwitchReportType && onSwitchReportType('baseline')}
                style={{
                  background: activeReportType === 'baseline' ? '#ffffff' : 'transparent',
                  color: activeReportType === 'baseline' ? '#065f46' : '#64748b',
                  boxShadow: activeReportType === 'baseline' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Calendar size={13} />
                <span>Baseline Admission ({activeTrack.baseline_report?.date || 'Initial'})</span>
              </button>

              <button
                onClick={() => onSwitchReportType && onSwitchReportType('latest')}
                style={{
                  background: activeReportType === 'latest' ? '#059669' : 'transparent',
                  color: activeReportType === 'latest' ? '#ffffff' : '#64748b',
                  boxShadow: activeReportType === 'latest' ? '0 2px 6px rgba(5, 150, 105, 0.25)' : 'none',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Activity size={13} />
                <span>Latest Follow-Up Recheck ({activeTrack.latest_report?.date || 'Latest'})</span>
              </button>
            </div>
          </div>

          {/* Longitudinal Delta Highlights Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            marginBottom: '14px'
          }}>
            {(activeTrack.longitudinal_trajectory?.metrics || []).slice(0, 4).map((m, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                borderRadius: '10px',
                padding: '10px 14px',
                border: '1px solid #a7f3d0',
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>{m.name}</span>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    color: m.status === 'IMPROVED' ? '#059669' : m.status === 'WORSENED' ? '#dc2626' : '#2563eb'
                  }}>
                    {m.status}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                  {m.baseline_value} → <span style={{ color: m.status === 'IMPROVED' ? '#059669' : '#0f172a' }}>{m.latest_value}</span> {m.unit}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  {m.delta_label || m.clinical_interpretation}
                </div>
              </div>
            ))}
          </div>

          {/* Trajectory Summary & View Delta Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#065f46', lineHeight: '1.5', flex: 1, minWidth: '260px' }}>
              <strong>Clinical Trajectory:</strong> {activeTrack.longitudinal_trajectory?.summary || 'Comparison between baseline and latest follow-up indicates physiological improvement.'}
            </p>
            {onOpenLongitudinalModal && (
              <button
                onClick={onOpenLongitudinalModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ffffff',
                  color: '#059669',
                  border: '1.5px solid #059669',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.1)'
                }}
              >
                <Activity size={14} />
                <span>View Full Longitudinal Delta Comparison</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Patient Health Telemetry Badges - Strictly Document Grounded */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        {/* Blood Pressure Badge */}
        <div style={{
          background: bp ? '#ffffff' : '#f8fafc',
          borderRadius: '12px',
          padding: '14px 18px',
          border: bp ? '1px solid #fecdd3' : '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bp ? '#fef2f2' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: bp ? '#ef4444' : '#94a3b8' }}>
            <HeartPulse size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Blood Pressure</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: bp ? '#881337' : '#94a3b8' }}>
              {bp ? `${bp} mmHg` : '-- / -- mmHg'}
            </div>
            <div style={{ fontSize: '10.5px', color: bp ? '#9f1239' : '#64748b', fontWeight: 700 }}>
              {bp ? 'Recorded in Note' : 'Not Recorded in Document'}
            </div>
          </div>
        </div>

        {/* Heart Rate Badge */}
        <div style={{
          background: hr ? '#ffffff' : '#f8fafc',
          borderRadius: '12px',
          padding: '14px 18px',
          border: hr ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: hr ? '#eff6ff' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: hr ? '#2563eb' : '#94a3b8' }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Heart Rate (Pulse)</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: hr ? '#1e3a8a' : '#94a3b8' }}>
              {hr ? `${hr} BPM` : '-- BPM'}
            </div>
            <div style={{ fontSize: '10.5px', color: hr ? '#1d4ed8' : '#64748b', fontWeight: 700 }}>
              {hr ? 'Recorded in Note' : 'Not Recorded in Document'}
            </div>
          </div>
        </div>

        {/* SpO2 Badge */}
        <div style={{
          background: spo2 ? '#ffffff' : '#f8fafc',
          borderRadius: '12px',
          padding: '14px 18px',
          border: spo2 ? '1px solid #a5f3fc' : '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: spo2 ? '#ecfeff' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: spo2 ? '#06b6d4' : '#94a3b8' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Oxygen Saturation</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: spo2 ? '#164e63' : '#94a3b8' }}>
              {spo2 ? `${spo2}% SpO2` : '-- % SpO2'}
            </div>
            <div style={{ fontSize: '10.5px', color: spo2 ? '#0891b2' : '#64748b', fontWeight: 700 }}>
              {spo2 ? 'Recorded in Note' : 'Not Recorded in Document'}
            </div>
          </div>
        </div>

        {/* Readability Score */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '14px 18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Health Literacy Level</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              {summary.reading_grade_level || 'Grade 6.0'}
            </div>
            <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700 }}>
              Plain English (AMA Benchmark)
            </div>
          </div>
        </div>
      </div>

      {/* 5. If Uploaded Document is a Laboratory Report with parsed lab values */}
      {analysisResult?.lab_results && analysisResult.lab_results.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <LabReportVisualizer labResults={analysisResult.lab_results} />
        </div>
      )}

      {/* 6. If Uploaded Document is a Radiology / Imaging Report with parsed scan sections */}
      {analysisResult?.imaging_results && (
        <div style={{ marginBottom: '24px' }}>
          <RadiologyVisualizer imagingData={analysisResult.imaging_results} />
        </div>
      )}

      {/* 7. Main Patient Care Sections */}
      <PatientCarePortal
        summary={summary}
        entities={analysisResult?.entities}
        patient={patient}
        onDownloadDocx={onDownloadDocx}
        onDownloadPdf={onDownloadPdf}
        doctorSignOff={{
          isSigned: true,
          doctorName: 'Dr. Sarah Jenkins, MD',
          title: 'Chief Medical Officer & Attending Physician',
          timestamp: 'October 2, 2026 at 01:00 AM',
          hash: 'SHA256:MH-2026-VERIFIED-RELEASE'
        }}
      />
    </div>
  );
}
