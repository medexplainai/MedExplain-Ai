import React from 'react';
import {
  ShieldCheck,
  Activity,
  Cpu,
  Stethoscope,
  FileText,
  CheckCircle2,
  User,
  LogOut,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

export default function Navbar({ latencyMs, documentType, isAnalyzing, currentUser, onLogout }) {
  const isDoctor = currentUser?.role === 'doctor';
  const isPatient = currentUser?.role === 'patient';

  return (
    <header style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#ffffff',
      borderBottom: '1px solid #334155',
      padding: '12px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.25)',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: isPatient
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isPatient
            ? '0 2px 8px rgba(16, 185, 129, 0.4)'
            : '0 2px 8px rgba(37, 99, 235, 0.4)'
        }}>
          {isPatient ? (
            <HeartHandshake size={22} color="#ffffff" strokeWidth={2.4} />
          ) : (
            <Stethoscope size={22} color="#ffffff" strokeWidth={2.4} />
          )}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.3px', margin: 0, color: '#ffffff' }}>
              METROHEALTH CLINICAL AI
            </h1>
            <span style={{
              background: isPatient ? 'rgba(16, 185, 129, 0.25)' : 'rgba(37, 99, 235, 0.3)',
              color: isPatient ? '#6ee7b7' : '#93c5fd',
              border: `1px solid ${isPatient ? 'rgba(110, 231, 183, 0.3)' : 'rgba(147, 197, 253, 0.3)'}`,
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              textTransform: 'uppercase'
            }}>
              {isPatient ? 'Patient Portal' : 'Doctor Workstation'}
            </span>
          </div>
          <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
            Explainable Decision Support • Patient Summarization • Closed-Loop NLI Guardrails
          </p>
        </div>
      </div>

      {/* Right Actions & Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Document Type Badge */}
        {documentType && !isPatient && (
          <div style={{
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            borderRadius: '8px',
            padding: '5px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#67e8f9',
            fontWeight: 600
          }}>
            <FileText size={14} />
            <span>{documentType}</span>
          </div>
        )}

        {/* Engine Status */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '8px',
          padding: '5px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: '12px',
          color: '#6ee7b7',
          fontWeight: 600
        }}>
          <span className="pulse-dot" style={{ width: '7px', height: '7px' }}></span>
          <Cpu size={14} />
          <span>NVIDIA NIM Accelerated (Llama 3.2)</span>
        </div>

        {/* NLI Guardrail Status */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: '8px',
          padding: '5px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: '#c7d2fe',
          fontWeight: 600
        }}>
          <ShieldCheck size={14} />
          <span>DeBERTa NLI Active</span>
        </div>

        {/* Latency Meter */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          padding: '5px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: '#cbd5e1',
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          <Activity size={13} color="#38bdf8" />
          <span>{isAnalyzing ? 'Processing...' : `${latencyMs || 42} ms`}</span>
        </div>

        {/* Logged in User Profile & Sign Out Button */}
        {currentUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '4px 10px 4px 12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: isDoctor ? '#3b82f6' : '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800
              }}>
                {isDoctor ? 'DR' : 'PT'}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '10.5px', color: isDoctor ? '#93c5fd' : '#86efac', textTransform: 'capitalize' }}>
                  {currentUser.role === 'doctor' ? '🩺 Attending Doctor' : '👤 Inpatient'}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              }}
            >
              <LogOut size={12} />
              <span>Exit</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
