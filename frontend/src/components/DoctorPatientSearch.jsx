import React, { useState, useMemo } from 'react';
import {
  Search,
  User,
  FileText,
  Activity,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  UserCheck,
  Stethoscope,
  X
} from 'lucide-react';

export default function DoctorPatientSearch({
  samples = [],
  activePatientName,
  onSelectPatient,
  isAnalyzing
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter patients based on query
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return samples;
    const q = searchQuery.toLowerCase().trim();
    return samples.filter(s =>
      (s.patient_name && s.patient_name.toLowerCase().includes(q)) ||
      (s.patient_id && s.patient_id.toLowerCase().includes(q)) ||
      (s.specialty && s.specialty.toLowerCase().includes(q)) ||
      (s.title && s.title.toLowerCase().includes(q))
    );
  }, [samples, searchQuery]);

  const handlePatientClick = (patient) => {
    onSelectPatient(patient);
    setIsDropdownOpen(false);
    setSearchQuery(patient.patient_name || '');
  };

  const getSpecialtyColor = (spec) => {
    switch (spec) {
      case 'Cardiology': return { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', badge: '#ef4444' };
      case 'Neurology': return { bg: '#faf5ff', border: '#ddd6fe', text: '#6d28d9', badge: '#8b5cf6' };
      case 'Pulmonology': return { bg: '#ecfeff', border: '#a5f3fc', text: '#0e7490', badge: '#06b6d4' };
      case 'Endocrinology': return { bg: '#fffbeb', border: '#fde68a', text: '#b45309', badge: '#f59e0b' };
      case 'Pathology': return { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857', badge: '#10b981' };
      case 'Orthopedics': return { bg: '#f0f9ff', border: '#bae6fd', text: '#0369a1', badge: '#0284c7' };
      default: return { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', badge: '#2563eb' };
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 50%, #eff6ff 100%)',
      border: '1.5px solid #99f6e4',
      borderRadius: '16px',
      padding: '20px 24px',
      marginBottom: '22px',
      boxShadow: '0 4px 20px rgba(13, 148, 136, 0.08)',
      position: 'relative'
    }}>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
          }}>
            <Search size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Doctor Patient Record Registry & Lookup
              </h3>
              <span style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                border: '1px solid #bfdbfe'
              }}>
                Live Hospital Database
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              Search any patient by name or MRN to instantly fetch their clinical notes, diagnostic telemetry, and explainable AI heatmaps.
            </p>
          </div>
        </div>

        {activePatientName && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            padding: '6px 14px',
            borderRadius: '999px'
          }}>
            <UserCheck size={14} color="#16a34a" />
            <span style={{ fontSize: '12px', color: '#166534', fontWeight: 700 }}>
              Active Patient: <strong>{activePatientName}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Search Input Bar */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#ffffff',
          border: isDropdownOpen ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
          borderRadius: '12px',
          padding: '4px 8px 4px 16px',
          boxShadow: isDropdownOpen ? '0 0 0 4px rgba(37, 99, 235, 0.1)' : '0 2px 6px rgba(0,0,0,0.03)',
          transition: 'all 0.15s ease'
        }}>
          <Search size={18} color="#64748b" style={{ marginRight: '10px' }} />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            placeholder="Type patient name (e.g., Marcus Vance, Eleanor Brooks, Clara Higgins, Raymond Ortiz, David Miller)..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '13.5px',
              color: '#0f172a',
              padding: '8px 0',
              background: 'transparent'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsDropdownOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={15} />
            </button>
          )}
          <button
            onClick={() => {
              if (filteredPatients.length > 0) {
                handlePatientClick(filteredPatients[0]);
              }
            }}
            className="btn btn-primary"
            style={{
              padding: '7px 16px',
              fontSize: '12.5px',
              fontWeight: 700,
              borderRadius: '8px',
              marginLeft: '8px'
            }}
          >
            <Sparkles size={14} />
            <span>Fetch Report</span>
          </button>
        </div>

        {/* Dropdown Suggestions List */}
        {isDropdownOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            borderRadius: '12px',
            border: '1.5px solid #cbd5e1',
            boxShadow: '0 16px 32px rgba(15, 23, 42, 0.15)',
            zIndex: 100,
            maxHeight: '340px',
            overflowY: 'auto',
            padding: '8px'
          }}>
            <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #f1f5f9' }}>
              Matching Hospital Patient Records ({filteredPatients.length})
            </div>

            {filteredPatients.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                No patient matching "{searchQuery}" found. Try searching by full name or MRN.
              </div>
            ) : (
              filteredPatients.map((patient, idx) => {
                const color = getSpecialtyColor(patient.specialty);
                const isSelected = activePatientName === patient.patient_name;
                return (
                  <div
                    key={idx}
                    onClick={() => handlePatientClick(patient)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease',
                      marginTop: '4px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#ffffff';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: color.bg,
                        border: `1.5px solid ${color.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '13px',
                        color: color.text
                      }}>
                        {patient.patient_name ? patient.patient_name.split(' ').map(n => n[0]).join('') : 'PT'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                            {patient.patient_name || 'Inpatient Case'}
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                            {patient.patient_id}
                          </span>
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '1px 7px',
                            borderRadius: '999px',
                            background: color.bg,
                            color: color.text,
                            border: `1px solid ${color.border}`
                          }}>
                            {patient.specialty}
                          </span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                          Age: <strong>{patient.age || '55'} {patient.gender}</strong> • Ward: <strong>{patient.ward || 'General'}</strong> • {patient.triage || 'Standard'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>
                      <span>Fetch Report</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Quick Select Patient Chips */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>
          Quick Patient Selector (1-Click Instant Report Fetch):
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {samples.map((s, idx) => {
            const isCurrent = activePatientName === s.patient_name;
            const color = getSpecialtyColor(s.specialty);
            return (
              <button
                key={idx}
                onClick={() => handlePatientClick(s)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: isCurrent ? 800 : 600,
                  border: isCurrent ? `2px solid ${color.badge}` : `1px solid ${color.border}`,
                  background: isCurrent ? color.bg : '#ffffff',
                  color: color.text,
                  cursor: 'pointer',
                  boxShadow: isCurrent ? `0 2px 8px ${color.badge}30` : '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: isCurrent ? color.badge : '#94a3b8'
                }} />
                <span>{s.patient_name || s.title}</span>
                <span style={{ fontSize: '10.5px', opacity: 0.75 }}>({s.specialty})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
