import React, { useState } from 'react';
import {
  Stethoscope,
  HeartHandshake,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export default function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [selectedRoleTab, setSelectedRoleTab] = useState('doctor'); // 'doctor' | 'patient'

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanEmail === 'doctor@gmail.com' && cleanPass === 'doctor') {
      onLogin({
        role: 'doctor',
        email: 'doctor@gmail.com',
        name: 'Dr. Sarah Jenkins, MD',
        title: 'Chief Medical Officer & Attending Physician',
        department: 'Cardiology & Intensive Care'
      });
    } else if (cleanEmail === 'patient@gmail.com' && cleanPass === 'patient') {
      onLogin({
        role: 'patient',
        email: 'patient@gmail.com',
        name: 'Marcus Vance',
        patientId: 'PT-2026-8841',
        age: 58,
        gender: 'Male',
        ward: 'Coronary Intensive Care',
        room: 'CCU - Bed 402B'
      });
    } else {
      setError('Invalid credentials. For Doctor: doctor@gmail.com / doctor. For Patient: patient@gmail.com / patient.');
    }
  };

  const handleQuickFill = (role) => {
    setSelectedRoleTab(role);
    if (role === 'doctor') {
      setEmail('doctor@gmail.com');
      setPassword('doctor');
    } else {
      setEmail('patient@gmail.com');
      setPassword('patient');
    }
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e3a8a 0%, #0f172a 60%, #020617 100%)',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative ambient background glow circles */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '-100px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-120px',
        right: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1.5px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
        padding: '36px 32px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)'
          }}>
            <Stethoscope size={32} color="#ffffff" strokeWidth={2.5} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '999px', padding: '3px 12px', marginBottom: '8px' }}>
            <Sparkles size={13} color="#2563eb" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#1d4ed8', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              MetroHealth Enterprise Clinical AI
            </span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '4px 0 6px 0', letterSpacing: '-0.5px' }}>
            Secure Clinical Gateway
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
            Sign in with your role-based credentials to access clinical diagnostics or your patient care dashboard.
          </p>
        </div>

        {/* Role Quick Selector Segment */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#f1f5f9',
          borderRadius: '12px',
          padding: '4px',
          gap: '4px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => handleQuickFill('doctor')}
            style={{
              padding: '10px 14px',
              borderRadius: '9px',
              border: 'none',
              background: selectedRoleTab === 'doctor' ? '#ffffff' : 'transparent',
              color: selectedRoleTab === 'doctor' ? '#1e40af' : '#64748b',
              fontWeight: selectedRoleTab === 'doctor' ? 800 : 600,
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: selectedRoleTab === 'doctor' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Stethoscope size={15} color={selectedRoleTab === 'doctor' ? '#2563eb' : '#64748b'} />
            <span>Doctor Login</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('patient')}
            style={{
              padding: '10px 14px',
              borderRadius: '9px',
              border: 'none',
              background: selectedRoleTab === 'patient' ? '#ffffff' : 'transparent',
              color: selectedRoleTab === 'patient' ? '#047857' : '#64748b',
              fontWeight: selectedRoleTab === 'patient' ? 800 : 600,
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: selectedRoleTab === 'patient' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <HeartHandshake size={15} color={selectedRoleTab === 'patient' ? '#10b981' : '#64748b'} />
            <span>Patient Login</span>
          </button>
        </div>

        {/* Demo Credentials Alert Banner */}
        <div style={{
          background: selectedRoleTab === 'doctor' ? '#eff6ff' : '#f0fdf4',
          border: `1.5px solid ${selectedRoleTab === 'doctor' ? '#bfdbfe' : '#bbf7d0'}`,
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px'
        }}>
          <div>
            <div style={{ fontWeight: 800, color: selectedRoleTab === 'doctor' ? '#1e40af' : '#166534', marginBottom: '2px' }}>
              {selectedRoleTab === 'doctor' ? '🩺 Clinician Credentials' : '👤 Patient Credentials'}:
            </div>
            <div style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace', fontSize: '11.5px' }}>
              Username: <strong>{selectedRoleTab === 'doctor' ? 'doctor@gmail.com' : 'patient@gmail.com'}</strong> • Password: <strong>{selectedRoleTab === 'doctor' ? 'doctor' : 'patient'}</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleQuickFill(selectedRoleTab)}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              border: `1px solid ${selectedRoleTab === 'doctor' ? '#93c5fd' : '#86efac'}`,
              background: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              color: selectedRoleTab === 'doctor' ? '#2563eb' : '#16a34a',
              cursor: 'pointer'
            }}
          >
            Fill Credentials
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '18px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Email Address / Username
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRoleTab === 'doctor' ? 'doctor@gmail.com' : 'patient@gmail.com'}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 38px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13.5px',
                  color: '#0f172a',
                  background: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 38px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '13.5px',
                  color: '#0f172a',
                  background: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '8px',
              padding: '12px 20px',
              borderRadius: '10px',
              border: 'none',
              background: selectedRoleTab === 'doctor'
                ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: selectedRoleTab === 'doctor'
                ? '0 4px 14px rgba(37, 99, 235, 0.4)'
                : '0 4px 14px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>Sign In to {selectedRoleTab === 'doctor' ? 'Doctor Workstation' : 'Patient Portal'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Security / System Badges Footer */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', fontSize: '11px', color: '#64748b' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={13} color="#10b981" /> DeBERTa-v3 Guardrail
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} color="#2563eb" /> Bio_ClinicalBERT & SHAP
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserCheck size={13} color="#7c3aed" /> Role-Based Access
          </span>
        </div>
      </div>
    </div>
  );
}
