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
  AlertCircle,
  UserPlus,
  LogIn,
  Building2,
  Calendar,
  Users
} from 'lucide-react';

export default function AuthScreen({ onLogin }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRoleTab, setSelectedRoleTab] = useState('doctor'); // 'doctor' | 'patient'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (authMode === 'register') {
      if (!name.trim() || name.trim().length < 2) {
        setError('Please enter your full legal name.');
        return;
      }
      if (cleanPass !== confirmPassword.trim()) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
      if (cleanPass.length < 4) {
        setError('Password must be at least 4 characters long.');
        return;
      }

      setIsLoading(true);
      try {
        const resp = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: cleanEmail,
            password: cleanPass,
            role: selectedRoleTab,
            department: selectedRoleTab === 'doctor' ? (department.trim() || 'Cardiology & Intensive Care') : null,
            age: selectedRoleTab === 'patient' && age ? parseInt(age, 10) : null,
            gender: selectedRoleTab === 'patient' ? gender : null
          })
        });

        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data.detail || data.message || 'Registration failed. Please try again.');
        }

        setSuccessMsg(`Account created for ${data.user.name}! Logging you in...`);
        localStorage.setItem('metrohealth_auth_user', JSON.stringify(data.user));
        setTimeout(() => {
          onLogin(data.user);
        }, 600);
      } catch (err) {
        setError(err.message || 'Registration error occurred.');
      } finally {
        setIsLoading(false);
      }

    } else {
      // Login mode
      setIsLoading(true);
      try {
        const resp = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password: cleanPass
          })
        });

        const data = await resp.json();
        if (!resp.ok) {
          // Client-side fallback for built-in demo offline accounts if server has network issue
          if (cleanEmail === 'doctor@gmail.com' && cleanPass === 'doctor') {
            const fallbackDoc = {
              role: 'doctor',
              email: 'doctor@gmail.com',
              name: 'Dr. Sarah Jenkins, MD',
              title: 'Chief Medical Officer & Attending Physician',
              department: 'Cardiology & Intensive Care'
            };
            localStorage.setItem('metrohealth_auth_user', JSON.stringify(fallbackDoc));
            onLogin(fallbackDoc);
            return;
          } else if (cleanEmail === 'patient@gmail.com' && cleanPass === 'patient') {
            const fallbackPat = {
              role: 'patient',
              email: 'patient@gmail.com',
              name: 'Marcus Vance',
              age: 58,
              gender: 'Male'
            };
            localStorage.setItem('metrohealth_auth_user', JSON.stringify(fallbackPat));
            onLogin(fallbackPat);
            return;
          }
          throw new Error(data.detail || 'Invalid email or password.');
        }

        localStorage.setItem('metrohealth_auth_user', JSON.stringify(data.user));
        onLogin(data.user);
      } catch (err) {
        // Fallback for built-in demo credentials
        if (cleanEmail === 'doctor@gmail.com' && cleanPass === 'doctor') {
          const fallbackDoc = {
            role: 'doctor',
            email: 'doctor@gmail.com',
            name: 'Dr. Sarah Jenkins, MD',
            title: 'Chief Medical Officer & Attending Physician',
            department: 'Cardiology & Intensive Care'
          };
          localStorage.setItem('metrohealth_auth_user', JSON.stringify(fallbackDoc));
          onLogin(fallbackDoc);
        } else if (cleanEmail === 'patient@gmail.com' && cleanPass === 'patient') {
          const fallbackPat = {
            role: 'patient',
            email: 'patient@gmail.com',
            name: 'Marcus Vance',
            age: 58,
            gender: 'Male'
          };
          localStorage.setItem('metrohealth_auth_user', JSON.stringify(fallbackPat));
          onLogin(fallbackPat);
        } else {
          setError(err.message || 'Invalid credentials.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuickFill = (role) => {
    setSelectedRoleTab(role);
    setAuthMode('login');
    if (role === 'doctor') {
      setEmail('doctor@gmail.com');
      setPassword('doctor');
    } else {
      setEmail('patient@gmail.com');
      setPassword('patient');
    }
    setError('');
    setSuccessMsg('');
  };

  const isDoctor = selectedRoleTab === 'doctor';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #1e3a8a 0%, #0f172a 60%, #020617 100%)',
      padding: '32px 16px',
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
        maxWidth: '540px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1.5px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
        padding: '36px 32px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)'
          }}>
            <Stethoscope size={30} color="#ffffff" strokeWidth={2.5} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '999px', padding: '3px 12px', marginBottom: '8px' }}>
            <Sparkles size={13} color="#2563eb" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#1d4ed8', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              MetroHealth Enterprise Clinical AI
            </span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '4px 0 6px 0', letterSpacing: '-0.5px' }}>
            {authMode === 'login' ? 'Secure Clinical Gateway' : 'Create Clinical Account'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
            {authMode === 'login'
              ? 'Sign in to access physician diagnostics or your verified patient care portal.'
              : 'Register as a doctor or patient to access personalized clinical records.'}
          </p>
        </div>

        {/* Auth Mode Toggle: Sign In vs Register */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#f1f5f9',
          borderRadius: '12px',
          padding: '4px',
          gap: '4px',
          marginBottom: '16px'
        }}>
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
            style={{
              padding: '9px 14px',
              borderRadius: '9px',
              border: 'none',
              background: authMode === 'login' ? '#ffffff' : 'transparent',
              color: authMode === 'login' ? '#0f172a' : '#64748b',
              fontWeight: authMode === 'login' ? 800 : 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: authMode === 'login' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <LogIn size={15} color={authMode === 'login' ? '#2563eb' : '#64748b'} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('register'); setError(''); setSuccessMsg(''); }}
            style={{
              padding: '9px 14px',
              borderRadius: '9px',
              border: 'none',
              background: authMode === 'register' ? '#ffffff' : 'transparent',
              color: authMode === 'register' ? '#0f172a' : '#64748b',
              fontWeight: authMode === 'register' ? 800 : 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: authMode === 'register' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <UserPlus size={15} color={authMode === 'register' ? '#059669' : '#64748b'} />
            <span>New User Registration</span>
          </button>
        </div>

        {/* Role Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '4px',
          gap: '4px',
          marginBottom: '18px'
        }}>
          <button
            type="button"
            onClick={() => setSelectedRoleTab('doctor')}
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              border: 'none',
              background: isDoctor ? '#eff6ff' : 'transparent',
              color: isDoctor ? '#1e40af' : '#64748b',
              fontWeight: isDoctor ? 800 : 600,
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              cursor: 'pointer',
              boxShadow: isDoctor ? '0 1px 4px rgba(37, 99, 235, 0.15)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Stethoscope size={15} color={isDoctor ? '#2563eb' : '#64748b'} />
            <span>Doctor / Clinician</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRoleTab('patient')}
            style={{
              padding: '9px 12px',
              borderRadius: '8px',
              border: 'none',
              background: !isDoctor ? '#ecfdf5' : 'transparent',
              color: !isDoctor ? '#047857' : '#64748b',
              fontWeight: !isDoctor ? 800 : 600,
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              cursor: 'pointer',
              boxShadow: !isDoctor ? '0 1px 4px rgba(16, 185, 129, 0.15)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <HeartHandshake size={15} color={!isDoctor ? '#10b981' : '#64748b'} />
            <span>Patient</span>
          </button>
        </div>

        {/* Demo Quick Fill Helper Banner (Only visible in Sign In mode) */}
        {authMode === 'login' && (
          <div style={{
            background: isDoctor ? '#eff6ff' : '#f0fdf4',
            border: `1.5px solid ${isDoctor ? '#bfdbfe' : '#bbf7d0'}`,
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px'
          }}>
            <div>
              <div style={{ fontWeight: 800, color: isDoctor ? '#1e40af' : '#166534', marginBottom: '2px' }}>
                {isDoctor ? 'Clinician Seed Account' : 'Patient Seed Account'}:
              </div>
              <div style={{ color: '#475569', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
                User: <strong>{isDoctor ? 'doctor@gmail.com' : 'patient@gmail.com'}</strong> • Pass: <strong>{isDoctor ? 'doctor' : 'patient'}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleQuickFill(selectedRoleTab)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: `1px solid ${isDoctor ? '#93c5fd' : '#86efac'}`,
                background: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                color: isDoctor ? '#2563eb' : '#16a34a',
                cursor: 'pointer'
              }}
            >
              Fill Demo
            </button>
          </div>
        )}

        {/* Feedback Messages */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={16} color="#059669" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Register Mode Extra Fields */}
          {authMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isDoctor ? "e.g. Dr. Arthur Conan, MD" : "e.g. Marcus Vance"}
                style={{
                  width: '100%',
                  padding: '10px 14px',
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
          )}

          {/* Email Address */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              Email Address
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
                placeholder={isDoctor ? 'doctor@hospital.org' : 'patient@gmail.com'}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
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

          {/* Registration Role Specific Fields */}
          {authMode === 'register' && isDoctor && (
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                Department / Specialty
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Building2 size={16} />
                </div>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Cardiology & Acute Inpatient Care"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
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
          )}

          {authMode === 'register' && !isDoctor && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="125"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 58"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
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

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13.5px',
                    color: '#0f172a',
                    background: '#ffffff',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
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
                  padding: '10px 40px 10px 38px',
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

          {/* Confirm Password (Register mode only) */}
          {authMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password..."
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
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
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '6px',
              padding: '12px 20px',
              borderRadius: '10px',
              border: 'none',
              background: isDoctor
                ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              boxShadow: isDoctor
                ? '0 4px 14px rgba(37, 99, 235, 0.4)'
                : '0 4px 14px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.15s ease'
            }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : authMode === 'login' ? (
              <>
                <span>Sign In to {isDoctor ? 'Doctor Workstation' : 'Patient Portal'}</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <span>Complete Registration & Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Security / System Badges Footer */}
        <div style={{ marginTop: '22px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', fontSize: '11px', color: '#64748b' }}>
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
