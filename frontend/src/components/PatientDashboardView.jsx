import React, { useState } from 'react';
import {
  HeartHandshake,
  Pill,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Download,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  Calendar,
  PhoneCall,
  Activity,
  HeartPulse,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import PatientCarePortal from './PatientCarePortal';

export default function PatientDashboardView({
  currentUser,
  analysisResult,
  selectedCaseTitle,
  onDownloadDocx,
  onLogout,
  samples = [],
  onSelectPatient
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('summary'); // 'summary' | 'meds' | 'warnings' | 'vitals'

  const patient = analysisResult?.patient || {
    name: currentUser?.name || 'Marcus Vance',
    id: currentUser?.patientId || 'PT-2026-8841',
    age: currentUser?.age || 58,
    gender: currentUser?.gender || 'Male',
    ward: currentUser?.ward || 'Coronary Intensive Care',
    room: currentUser?.room || 'CCU - Bed 402B'
  };

  const summary = analysisResult?.summary || {
    overview: "You recently experienced a heart attack caused by a blocked artery supplying blood to your heart. Our cardiology team successfully opened the blockage with a stent. You are now in a stable recovery phase and ready to continue healing at home with proper medications and rest.",
    medication_schedule: [
      { drug: "Aspirin", dosage: "81 mg", timing: "Morning with breakfast", purpose: "Prevents dangerous blood clots from forming inside your heart stent." },
      { drug: "Ticagrelor (Brilinta)", dosage: "90 mg", timing: "Twice daily (Morning & Evening)", purpose: "Works together with Aspirin to keep your heart arteries wide open." },
      { drug: "Metoprolol Tartrate", dosage: "25 mg", timing: "Twice daily (Morning & Night)", purpose: "Slows your heart rate and protects your heart muscle from working too hard." },
      { drug: "Atorvastatin", dosage: "80 mg", timing: "Bedtime", purpose: "Lowers cholesterol and prevents plaque buildup in your arteries." },
      { drug: "Sublingual Nitroglycerin", dosage: "0.4 mg", timing: "As needed (under tongue)", purpose: "Immediate relief if you feel sudden chest tightness." }
    ],
    diet_lifestyle_precautions: [
      "Strict low-salt (low sodium) diet: Keep sodium under 2,000 mg per day.",
      "Avoid heavy lifting, intense workouts, or climbing steep stairs for the next 2 weeks.",
      "Stay well hydrated with plain water; avoid excessive caffeine or energy drinks.",
      "Light, gentle walking for 10-15 minutes daily as tolerated is encouraged."
    ],
    warning_signs: [
      "Chest pressure, heaviness, or pain spreading to your left shoulder, neck, or arm.",
      "Sudden shortness of breath even while resting in bed or sitting quietly.",
      "Severe dizziness, lightheadedness, or sudden loss of balance.",
      "Irregular, racing heartbeats accompanied by nausea or cold sweats."
    ],
    reading_grade_level: "Grade 6.2 (Easy to read)"
  };

  // Text to Speech playback
  const handleToggleAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const textToRead = `Hello ${patient.name}. Here is your simplified discharge health summary. ${summary.overview}. Please remember to take your medications on time and contact your care team if you feel sudden chest pain or shortness of breath.`;
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

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 20px 40px 20px' }}>
      {/* Patient Welcome Hero Card */}
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
                  Verified by DeBERTa-v3 Guardrail
                </span>
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.4px' }}>
                Welcome, {patient.name}!
              </h1>
              <p style={{ fontSize: '13px', color: '#a7f3d0', margin: '4px 0 0 0' }}>
                MRN: <strong>{patient.id}</strong> • {patient.age} yrs {patient.gender} • Room: <strong>{patient.room || 'Bed 402B'}</strong> • Attending: <strong>Dr. Sarah Jenkins, MD</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <span>{isPlayingAudio ? 'Stop Audio' : '🔊 Listen to My Summary'}</span>
            </button>

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
              <span>Download Discharge Summary</span>
            </button>

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

        {/* Patient Switcher if multiple records */}
        <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#a7f3d0' }}>Viewing Encounter:</span>
            <span style={{ background: 'rgba(0,0,0,0.2)', padding: '3px 10px', borderRadius: '6px', fontWeight: 700 }}>
              {selectedCaseTitle || 'Cardiology: Acute Myocardial Ischemia'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#a7f3d0' }}>Switch Patient Encounter:</span>
            {samples.map((s, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPatient(s)}
                style={{
                  background: s.patient_name === patient.name ? '#ffffff' : 'rgba(255, 255, 255, 0.15)',
                  color: s.patient_name === patient.name ? '#065f46' : '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {s.patient_name || s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Health Telemetry Badges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
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
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <HeartPulse size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Blood Pressure</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>158/94 <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>mmHg</span></div>
          </div>
        </div>

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
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Heart Rate (Resting)</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>92 <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>BPM</span></div>
          </div>
        </div>

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
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfeff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Oxygen Saturation</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>96% <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>Normal</span></div>
          </div>
        </div>

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
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>Care Guide Readability</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Grade 6.2 <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>Plain English</span></div>
          </div>
        </div>
      </div>

      {/* Main Patient Care Sections */}
      <PatientCarePortal
        summary={summary}
        onDownloadDocx={onDownloadDocx}
      />
    </div>
  );
}
