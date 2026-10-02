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
  X,
  UserPlus,
  UploadCloud,
  Calendar,
  Layers,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle
} from 'lucide-react';

export default function DoctorPatientSearch({
  samples = [],
  activePatientName,
  activePatient,
  activeReportType = 'baseline',
  onSelectPatient,
  onSwitchReportType,
  onOpenRegisterModal,
  onOpenFollowupModal,
  onOpenLongitudinalModal,
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
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.patient_id && s.patient_id.toLowerCase().includes(q)) ||
      (s.id && s.id.toLowerCase().includes(q)) ||
      (s.specialty && s.specialty.toLowerCase().includes(q)) ||
      (s.title && s.title.toLowerCase().includes(q))
    );
  }, [samples, searchQuery]);

  const handlePatientClick = (patient) => {
    onSelectPatient(patient);
    setIsDropdownOpen(false);
    setSearchQuery(patient.patient_name || patient.name || '');
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IMPROVED':
        return { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857', icon: <CheckCircle2 size={12} color="#059669" /> };
      case 'WORSENED':
        return { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', icon: <AlertTriangle size={12} color="#dc2626" /> };
      case 'STABLE':
      default:
        return { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', icon: <Minus size={12} color="#2563eb" /> };
    }
  };

  const currentTraj = activePatient?.longitudinal_trajectory;
  const currentBadge = currentTraj ? getStatusBadge(currentTraj.trajectory_badge) : null;
  const hasFollowup = !!(activePatient?.latest_report && activePatient.latest_report.text);

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
                Doctor Patient Registry & Longitudinal Tracking
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
                Live Hospital Registry ({samples.length} Inpatients)
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              Inspect baseline admission notes, track serial follow-up biomarker deltas, and register new inpatients dynamically.
            </p>
          </div>
        </div>

        {/* Action Buttons: Register New Patient & Active Patient Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {onOpenRegisterModal && (
            <button
              onClick={onOpenRegisterModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <UserPlus size={14} />
              <span>+ Register New Inpatient</span>
            </button>
          )}

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
                Active: <strong>{activePatientName}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active Patient Report Selector & Longitudinal Quick Banner */}
      {activePatient && (
        <div style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Left: Report Toggle (Baseline vs Latest) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Report In View:
            </span>
            <button
              onClick={() => onSwitchReportType && onSwitchReportType('baseline')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: activeReportType === 'baseline' ? 800 : 600,
                border: activeReportType === 'baseline' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                background: activeReportType === 'baseline' ? '#eff6ff' : '#f8fafc',
                color: activeReportType === 'baseline' ? '#1d4ed8' : '#475569',
                cursor: 'pointer'
              }}
            >
              <FileText size={13} color={activeReportType === 'baseline' ? '#2563eb' : '#64748b'} />
              <span>Baseline Admission Report</span>
            </button>

            {hasFollowup ? (
              <button
                onClick={() => onSwitchReportType && onSwitchReportType('latest')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: activeReportType === 'latest' ? 800 : 600,
                  border: activeReportType === 'latest' ? '1.5px solid #059669' : '1px solid #cbd5e1',
                  background: activeReportType === 'latest' ? '#ecfdf5' : '#f8fafc',
                  color: activeReportType === 'latest' ? '#047857' : '#475569',
                  cursor: 'pointer'
                }}
              >
                <Activity size={13} color={activeReportType === 'latest' ? '#059669' : '#64748b'} />
                <span>Latest Follow-Up Report</span>
                <span style={{
                  fontSize: '10px',
                  background: '#10b981',
                  color: '#ffffff',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  fontWeight: 800
                }}>
                  Day 14
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenFollowupModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px dashed #0d9488',
                  background: '#f0fdfa',
                  color: '#0f766e',
                  cursor: 'pointer'
                }}
              >
                <UploadCloud size={13} />
                <span>+ Upload Follow-Up Report</span>
              </button>
            )}
          </div>

          {/* Right: Longitudinal Trajectory & Delta Comparison Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {hasFollowup && currentBadge ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: currentBadge.bg,
                  color: currentBadge.text,
                  border: `1px solid ${currentBadge.border}`,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 800
                }}>
                  {currentBadge.icon}
                  <span>Trajectory: {currentTraj.trajectory_badge}</span>
                </span>

                <button
                  onClick={onOpenLongitudinalModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.2)'
                  }}
                >
                  <Activity size={14} color="#38bdf8" />
                  <span>Compare Previous vs. Latest ({currentTraj.metrics?.length || 0} Deltas)</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenFollowupModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <UploadCloud size={14} />
                <span>Add Latest Test to Compare</span>
              </button>
            )}
          </div>
        </div>
      )}

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
            <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
              <span>Matching Hospital Patient Records ({filteredPatients.length})</span>
              <span>Baseline + Latest Reports</span>
            </div>

            {filteredPatients.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                No patient matching "{searchQuery}" found. Try searching by full name or MRN, or register a new inpatient.
              </div>
            ) : (
              filteredPatients.map((patient, idx) => {
                const color = getSpecialtyColor(patient.specialty);
                const isSelected = activePatientName === (patient.patient_name || patient.name);
                const pTraj = patient.longitudinal_trajectory;
                const pBadge = pTraj ? getStatusBadge(pTraj.trajectory_badge) : null;
                const pHasLatest = !!(patient.latest_report && patient.latest_report.text);

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
                        {(patient.patient_name || patient.name) ? (patient.patient_name || patient.name).split(' ').map(n => n[0]).join('') : 'PT'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                            {patient.patient_name || patient.name || 'Inpatient Case'}
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                            {patient.patient_id || patient.id}
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
                          {pBadge && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '1px 7px',
                              borderRadius: '999px',
                              fontSize: '10.5px',
                              fontWeight: 800,
                              background: pBadge.bg,
                              color: pBadge.text,
                              border: `1px solid ${pBadge.border}`
                            }}>
                              {pBadge.icon}
                              <span>{pTraj.trajectory_badge}</span>
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                          Age: <strong>{patient.age || '55'} {patient.gender}</strong> • Ward: <strong>{patient.ward || 'General'}</strong> • {pHasLatest ? '2 Reports (Baseline + Latest Follow-Up)' : '1 Report (Baseline Admission)'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#2563eb' }}>
                      <span>Fetch Record</span>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Quick Patient Selector ({samples.length} Inpatients Available):
          </span>
          <span style={{ fontSize: '11px', color: '#0d9488', fontWeight: 600 }}>
            Includes Baseline Admission & Serial Follow-Up Reports
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {samples.map((s, idx) => {
            const isCurrent = activePatientName === (s.patient_name || s.name);
            const color = getSpecialtyColor(s.specialty);
            const traj = s.longitudinal_trajectory;
            const trajBadge = traj ? getStatusBadge(traj.trajectory_badge) : null;

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
                <span>{s.patient_name || s.name || s.title}</span>
                <span style={{ fontSize: '10.5px', opacity: 0.75 }}>({s.specialty})</span>
                {trajBadge && (
                  <span style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: '999px',
                    background: trajBadge.bg,
                    color: trajBadge.text,
                    border: `1px solid ${trajBadge.border}`
                  }}>
                    {traj.trajectory_badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
