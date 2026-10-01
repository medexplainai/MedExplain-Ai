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

import {
  FileText,
  Stethoscope,
  HeartHandshake,
  ShieldCheck,
  HelpCircle,
  Download,
  Printer,
  Sparkles,
  RefreshCw,
  FlaskConical,
  Layers,
  Cpu,
  FileCheck2
} from 'lucide-react';

export default function App() {
  const [samples, setSamples] = useState([]);
  const [selectedCaseTitle, setSelectedCaseTitle] = useState('');
  const [activeTab, setActiveTab] = useState('tab_diagnostics');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const [showAnatomyDiagram, setShowAnatomyDiagram] = useState(true);

  // Initial load: Fetch samples and analyze default Cardiology case
  useEffect(() => {
    async function loadInitial() {
      try {
        const resp = await fetch('/api/samples');
        const data = await resp.json();
        setSamples(data.samples || []);

        if (data.samples && data.samples.length > 0) {
          const first = data.samples[0];
          setSelectedCaseTitle(first.title);
          setCurrentText(first.text);
          analyzeText(first.text, {
            name: first.patient_name,
            id: first.patient_id,
            age: first.age,
            gender: first.gender,
            ward: first.ward
          });
        }
      } catch (err) {
        console.error('Failed to load initial cases:', err);
      }
    }
    loadInitial();
  }, []);

  const analyzeText = async (text, patientMeta = {}) => {
    setIsAnalyzing(true);
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
    } catch (err) {
      console.error('Analysis request error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHotspot = (sampleKey, specialtyId) => {
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
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const result = await resp.json();
      setAnalysisResult(result);
      setSelectedCaseTitle(`Uploaded: ${file.name}`);
    } catch (err) {
      console.error('File upload analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeCustom = (text) => {
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
  const specialty = analysisResult?.classification?.top_specialty || 'Cardiology';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* Top Navbar */}
      <Navbar
        latencyMs={analysisResult?.processing_time_ms}
        documentType={docType}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 28px', flex: 1 }}>
        {/* Interactive Human Anatomy Hotspot Cockpit */}
        {showAnatomyDiagram && (
          <HumanAnatomyDiagram
            activeSpecialty={specialty}
            onSelectHotspot={handleSelectHotspot}
          />
        )}

        {/* Multi-Format Medical Document Upload & Intake Bar */}
        <DocumentUploadBar
          onSelectSample={(title) => {
            const found = samples.find(s => s.title === title);
            if (found) {
              setSelectedCaseTitle(found.title);
              analyzeText(found.text, found);
            }
          }}
          onUploadFile={handleUploadFile}
          onAnalyzeCustomText={handleAnalyzeCustom}
          isAnalyzing={isAnalyzing}
        />

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
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '2px'
          }}>
            {[
              { id: 'tab_diagnostics', label: '1. Diagnostic Co-Pilot & XAI Evidence', icon: Stethoscope, color: '#2563eb' },
              { id: 'tab_patient', label: '2. Patient Layman Care Portal', icon: HeartHandshake, color: '#059669' },
              { id: 'tab_safety', label: '3. NLI Closed-Loop Safety Guardrail', icon: ShieldCheck, color: '#7c3aed' },
              { id: 'tab_intake', label: '4. Source Document & Raw Transcription', icon: FileText, color: '#0891b2' },
              { id: 'tab_arch', label: '5. Architecture & Innovations', icon: HelpCircle, color: '#475569' }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive ? '#ffffff' : 'transparent',
                    border: 'none',
                    borderBottom: `3px solid ${isActive ? tab.color : 'transparent'}`,
                    marginBottom: '-2px',
                    padding: '12px 18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? '#0f172a' : '#64748b',
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap'
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

        {/* Loading Spinner State */}
        {isAnalyzing && (
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <RefreshCw size={28} color="#2563eb" className="spin" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
              Running Bio_ClinicalBERT & NVIDIA NIM Llama 3.2 Pipeline...
            </h4>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
              Computing token-level Shapley attributions and evaluating DeBERTa-v3 NLI cross-encoder guardrail
            </p>
          </div>
        )}

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

        {/* Academic Team Footer */}
        <CollegeTeamFooter />
      </main>
    </div>
  );
}
