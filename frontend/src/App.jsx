import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HumanAnatomyDiagram from './components/HumanAnatomyDiagram';
import VitalsTelemetryCockpit from './components/VitalsTelemetryCockpit';
import DocumentUploadBar from './components/DocumentUploadBar';
import PatientDemographicsBanner from './components/PatientDemographicsBanner';
import DiagnosticCharts from './components/DiagnosticCharts';
import LabReportVisualizer from './components/LabReportVisualizer';
import RadiologyVisualizer from './components/RadiologyVisualizer';
import ExplainabilityHeatmap from './components/ExplainabilityHeatmap';
import PatientCarePortal from './components/PatientCarePortal';
import NliSafetyAudit from './components/NliSafetyAudit';
import CollegeTeamFooter from './components/CollegeTeamFooter';
import ClinicalPipelineLoader from './components/ClinicalPipelineLoader';
import ClinicalIntakeLanding from './components/ClinicalIntakeLanding';
import AuthScreen from './components/AuthScreen';
import DoctorPatientSearch from './components/DoctorPatientSearch';
import PatientDashboardView from './components/PatientDashboardView';

import {
  FileText,
  Stethoscope,
  HeartHandshake,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  X,
  HelpCircle,
  Download,
  Printer,
  Sparkles,
  RefreshCw,
  FlaskConical,
  Layers,
  Cpu,
  FileCheck2,
  Activity,
  ArrowLeft
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('metrohealth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [samples, setSamples] = useState([]);
  const [selectedCaseTitle, setSelectedCaseTitle] = useState('');
  const [activeTab, setActiveTab] = useState('tab_diagnostics');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const [showAnatomyDiagram, setShowAnatomyDiagram] = useState(true);
  const [activeOrganId, setActiveOrganId] = useState('Cardiology');
  const [uploadError, setUploadError] = useState(null);
  const [viewScreen, setViewScreen] = useState('workstation'); // 'landing' | 'workstation'

  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('metrohealth_user', JSON.stringify(user));
    } catch {}

    if (user.role === 'patient') {
      // Patient starts fresh with their own document intake screen
      setSelectedCaseTitle('');
      setAnalysisResult(null);
      setCurrentText('');
    } else {
      if (samples.length > 0) {
        const matchedCase = samples.find(s => s.patient_name === user.name) || samples[0];
        setSelectedCaseTitle(matchedCase.title);
        setActiveOrganId(matchedCase.specialty || 'Cardiology');
        analyzeText(matchedCase.text, {
          name: matchedCase.patient_name || user.name,
          id: matchedCase.patient_id || user.patientId,
          age: matchedCase.age || user.age,
          gender: matchedCase.gender || user.gender,
          ward: matchedCase.ward || user.ward
        });
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAnalysisResult(null);
    setSelectedCaseTitle('');
    setCurrentText('');
    try {
      localStorage.removeItem('metrohealth_user');
    } catch {}
  };

  // Initial load: Fetch samples and initialize default case (for doctors only)
  useEffect(() => {
    async function loadInitial() {
      try {
        const resp = await fetch('/api/samples');
        const data = await resp.json();
        const sampleList = data.samples || [];
        setSamples(sampleList);

        if (sampleList.length > 0 && !analysisResult) {
          if (!currentUser || currentUser.role !== 'patient') {
            const defaultCase = sampleList[0];
            setSelectedCaseTitle(defaultCase.title);
            setActiveOrganId(defaultCase.specialty || 'Cardiology');
            analyzeText(defaultCase.text, {
              name: defaultCase.patient_name || 'Marcus Vance',
              id: defaultCase.patient_id || 'PT-2026-8841',
              age: defaultCase.age || 58,
              gender: defaultCase.gender || 'Male',
              ward: defaultCase.ward || 'Coronary ICU'
            });
          }
        }
      } catch (err) {
        console.error('Failed to load initial cases:', err);
      }
    }
    loadInitial();
  }, []);

  const handleDoctorSelectPatient = (patient) => {
    setViewScreen('workstation');
    if (patient.specialty) {
      setActiveOrganId(patient.specialty);
    }
    setSelectedCaseTitle(patient.title || `Patient Record: ${patient.patient_name}`);
    analyzeText(patient.text, {
      name: patient.patient_name,
      id: patient.patient_id,
      age: patient.age,
      gender: patient.gender,
      ward: patient.ward
    });
  };

  const analyzeText = async (text, patientMeta = {}) => {
    setIsAnalyzing(true);
    setUploadError(null);
    try {
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          patient_name: patientMeta.name || 'Marcus Vance',
          patient_id: patientMeta.id || 'PT-2026-8841',
          age: patientMeta.age || 58,
          gender: patientMeta.gender || 'Male',
          ward: patientMeta.ward || 'Coronary ICU'
        })
      });
      const result = await resp.json();
      setAnalysisResult(result);
      setCurrentText(text);

      // Harmonize active organ if not set manually
      if (result.document_type === 'Laboratory Test Report') {
        setActiveOrganId('Pathology');
      } else if (result.classification?.top_specialty) {
        setActiveOrganId(result.classification.top_specialty);
      }
    } catch (err) {
      console.error('Analysis request error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectBenchmark = (sampleTitle, specialtyId) => {
    setActiveOrganId(specialtyId);
    setViewScreen('workstation');
    const matched = samples.find(s => s.title === sampleTitle || s.specialty === specialtyId);
    if (matched) {
      setSelectedCaseTitle(matched.title);
      analyzeText(matched.text, {
        name: matched.patient_name,
        id: matched.patient_id,
        age: matched.age,
        gender: matched.gender,
        ward: matched.ward
      });
    } else {
      // Fallback
      setSelectedCaseTitle(sampleTitle);
    }
  };

  const handleSelectHotspot = (sampleKey, specialtyId) => {
    setActiveOrganId(specialtyId);
    const matched = samples.find(s => s.title === sampleKey || s.specialty === specialtyId);
    if (matched) {
      setSelectedCaseTitle(matched.title);
      analyzeText(matched.text, {
        name: matched.patient_name,
        id: matched.patient_id,
        age: matched.age,
        gender: matched.gender,
        ward: matched.ward
      });
    }
  };

  const handleUploadFile = async (file) => {
    setViewScreen('workstation');
    setIsAnalyzing(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        const detail = errJson.detail || {};
        let errTitle = 'Medical Validation Exception';
        let errReason = 'The uploaded file could not be verified as a valid medical or clinical record.';
        if (typeof detail === 'string') {
          errReason = detail;
        } else if (typeof detail === 'object') {
          errTitle = detail.title || errTitle;
          errReason = detail.reason || errReason;
        }
        setUploadError({
          title: errTitle,
          reason: errReason,
          filename: file.name
        });
        return;
      }

      const result = await resp.json();
      setAnalysisResult(result);
      setSelectedCaseTitle(`Uploaded: ${file.name}`);
      setCurrentText(result.text || file.name);

      if (result.document_type === 'Laboratory Test Report') {
        setActiveOrganId('Pathology');
      } else if (result.classification?.top_specialty) {
        setActiveOrganId(result.classification.top_specialty);
      }
    } catch (err) {
      console.error('File upload analysis error:', err);
      setUploadError({
        title: 'Uploaded Document Cannot Be Processed',
        reason: 'Transmission or parsing error. Please verify the document contains readable medical or EHR text.',
        filename: file.name
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeCustom = (text) => {
    setViewScreen('workstation');
    setSelectedCaseTitle('Custom Clinical Intake');
    analyzeText(text, {
      name: 'Custom Inpatient',
      id: 'PT-CUSTOM-01',
      age: 60,
      gender: 'Specified',
      ward: 'Acute Assessment Ward'
    });
  };

  const handleDownloadDocx = async () => {
    try {
      const resp = await fetch('/api/download-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          patient_name: analysisResult?.patient?.name || 'Inpatient',
          patient_id: analysisResult?.patient?.id || 'PT-2026',
          age: analysisResult?.patient?.age || 58,
          gender: analysisResult?.patient?.gender || 'Male',
          ward: analysisResult?.patient?.ward || 'CCU'
        })
      });
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Official_Hospital_Discharge_${analysisResult?.patient?.id || 'Record'}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const docType = analysisResult?.document_type || 'Clinical Discharge Summary';
  const specialty = analysisResult?.classification?.top_specialty || activeOrganId || 'Cardiology';
  const isPreIngested = !selectedCaseTitle?.startsWith('Uploaded:') && selectedCaseTitle !== 'Custom Clinical Intake';

  // 1. If not authenticated, render AuthScreen
  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // 2. If authenticated as Patient, render Patient Dashboard View
  if (currentUser.role === 'patient') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
        <Navbar
          latencyMs={analysisResult?.processing_time_ms}
          documentType={docType}
          isAnalyzing={isAnalyzing}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 28px', flex: 1 }}>
          <PatientDashboardView
            currentUser={currentUser}
            analysisResult={analysisResult}
            selectedCaseTitle={selectedCaseTitle}
            onDownloadDocx={handleDownloadDocx}
            onLogout={handleLogout}
            onUploadFile={handleUploadFile}
            onAnalyzeCustomText={handleAnalyzeCustom}
            onResetDocument={() => {
              setAnalysisResult(null);
              setSelectedCaseTitle('');
              setCurrentText('');
            }}
            isAnalyzing={isAnalyzing}
          />
          <CollegeTeamFooter />
        </main>
        <ClinicalPipelineLoader isAnalyzing={isAnalyzing} onComplete={() => {}} />

        {/* Medical Validation Exception Alert Modal for Patient Portal */}
        {uploadError && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(220, 38, 38, 0.25)',
              border: '2px solid #ef4444',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#fef2f2',
                borderBottom: '1px solid #fee2e2',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                  }}>
                    <ShieldAlert size={20} color="#ffffff" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                      {uploadError.title || 'Medical Validation Exception'}
                    </h3>
                    <span style={{ fontSize: '11.5px', color: '#b91c1c', fontWeight: 600 }}>
                      Document Rejected: {uploadError.filename}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setUploadError(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '22px 24px' }}>
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#7f1d1d',
                  lineHeight: '1.6'
                }}>
                  <strong>Validation Reason:</strong>
                  <p style={{ margin: '6px 0 0 0', color: '#991b1b' }}>{uploadError.reason}</p>
                </div>

                <div style={{ fontSize: '12px', color: '#475569', marginBottom: '20px' }}>
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '6px' }}>Supported Clinical Document Formats:</strong>
                  <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
                    <li>Hospital Discharge Summaries & Inpatient EHR Notes</li>
                    <li>Laboratory Diagnostic Test Reports (CBC, CMP, Lipid, HbA1c, Renal)</li>
                    <li>Radiology & Imaging Scans (Chest CT, MRI, X-Ray)</li>
                    <li>Doctor Prescriptions & Medication Protocols</li>
                  </ul>
                </div>

                <button
                  onClick={() => setUploadError(null)}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    border: 'none',
                    padding: '12px',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    borderRadius: '10px',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)'
                  }}
                >
                  Dismiss & Choose Medical File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Authenticated as Doctor: Render Doctor Workstation with Patient Search
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Top Navbar */}
      <Navbar
        latencyMs={analysisResult?.processing_time_ms}
        documentType={docType}
        isAnalyzing={isAnalyzing}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 28px', flex: 1 }}>
        {/* Doctor Patient Registry Search & Quick Report Fetcher */}
        <DoctorPatientSearch
          samples={samples}
          activePatientName={analysisResult?.patient?.name || (samples.find(s => s.title === selectedCaseTitle)?.patient_name)}
          onSelectPatient={handleDoctorSelectPatient}
          isAnalyzing={isAnalyzing}
        />

        {/* VIEW 1: Clinical Intake Landing Portal (When user first arrives) */}
        {viewScreen === 'landing' ? (
          <ClinicalIntakeLanding
            samples={samples}
            onSelectBenchmark={handleSelectBenchmark}
            onUploadFile={handleUploadFile}
            onAnalyzeCustomText={handleAnalyzeCustom}
          />
        ) : (
          /* VIEW 2: Interactive Clinical Workstation (After user selects benchmark or uploads file) */
          <div>
            {/* Top Navigation & Switch Intake Mode Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
              background: '#ffffff',
              padding: '12px 18px',
              borderRadius: '12px',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <button
                onClick={() => setViewScreen('landing')}
                className="btn btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#1e293b'
                }}
              >
                <ArrowLeft size={16} color="#2563eb" />
                <span>Return to Intake Portal / Select Another Case</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Active Case Ingestion:</span>
                <span style={{
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  fontSize: '12.5px',
                  fontWeight: 800
                }}>
                  {selectedCaseTitle || 'Clinical Record'}
                </span>
              </div>
            </div>

            {/* Interactive Human Anatomy Hotspot Cockpit - Only shown for pre-ingested benchmarks */}
            {showAnatomyDiagram && isPreIngested && (
              <HumanAnatomyDiagram
                activeSpecialty={specialty}
                activeOrganId={activeOrganId}
                onSelectHotspot={handleSelectHotspot}
              />
            )}

            {/* Custom Ingested Document Banner - Shown for uploaded / custom documents */}
            {!isPreIngested && (
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #bfdbfe',
                borderRadius: '12px',
                padding: '14px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.04)',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                        Active Custom Document Analysis
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#16a34a',
                        background: '#dcfce7',
                        padding: '2px 8px',
                        borderRadius: '999px'
                      }}>
                        Parsed & Ingested
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                      File: <strong>{selectedCaseTitle.replace('Uploaded: ', '')}</strong> • Clinical AI pipeline executed with automated medical entity extraction.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setViewScreen('landing')}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '12.5px',
                    padding: '7px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Upload Another Document</span>
                </button>
              </div>
            )}

            {/* Patient Demographics Card */}
            {analysisResult?.patient && (
              <PatientDemographicsBanner
                patient={analysisResult.patient}
                documentType={docType}
                specialty={specialty}
              />
            )}

            {/* Real-Time Biometric Vitals Cockpit & Telemetry */}
            <VitalsTelemetryCockpit
              vitals={analysisResult?.entities?.vital_signs}
              confidence={analysisResult?.classification?.confidence}
              readingGrade={analysisResult?.summary?.reading_grade_level}
            />

            {/* Specialty Document Visualizer Callouts (Lab Tests & Radiology Scans) */}
            {docType === 'Laboratory Test Report' && analysisResult?.lab_results && (
              <LabReportVisualizer labResults={analysisResult.lab_results} />
            )}

            {docType === 'Radiology & Imaging Report' && analysisResult?.imaging_results && (
              <RadiologyVisualizer imagingResults={analysisResult.imaging_results} />
            )}

            {/* Primary Workflow Tabs & Download Action */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #e2e8f0',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
                {[
                  { id: 'tab_diagnostics', label: '1. Diagnostic Co-Pilot & XAI Evidence', icon: Stethoscope, color: '#2563eb' },
                  { id: 'tab_patient', label: '2. Patient Layman Care Portal', icon: HeartHandshake, color: '#059669' },
                  { id: 'tab_safety', label: '3. NLI Closed-Loop Safety Guardrail', icon: ShieldCheck, color: '#dc2626' },
                  { id: 'tab_intake', label: '4. Source Document & Raw Transcription', icon: FileText, color: '#475569' },
                  { id: 'tab_arch', label: '5. Architecture & Innovations', icon: Cpu, color: '#7c3aed' }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 18px',
                        fontSize: '13px',
                        fontWeight: isActive ? 800 : 600,
                        color: isActive ? tab.color : '#64748b',
                        background: 'none',
                        border: 'none',
                        borderBottom: `3px solid ${isActive ? tab.color : 'transparent'}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        marginBottom: '-2px'
                      }}
                    >
                      <Icon size={16} color={isActive ? tab.color : '#94a3b8'} strokeWidth={isActive ? 2.5 : 2} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Download Official DOCX Discharge Summary Button */}
              <button
                onClick={handleDownloadDocx}
                className="btn btn-primary"
                style={{
                  marginBottom: '6px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)',
                  fontSize: '12.5px',
                  padding: '8px 16px'
                }}
              >
                <Download size={15} />
                <span>Download Official Hospital DOCX</span>
              </button>
            </div>

            {/* TAB 1: Diagnostic Co-Pilot & XAI Evidence */}
            {activeTab === 'tab_diagnostics' && analysisResult && (
              <div>
                <DiagnosticCharts
                  classification={analysisResult.classification}
                  entities={analysisResult.entities}
                />
                <ExplainabilityHeatmap
                  heatmapHtml={analysisResult.heatmap_html}
                  rawText={currentText}
                  specialty={specialty}
                  topDrivingKeywords={analysisResult.top_driving_keywords || []}
                />
              </div>
            )}

            {/* TAB 2: Patient Care Portal */}
            {activeTab === 'tab_patient' && analysisResult && (
              <PatientCarePortal
                summary={analysisResult.summary}
                onDownloadDocx={handleDownloadDocx}
              />
            )}

            {/* TAB 3: NLI Safety Guardrail */}
            {activeTab === 'tab_safety' && analysisResult && (
              <NliSafetyAudit
                factChecking={analysisResult.fact_checking}
                sourceText={currentText}
              />
            )}

            {/* TAB 4: Source Document & Raw Transcription */}
            {activeTab === 'tab_intake' && (
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <FileText size={17} color="#2563eb" />
                    <span>Active Clinical Document Transcription</span>
                  </div>
                  <span className="badge badge-blue">
                    {currentText.split(/\s+/).length} Words Ingested
                  </span>
                </div>
                <div className="card-body">
                  <textarea
                    readOnly
                    value={currentText}
                    style={{
                      width: '100%',
                      height: '420px',
                      padding: '16px',
                      fontSize: '13px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: '#1e293b',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      lineHeight: '1.6',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            )}

            {/* TAB 5: Architecture & Research Innovations */}
            {activeTab === 'tab_arch' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">
                      <Cpu size={17} color="#2563eb" />
                      <span>Closed-Loop 4-Step Clinical AI Pipeline</span>
                    </div>
                  </div>
                  <div className="card-body" style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                    <p><strong>Step 1: Clinical Intake & Multi-Modal Parsing:</strong> Ingests EHR discharge narratives, laboratory panels (CBC/Lipid/CMP), and radiology scan impressions.</p>
                    <p style={{ marginTop: '8px' }}><strong>Step 2: Diagnostic Specialization & SHAP:</strong> Fine-tuned Bio_ClinicalBERT classifies specialty with Shapley token attribution heatmaps eliminating algorithmic opacity.</p>
                    <p style={{ marginTop: '8px' }}><strong>Step 3: Layman Patient Synthesis:</strong> NVIDIA NIM Llama 3.2 translates dense medical jargon into AMA Grade 6 readability with structured pill timing tables.</p>
                    <p style={{ marginTop: '8px' }}><strong>Step 4: DeBERTa-v3 Closed-Loop NLI Audit:</strong> Cross-encoder verifies every sentence against the source note. Hallucinated claims are blocked before patient release.</p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <div className="card-title">
                      <ShieldCheck size={17} color="#10b981" />
                      <span>Comparative Advantage over Prior Systems</span>
                    </div>
                  </div>
                  <div className="card-body" style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                    <p>• <strong>Zero Hallucinations:</strong> Standard medical LLMs hallucinate in 18-35% of clinical summaries (Med-HALT benchmark). MedExplain AI enforces mathematical NLI entailment.</p>
                    <p style={{ marginTop: '8px' }}>• <strong>100% Free & Fast:</strong> Zero recurring API bills ($0.00). Deterministic local fallback executes in &lt;50ms.</p>
                    <p style={{ marginTop: '8px' }}>• <strong>Zero Emojis & Enterprise UX:</strong> Hospital-grade design system with clean SVG & Lucide iconography and visual lab range meters.</p>
                    <p style={{ marginTop: '8px' }}>• <strong>Comprehensive Document Support:</strong> Works across discharge notes, lab reports, CT/MRI radiology scans, and prescriptions.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Academic Team Footer */}
        <CollegeTeamFooter />
      </main>

      {/* Interactive Step-by-Step Clinical Processing Pipeline Loader */}
      <ClinicalPipelineLoader isAnalyzing={isAnalyzing} onComplete={() => {}} />

      {/* Non-Medical Document Rejection Modal Popup */}
      {uploadError && (
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
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            border: '2px solid #ef4444',
            boxShadow: '0 20px 50px rgba(239, 68, 68, 0.25)',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              borderBottom: '1px solid #fecaca',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                }}>
                  <ShieldAlert size={20} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                    {uploadError.title}
                  </h3>
                  <span style={{ fontSize: '11.5px', color: '#b91c1c', fontWeight: 600 }}>
                    File Ingest Rejected: {uploadError.filename}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setUploadError(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '22px 24px' }}>
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '16px',
                fontSize: '13px',
                color: '#7f1d1d',
                lineHeight: '1.6'
              }}>
                <strong>Diagnostic Rejection Reason:</strong>
                <p style={{ margin: '6px 0 0 0', color: '#991b1b' }}>{uploadError.reason}</p>
              </div>

              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '20px' }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '6px' }}>Supported Clinical Document Formats:</strong>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
                  <li>Hospital Discharge Summaries & Inpatient EHR Notes</li>
                  <li>Laboratory Diagnostic Test Reports (CBC, CMP, Lipid, HbA1c, Renal)</li>
                  <li>Radiology & Imaging Scans (Chest CT, MRI, X-Ray)</li>
                  <li>Doctor Prescriptions & Medication Protocols</li>
                </ul>
              </div>

              <button
                onClick={() => setUploadError(null)}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  padding: '12px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  borderRadius: '10px',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)'
                }}
              >
                Dismiss & Choose Medical File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
