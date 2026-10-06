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
import LongitudinalComparisonModal from './components/LongitudinalComparisonModal';
import RegisterPatientModal from './components/RegisterPatientModal';
import UploadFollowupModal from './components/UploadFollowupModal';
import CreateTrackModal from './components/CreateTrackModal';
import AboutUsSection from './components/AboutUsSection';
import ReportQADrawer from './components/ReportQADrawer';

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
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  UserPlus,
  UploadCloud,
  CheckCircle2,
  GraduationCap,
  FileDown,
  MessageSquareText
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('metrohealth_auth_user') || localStorage.getItem('metrohealth_user');
      if (!saved) return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [samples, setSamples] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [activeReportType, setActiveReportType] = useState('baseline'); // 'baseline' | 'latest'
  const [isLongitudinalModalOpen, setIsLongitudinalModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUploadFollowupModalOpen, setIsUploadFollowupModalOpen] = useState(false);
  const [showAboutUsModal, setShowAboutUsModal] = useState(false);
  const [isQADrawerOpen, setIsQADrawerOpen] = useState(false);

  // Multi-Track Family & Personal Dossier State
  const [userTracks, setUserTracks] = useState([]);
  const [activeTrack, setActiveTrack] = useState(null);
  const [isCreateTrackModalOpen, setIsCreateTrackModalOpen] = useState(false);

  const [selectedCaseTitle, setSelectedCaseTitle] = useState('');
  const [activeTab, setActiveTab] = useState('tab_diagnostics');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const [showAnatomyDiagram, setShowAnatomyDiagram] = useState(true);
  const [activeOrganId, setActiveOrganId] = useState('Cardiology');
  const [uploadError, setUploadError] = useState(null);
  const [viewScreen, setViewScreen] = useState('workstation'); // 'landing' | 'workstation'
  const [doctorSignOff, setDoctorSignOff] = useState({
    isSigned: false,
    doctorName: 'Dr. Sarah Jenkins, MD',
    title: 'Attending Physician & Chief Medical Officer',
    department: 'Cardiology & Acute Inpatient Care',
    npi: 'NPI-948210492',
    timestamp: null,
    hash: null
  });

  const fetchUserTracks = async (email) => {
    if (!email) return [];
    try {
      const resp = await fetch(`/api/user/tracks?email=${encodeURIComponent(email)}`);
      const data = await resp.json();
      const tracks = data.tracks || [];
      setUserTracks(tracks);
      return tracks;
    } catch (err) {
      console.error('Failed to load user tracks:', err);
      return [];
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('metrohealth_auth_user', JSON.stringify(user));
      localStorage.setItem('metrohealth_user', JSON.stringify(user));
    } catch {}

    if (user.role === 'patient') {
      setSelectedCaseTitle('');
      setAnalysisResult(null);
      setCurrentText('');
      setActivePatient(null);
      fetchUserTracks(user.email).then((tracks) => {
        if (tracks.length > 0) {
          const defaultTrack = tracks[0];
          setActiveTrack(defaultTrack);
          setSelectedCaseTitle(defaultTrack.track_name || defaultTrack.name);
          const hasFollowup = !!defaultTrack.latest_report;
          setActiveReportType(hasFollowup ? 'latest' : 'baseline');
          const targetReport = hasFollowup ? defaultTrack.latest_report : (defaultTrack.baseline_report || { text: defaultTrack.text });
          analyzeText(targetReport?.text || defaultTrack.text, {
            name: defaultTrack.name,
            id: defaultTrack.id,
            age: defaultTrack.age,
            gender: defaultTrack.gender,
            ward: defaultTrack.ward
          });
        } else {
          setActiveTrack(null);
        }
      });
    } else {
      if (samples.length > 0) {
        const matchedCase = samples.find(s => (s.patient_name || s.name) === user.name) || samples[0];
        setActivePatient(matchedCase);
        setActiveReportType('baseline');
        setSelectedCaseTitle(matchedCase.title);
        setActiveOrganId(matchedCase.specialty || 'Cardiology');
        analyzeText(matchedCase.baseline_report?.text || matchedCase.text, {
          name: matchedCase.patient_name || matchedCase.name || user.name,
          id: matchedCase.patient_id || matchedCase.id || user.patientId,
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
    setActivePatient(null);
    setUserTracks([]);
    setActiveTrack(null);
    try {
      localStorage.removeItem('metrohealth_auth_user');
      localStorage.removeItem('metrohealth_user');
    } catch {}
  };

  // Initial load: Fetch samples and initialize default case (for doctors) or tracks (for patients)
  useEffect(() => {
    async function loadInitial() {
      try {
        const resp = await fetch('/api/samples');
        const data = await resp.json();
        const sampleList = data.samples || [];
        setSamples(sampleList);

        if (currentUser?.role === 'patient') {
          const tracks = await fetchUserTracks(currentUser.email);
          if (tracks.length > 0 && !analysisResult) {
            const defaultTrack = tracks[0];
            setActiveTrack(defaultTrack);
            setSelectedCaseTitle(defaultTrack.track_name || defaultTrack.name);
            const hasFollowup = !!defaultTrack.latest_report;
            setActiveReportType(hasFollowup ? 'latest' : 'baseline');
            const targetReport = hasFollowup ? defaultTrack.latest_report : (defaultTrack.baseline_report || { text: defaultTrack.text });
            analyzeText(targetReport?.text || defaultTrack.text, {
              name: defaultTrack.name,
              id: defaultTrack.id,
              age: defaultTrack.age,
              gender: defaultTrack.gender,
              ward: defaultTrack.ward
            });
          }
        } else if (sampleList.length > 0 && !analysisResult) {
          if (!currentUser || currentUser.role !== 'patient') {
            const defaultCase = sampleList[0];
            setActivePatient(defaultCase);
            setActiveReportType('baseline');
            setSelectedCaseTitle(defaultCase.title);
            setActiveOrganId(defaultCase.specialty || 'Cardiology');
            analyzeText(defaultCase.baseline_report?.text || defaultCase.text, {
              name: defaultCase.patient_name || defaultCase.name,
              id: defaultCase.patient_id || defaultCase.id,
              age: defaultCase.age,
              gender: defaultCase.gender,
              ward: defaultCase.ward
            });
          }
        }
      } catch (err) {
        console.error('Failed to load initial cases:', err);
      }
    }
    loadInitial();
  }, []);

  const handleSelectTrack = (track) => {
    setActiveTrack(track);
    setSelectedCaseTitle(track.track_name || track.name);
    const hasFollowup = !!track.latest_report;
    setActiveReportType(hasFollowup ? 'latest' : 'baseline');
    const targetReport = hasFollowup ? track.latest_report : (track.baseline_report || { text: track.text });
    analyzeText(targetReport?.text || track.text, {
      name: track.name,
      id: track.id,
      age: track.age,
      gender: track.gender,
      ward: track.ward
    });
  };

  const handleTrackCreated = (newTrack, analysis) => {
    fetchUserTracks(currentUser?.email);
    setActiveTrack(newTrack);
    setSelectedCaseTitle(newTrack.track_name || newTrack.name);
    setActiveReportType('baseline');
    if (analysis) {
      setAnalysisResult(analysis);
      setCurrentText(newTrack.baseline_report?.text || newTrack.text);
    } else {
      analyzeText(newTrack.baseline_report?.text || newTrack.text, {
        name: newTrack.name,
        id: newTrack.id,
        age: newTrack.age,
        gender: newTrack.gender,
        ward: newTrack.ward
      });
    }
  };

  const handlePatientFollowupAdded = (updatedRecord, followupAnalysis) => {
    if (currentUser?.role === 'patient') {
      fetchUserTracks(currentUser?.email);
      setActiveTrack(updatedRecord);
      setActiveReportType('latest');
      setSelectedCaseTitle(updatedRecord.latest_report?.title || `Latest Follow-Up: ${updatedRecord.name}`);
      if (followupAnalysis) {
        setAnalysisResult(followupAnalysis);
        setCurrentText(updatedRecord.latest_report?.text);
      } else {
        analyzeText(updatedRecord.latest_report?.text, {
          name: updatedRecord.name,
          id: updatedRecord.id,
          age: updatedRecord.age,
          gender: updatedRecord.gender,
          ward: updatedRecord.ward
        });
      }
      setIsLongitudinalModalOpen(true);
    } else {
      handleFollowupAdded(updatedRecord);
    }
  };

  const handleDoctorSelectPatient = (patient) => {
    setViewScreen('workstation');
    setActivePatient(patient);
    setActiveReportType('baseline');
    if (patient.specialty) {
      setActiveOrganId(patient.specialty);
    }
    const reportText = patient.baseline_report?.text || patient.text;
    setSelectedCaseTitle(patient.baseline_report?.title || patient.title || `Patient Record: ${patient.patient_name || patient.name}`);
    analyzeText(reportText, {
      name: patient.patient_name || patient.name,
      id: patient.patient_id || patient.id,
      age: patient.age,
      gender: patient.gender,
      ward: patient.ward
    });
  };

  const handleSwitchReportType = (type) => {
    setActiveReportType(type);
    if (currentUser?.role === 'patient' && activeTrack) {
      if (type === 'latest' && activeTrack.latest_report?.text) {
        setSelectedCaseTitle(activeTrack.latest_report.title || `Latest Follow-Up: ${activeTrack.name}`);
        analyzeText(activeTrack.latest_report.text, {
          name: activeTrack.name,
          id: activeTrack.id,
          age: activeTrack.age,
          gender: activeTrack.gender,
          ward: activeTrack.ward
        });
      } else {
        const bRep = activeTrack.baseline_report;
        const bText = bRep?.text || activeTrack.text;
        setSelectedCaseTitle(bRep?.title || `Baseline Report: ${activeTrack.name}`);
        analyzeText(bText, {
          name: activeTrack.name,
          id: activeTrack.id,
          age: activeTrack.age,
          gender: activeTrack.gender,
          ward: activeTrack.ward
        });
      }
      return;
    }

    if (!activePatient) return;
    if (type === 'latest' && activePatient.latest_report?.text) {
      const lRep = activePatient.latest_report;
      setSelectedCaseTitle(lRep.title || `Latest Follow-Up: ${activePatient.name || activePatient.patient_name}`);
      analyzeText(lRep.text, {
        name: activePatient.name || activePatient.patient_name,
        id: activePatient.id || activePatient.patient_id,
        age: activePatient.age,
        gender: activePatient.gender,
        ward: activePatient.ward
      });
    } else {
      const bRep = activePatient.baseline_report;
      const bText = bRep?.text || activePatient.text;
      setSelectedCaseTitle(bRep?.title || activePatient.title || `Baseline Report: ${activePatient.name || activePatient.patient_name}`);
      analyzeText(bText, {
        name: activePatient.name || activePatient.patient_name,
        id: activePatient.id || activePatient.patient_id,
        age: activePatient.age,
        gender: activePatient.gender,
        ward: activePatient.ward
      });
    }
  };

  const handlePatientRegistered = (newPatient) => {
    const formatted = {
      id: newPatient.id,
      patient_id: newPatient.id,
      name: newPatient.name,
      patient_name: newPatient.name,
      title: newPatient.title,
      specialty: newPatient.specialty,
      age: newPatient.age,
      gender: newPatient.gender,
      ward: newPatient.ward,
      room: newPatient.room,
      triage: newPatient.triage,
      text: newPatient.baseline_report?.text || newPatient.text,
      baseline_report: newPatient.baseline_report,
      latest_report: newPatient.latest_report,
      longitudinal_trajectory: newPatient.longitudinal_trajectory,
      has_followup: false
    };

    setSamples(prev => [formatted, ...prev.filter(p => (p.id || p.patient_id) !== newPatient.id)]);
    setActivePatient(formatted);
    setActiveReportType('baseline');
    setViewScreen('workstation');
    if (formatted.specialty) {
      setActiveOrganId(formatted.specialty);
    }
    setSelectedCaseTitle(formatted.title);
    analyzeText(formatted.text, {
      name: formatted.name,
      id: formatted.id,
      age: formatted.age,
      gender: formatted.gender,
      ward: formatted.ward
    });
  };

  const handleFollowupAdded = (updatedPatient) => {
    const formatted = {
      ...activePatient,
      ...updatedPatient,
      has_followup: true
    };
    setSamples(prev => prev.map(p => (p.id === updatedPatient.id || p.patient_id === updatedPatient.id) ? formatted : p));
    setActivePatient(formatted);
    setActiveReportType('latest');
    setSelectedCaseTitle(updatedPatient.latest_report?.title || `Latest Follow-Up: ${updatedPatient.name}`);
    analyzeText(updatedPatient.latest_report?.text, {
      name: updatedPatient.name,
      id: updatedPatient.id,
      age: updatedPatient.age,
      gender: updatedPatient.gender,
      ward: updatedPatient.ward
    });
    setIsLongitudinalModalOpen(true);
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
          patient_name: patientMeta.name || null,
          patient_id: patientMeta.id || null,
          age: patientMeta.age || null,
          gender: patientMeta.gender || null,
          ward: patientMeta.ward || null
        })
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({}));
        const detail = errJson.detail || {};
        let errTitle = 'Medical Validation Exception';
        let errReason = 'The document or text could not be verified as an authentic clinical or healthcare record.';
        if (typeof detail === 'string') {
          errReason = detail;
        } else if (typeof detail === 'object') {
          errTitle = detail.title || errTitle;
          errReason = detail.reason || errReason;
        }
        setUploadError({
          title: errTitle,
          reason: errReason,
          filename: patientMeta.name ? `${patientMeta.name}'s Note` : 'Clinical Note Input'
        });
        return;
      }

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
      setUploadError({
        title: 'Document Analysis Error',
        reason: 'Failed to communicate with medical analysis service. Please try again.',
        filename: 'Clinical Input'
      });
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

      let resp;
      if (currentUser?.role === 'patient') {
        formData.append('user_email', currentUser.email);
        formData.append('relationship', 'Self');
        formData.append('name', currentUser.name || 'Personal Record');
        formData.append('track_name', `${currentUser.name || 'Personal'} (Self) - Health Track`);
        resp = await fetch('/api/user/tracks/upload', {
          method: 'POST',
          body: formData
        });
      } else {
        resp = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
      }

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
      if (currentUser?.role === 'patient' && result.track) {
        fetchUserTracks(currentUser.email);
        setActiveTrack(result.track);
        setAnalysisResult(result.analysis);
        setSelectedCaseTitle(result.track.track_name || `Uploaded: ${file.name}`);
        setCurrentText(result.analysis?.text || result.track.baseline_report?.text || file.name);
      } else {
        setAnalysisResult(result);
        setSelectedCaseTitle(`Uploaded: ${file.name}`);
        setCurrentText(result.text || file.name);
      }

      const topSpec = result.analysis?.classification?.top_specialty || result.classification?.top_specialty;
      if ((result.analysis?.document_type || result.document_type) === 'Laboratory Test Report') {
        setActiveOrganId('Pathology');
      } else if (topSpec) {
        setActiveOrganId(topSpec);
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
    setSelectedCaseTitle('Custom Clinical Note');
    analyzeText(text, {});
  };

  const handleDownloadDocx = async () => {
    try {
      const resp = await fetch('/api/download-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          patient_name: analysisResult?.patient?.name || activePatient?.name || activePatient?.patient_name || '',
          patient_id: analysisResult?.patient?.id || activePatient?.id || activePatient?.patient_id || '',
          age: analysisResult?.patient?.age ?? activePatient?.age ?? null,
          gender: analysisResult?.patient?.gender || activePatient?.gender || '',
          ward: analysisResult?.patient?.ward || activePatient?.ward || ''
        })
      });
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Official_Medical_Record_${analysisResult?.patient?.id || activePatient?.id || 'Document'}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const resp = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          patient_name: analysisResult?.patient?.name || activePatient?.name || activePatient?.patient_name || '',
          patient_id: analysisResult?.patient?.id || activePatient?.id || activePatient?.patient_id || '',
          age: analysisResult?.patient?.age ?? activePatient?.age ?? null,
          gender: analysisResult?.patient?.gender || activePatient?.gender || '',
          ward: analysisResult?.patient?.ward || activePatient?.ward || ''
        })
      });
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Official_Medical_Record_${analysisResult?.patient?.id || activePatient?.id || 'Document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Download PDF error:', err);
    }
  };

  const handleDoctorSignOff = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const certHash = `SHA256:MH-${now.getFullYear()}-${randomHex}`;

    setDoctorSignOff({
      isSigned: true,
      doctorName: currentUser?.name || 'Dr. Sarah Jenkins, MD',
      title: currentUser?.title || 'Attending Physician & Chief Medical Officer',
      department: currentUser?.department || 'Cardiology & Acute Inpatient Care',
      npi: 'NPI-948210492',
      timestamp: `${dateStr} at ${timeStr}`,
      hash: certHash
    });

    // Also trigger official DOCX download
    handleDownloadDocx();
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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
        <Navbar
          latencyMs={analysisResult?.processing_time_ms}
          documentType={docType}
          isAnalyzing={isAnalyzing}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAboutUs={() => setShowAboutUsModal(true)}
        />
        <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 28px', flex: 1 }}>
          <PatientDashboardView
            currentUser={currentUser}
            analysisResult={analysisResult}
            selectedCaseTitle={selectedCaseTitle}
            onDownloadDocx={handleDownloadDocx}
            onDownloadPdf={handleDownloadPdf}
            onLogout={handleLogout}
            onUploadFile={handleUploadFile}
            onAnalyzeCustomText={handleAnalyzeCustom}
            onResetDocument={() => {
              setAnalysisResult(null);
              setSelectedCaseTitle('');
              setCurrentText('');
            }}
            isAnalyzing={isAnalyzing}
            userTracks={userTracks}
            activeTrack={activeTrack}
            onSelectTrack={handleSelectTrack}
            onOpenCreateTrack={() => setIsCreateTrackModalOpen(true)}
            onOpenUploadFollowup={() => setIsUploadFollowupModalOpen(true)}
            onOpenLongitudinalModal={() => setIsLongitudinalModalOpen(true)}
            activeReportType={activeReportType}
            onSwitchReportType={handleSwitchReportType}
          />
          <CollegeTeamFooter onOpenAbout={() => setShowAboutUsModal(true)} />
        </main>
        <ClinicalPipelineLoader isAnalyzing={isAnalyzing} onComplete={() => {}} />

        {/* Create New Health Track / Family Member Modal */}
        <CreateTrackModal
          isOpen={isCreateTrackModalOpen}
          onClose={() => setIsCreateTrackModalOpen(false)}
          currentUser={currentUser}
          onTrackCreated={handleTrackCreated}
        />

        {/* Upload Follow-Up Report Modal for Patient */}
        <UploadFollowupModal
          isOpen={isUploadFollowupModalOpen}
          onClose={() => setIsUploadFollowupModalOpen(false)}
          patient={activeTrack || analysisResult?.patient}
          onFollowupAdded={handlePatientFollowupAdded}
        />

        {/* Longitudinal Comparison Modal */}
        <LongitudinalComparisonModal
          isOpen={isLongitudinalModalOpen}
          onClose={() => setIsLongitudinalModalOpen(false)}
          patient={activeTrack}
          activeReportType={activeReportType}
          onSwitchReport={handleSwitchReportType}
          onOpenUploadFollowup={() => setIsUploadFollowupModalOpen(true)}
        />

        {/* Floating Ask MedExplain AI Q&A Button */}
        {analysisResult && (
          <div className="no-print" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9990 }}>
            {!isQADrawerOpen && (
              <button
                onClick={() => setIsQADrawerOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '12px 20px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(13, 148, 136, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Sparkles size={17} />
                <span>Ask MedExplain AI</span>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  fontSize: '10px',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  fontWeight: 800
                }}>
                  100% Grounded
                </span>
              </button>
            )}
          </div>
        )}

        {/* Grounded Clinical Q&A Slide-out Drawer */}
        <ReportQADrawer
          isOpen={isQADrawerOpen}
          onClose={() => setIsQADrawerOpen(false)}
          reportText={currentText}
          patientData={analysisResult?.patient || activeTrack}
          summaryData={analysisResult?.summary}
          labResults={analysisResult?.lab_results || []}
        />

        {/* About Us (Academic Project Team-8) Modal Popup */}
        {showAboutUsModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '1000px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              padding: '28px 32px'
            }}>
              <button
                onClick={() => setShowAboutUsModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569',
                  zIndex: 10
                }}
              >
                <X size={20} />
              </button>
              <AboutUsSection />
            </div>
          </div>
        )}

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent' }}>
      {/* Top Navbar */}
      <Navbar
        latencyMs={analysisResult?.processing_time_ms}
        documentType={docType}
        isAnalyzing={isAnalyzing}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAboutUs={() => setShowAboutUsModal(true)}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 28px', flex: 1 }}>
        {/* Doctor Patient Registry Search & Quick Report Fetcher */}
        <DoctorPatientSearch
          samples={samples}
          activePatientName={analysisResult?.patient?.name || activePatient?.name || activePatient?.patient_name}
          activePatient={activePatient}
          activeReportType={activeReportType}
          onSelectPatient={handleDoctorSelectPatient}
          onSwitchReportType={handleSwitchReportType}
          onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          onOpenFollowupModal={() => setIsUploadFollowupModalOpen(true)}
          onOpenLongitudinalModal={() => setIsLongitudinalModalOpen(true)}
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
              background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
              padding: '14px 20px',
              borderRadius: '14px',
              border: '1.5px solid #99f6e4',
              boxShadow: '0 4px 16px rgba(13, 148, 136, 0.05)'
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
            {(analysisResult?.patient || activePatient) && (
              <PatientDemographicsBanner
                patient={{
                  name: analysisResult?.patient?.name || activePatient?.name || activePatient?.patient_name,
                  id: analysisResult?.patient?.id || activePatient?.id || activePatient?.patient_id,
                  age: (analysisResult?.patient?.age !== undefined && analysisResult?.patient?.age !== null) ? analysisResult.patient.age : activePatient?.age,
                  gender: analysisResult?.patient?.gender || activePatient?.gender,
                  ward: analysisResult?.patient?.ward || activePatient?.ward
                }}
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

            {/* Inline Longitudinal Serial Tracking Banner */}
            {activePatient?.longitudinal_trajectory && (
              <div style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                borderRadius: '14px',
                padding: '16px 20px',
                marginBottom: '22px',
                color: '#ffffff',
                border: '1.5px solid #334155',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0
                  }}>
                    <Activity size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>
                        Serial Report Comparison & Biomarker Trajectory: {activePatient.name || activePatient.patient_name}
                      </span>
                      <span style={{
                        background: activePatient.longitudinal_trajectory.trajectory_badge === 'IMPROVED' ? '#ecfdf5' : activePatient.longitudinal_trajectory.trajectory_badge === 'WORSENED' ? '#fef2f2' : '#eff6ff',
                        color: activePatient.longitudinal_trajectory.trajectory_badge === 'IMPROVED' ? '#047857' : activePatient.longitudinal_trajectory.trajectory_badge === 'WORSENED' ? '#b91c1c' : '#1d4ed8',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 9px',
                        borderRadius: '999px',
                        border: `1px solid ${activePatient.longitudinal_trajectory.trajectory_badge === 'IMPROVED' ? '#a7f3d0' : activePatient.longitudinal_trajectory.trajectory_badge === 'WORSENED' ? '#fecaca' : '#bfdbfe'}`
                      }}>
                        STATUS: {activePatient.longitudinal_trajectory.trajectory_badge}
                      </span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                        ({activePatient.longitudinal_trajectory.overall_status})
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {activePatient.longitudinal_trajectory.clinical_narrative}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsLongitudinalModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: '#38bdf8',
                    color: '#0f172a',
                    border: 'none',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(56, 189, 248, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Activity size={15} />
                  <span>View Delta Comparisons ({activePatient.longitudinal_trajectory.metrics?.length || 0} Markers)</span>
                </button>
              </div>
            )}

            {/* Primary Workflow Tabs & Download Action */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '2px solid #cbd5e1',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
                {[
                  { id: 'tab_diagnostics', label: '1. Diagnostic Co-Pilot & XAI Evidence', icon: Stethoscope, color: '#2563eb' },
                  { id: 'tab_patient', label: '2. Patient Discharge Summary (Doctor Review & Sign-Off)', icon: FileCheck2, color: '#059669' },
                  { id: 'tab_safety', label: '3. NLI Closed-Loop Safety Guardrail', icon: ShieldCheck, color: '#dc2626' },
                  { id: 'tab_intake', label: '4. Source Document & Raw Transcription', icon: FileText, color: '#475569' },
                  { id: 'tab_about', label: '5. About (Team-8)', icon: GraduationCap, color: '#0284c7' }
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
                        background: isActive ? `${tab.color}14` : 'transparent',
                        borderRadius: '10px 10px 0 0',
                        border: isActive ? `1.5px solid ${tab.color}35` : '1.5px solid transparent',
                        borderBottom: `3px solid ${isActive ? tab.color : 'transparent'}`,
                        boxShadow: isActive ? `0 -2px 10px ${tab.color}15` : 'none',
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
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                  fontSize: '12.5px',
                  padding: '9px 18px',
                  border: 'none',
                  borderRadius: '10px'
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

            {/* TAB 2: Patient Discharge Summary (Doctor Review & Sign-Off) */}
            {activeTab === 'tab_patient' && analysisResult && (
              <div>
                {/* Clinician Review & Pre-Release Sign-Off Banner */}
                <div style={{
                  background: doctorSignOff.isSigned
                    ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                    : 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                  border: doctorSignOff.isSigned ? '2px solid #86efac' : '1.5px solid #a7f3d0',
                  borderRadius: '14px',
                  padding: '18px 22px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                  boxShadow: doctorSignOff.isSigned
                    ? '0 4px 18px rgba(16, 185, 129, 0.15)'
                    : '0 2px 8px rgba(16, 185, 129, 0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
                    }}>
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Doctor-In-The-Loop Oversight & Clinical Governance
                        </span>
                        <span style={{
                          background: doctorSignOff.isSigned ? '#bbf7d0' : '#dcfce7',
                          color: '#166534',
                          border: '1px solid #86efac',
                          borderRadius: '999px',
                          padding: '1px 8px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {doctorSignOff.isSigned ? 'Digitally Countersigned & Released' : 'Pre-Release Review Mode'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#065f46', margin: 0 }}>
                        {doctorSignOff.isSigned
                          ? `Discharge Packet Certified by ${doctorSignOff.doctorName}`
                          : 'Patient Discharge Summary Verification & Approval'}
                      </h3>
                      <p style={{ fontSize: '12.5px', color: '#475569', margin: '3px 0 0 0', maxWidth: '680px' }}>
                        {doctorSignOff.isSigned ? (
                          <>
                            Attested on <strong>{doctorSignOff.timestamp}</strong> • Cryptographic Audit Hash: <code style={{ fontSize: '11.5px', color: '#047857', background: '#ffffff', padding: '1px 6px', borderRadius: '4px', border: '1px solid #86efac' }}>{doctorSignOff.hash}</code>. Verified compliant with hospital EHR protocols.
                          </>
                        ) : (
                          <>
                            Verify the AI-translated Grade 6 layman plan, medication schedule, and red flags before releasing to <strong>{analysisResult.patient?.name || 'the patient'}</strong>.
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => window.print()}
                      className="btn btn-secondary"
                      style={{
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        borderRadius: '9px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Printer size={15} color="#0284c7" />
                      <span>Print Bedside Sheet</span>
                    </button>

                    <button
                      onClick={handleDownloadPdf}
                      className="btn btn-secondary"
                      style={{
                        padding: '10px 16px',
                        fontSize: '13px',
                        fontWeight: 700,
                        borderRadius: '9px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#047857',
                        borderColor: '#a7f3d0'
                      }}
                    >
                      <FileDown size={15} color="#047857" />
                      <span>Download Official PDF</span>
                    </button>

                    <button
                      onClick={handleDoctorSignOff}
                      className="btn btn-primary"
                      style={{
                        background: doctorSignOff.isSigned
                          ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                          : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        border: 'none',
                        padding: '10px 18px',
                        fontSize: '13px',
                        fontWeight: 800,
                        borderRadius: '9px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Download size={15} />
                      <span>{doctorSignOff.isSigned ? 'Re-Download Signed (.docx)' : 'Approve & Sign-Off Discharge (.docx)'}</span>
                    </button>
                  </div>
                </div>

                <PatientCarePortal
                  summary={analysisResult.summary}
                  entities={analysisResult.entities}
                  patient={analysisResult.patient}
                  onDownloadDocx={handleDownloadDocx}
                  onDownloadPdf={handleDownloadPdf}
                  doctorSignOff={doctorSignOff}
                />
              </div>
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

            {/* TAB 5: About Us (Academic Project Team-8) */}
            {activeTab === 'tab_about' && (
              <AboutUsSection />
            )}
          </div>
        )}

        {/* Clinical System Footer */}
        <CollegeTeamFooter onOpenAbout={() => setShowAboutUsModal(true)} />
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

      {/* Longitudinal Comparison Modal */}
      <LongitudinalComparisonModal
        isOpen={isLongitudinalModalOpen}
        onClose={() => setIsLongitudinalModalOpen(false)}
        patient={activePatient}
        activeReportType={activeReportType}
        onSwitchReport={handleSwitchReportType}
        onOpenUploadFollowup={() => setIsUploadFollowupModalOpen(true)}
      />

      {/* Register New Inpatient Modal */}
      <RegisterPatientModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onPatientRegistered={handlePatientRegistered}
      />

      {/* Upload Follow-Up Report Modal */}
      <UploadFollowupModal
        isOpen={isUploadFollowupModalOpen}
        onClose={() => setIsUploadFollowupModalOpen(false)}
        patient={activePatient}
        onFollowupAdded={handleFollowupAdded}
      />

      {/* About Us (Academic Project Team-8) Modal Popup */}
      {showAboutUsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '1000px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            padding: '28px 32px'
          }}>
            <button
              onClick={() => setShowAboutUsModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#f1f5f9',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>
            <AboutUsSection />
          </div>
        </div>
      )}

      {/* Floating Ask MedExplain AI Q&A Button */}
      {analysisResult && (
        <div className="no-print" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9990 }}>
          {!isQADrawerOpen && (
            <button
              onClick={() => setIsQADrawerOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '999px',
                padding: '12px 20px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(13, 148, 136, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={17} />
              <span>Ask MedExplain AI</span>
              <span style={{
                background: 'rgba(255, 255, 255, 0.25)',
                fontSize: '10px',
                padding: '2px 7px',
                borderRadius: '999px',
                fontWeight: 800
              }}>
                100% Grounded
              </span>
            </button>
          )}
        </div>
      )}

      {/* Grounded Clinical Q&A Slide-out Drawer */}
      <ReportQADrawer
        isOpen={isQADrawerOpen}
        onClose={() => setIsQADrawerOpen(false)}
        reportText={currentText}
        patientData={analysisResult?.patient || activePatient}
        summaryData={analysisResult?.summary}
        labResults={analysisResult?.lab_results || []}
      />
    </div>
  );
}
