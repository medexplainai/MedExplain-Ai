import React from 'react';
import {
  Activity,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileText,
  X,
  ArrowRight,
  Sparkles,
  UploadCloud,
  Layers,
  HeartPulse,
  ShieldCheck
} from 'lucide-react';

export default function LongitudinalComparisonModal({
  isOpen,
  onClose,
  patient,
  onSwitchReport,
  onOpenUploadFollowup,
  activeReportType = 'baseline'
}) {
  if (!isOpen || !patient) return null;

  const trajectory = patient.longitudinal_trajectory;
  const baseline = patient.baseline_report || {};
  const latest = patient.latest_report || {};
  const metrics = trajectory?.metrics || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IMPROVED':
        return {
          bg: '#ecfdf5',
          border: '#a7f3d0',
          text: '#047857',
          icon: <CheckCircle2 size={15} color="#059669" />,
          label: 'IMPROVED'
        };
      case 'WORSENED':
        return {
          bg: '#fef2f2',
          border: '#fecaca',
          text: '#b91c1c',
          icon: <AlertTriangle size={15} color="#dc2626" />,
          label: 'WORSENED'
        };
      case 'STABLE':
      default:
        return {
          bg: '#eff6ff',
          border: '#bfdbfe',
          text: '#1d4ed8',
          icon: <Minus size={15} color="#2563eb" />,
          label: 'STABLE'
        };
    }
  };

  const overallBadge = getStatusBadge(trajectory?.trajectory_badge || 'STABLE');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: '920px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        border: '1.5px solid #cbd5e1',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '22px 28px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
            }}>
              <Activity size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  Longitudinal Comparison & Serial Trajectory
                </h2>
                <span style={{
                  background: overallBadge.bg,
                  color: overallBadge.text,
                  border: `1px solid ${overallBadge.border}`,
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {overallBadge.icon}
                  <span>STATUS: {trajectory?.trajectory_badge || 'EVALUATED'}</span>
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#94a3b8' }}>
                Comparing baseline inpatient admission with latest outpatient follow-up markers for <strong>{patient.name}</strong> ({patient.id})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#334155',
              border: 'none',
              borderRadius: '10px',
              color: '#cbd5e1',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#475569'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#334155'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Timeline Summary Ribbon */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '16px',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px 20px'
          }}>
            {/* Baseline Box */}
            <div style={{
              background: activeReportType === 'baseline' ? '#eff6ff' : '#ffffff',
              border: activeReportType === 'baseline' ? '2px solid #2563eb' : '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '12px 14px',
              cursor: 'pointer'
            }}
            onClick={() => onSwitchReport && onSwitchReport('baseline')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                  Report 1: Baseline Admission
                </span>
                <span style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> {baseline.date || 'Admission'}
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                {baseline.title || 'Inpatient Admission Assessment'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                {activeReportType === 'baseline' ? 'Currently viewing in workspace' : 'Click to inspect baseline report'}
              </div>
            </div>

            {/* Interval Indicator */}
            <div style={{ textAlign: 'center', padding: '0 8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 4px auto'
              }}>
                <ArrowRight size={16} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                Serial Interval
              </span>
            </div>

            {/* Latest Box */}
            <div style={{
              background: activeReportType === 'latest' ? '#eff6ff' : '#ffffff',
              border: activeReportType === 'latest' ? '2px solid #2563eb' : '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '12px 14px',
              cursor: 'pointer'
            }}
            onClick={() => onSwitchReport && onSwitchReport('latest')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                  Report 2: Latest Follow-Up
                </span>
                <span style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> {latest.date || 'Latest'}
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                {latest.title || 'Post-Intervention Follow-Up Evaluation'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                {activeReportType === 'latest' ? 'Currently viewing in workspace' : 'Click to inspect latest report'}
              </div>
            </div>
          </div>

          {/* KPI Statistics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Evaluated Markers
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                {metrics.length}
              </div>
            </div>

            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '12px',
              padding: '12px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
                Improved Markers
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                {trajectory?.improved_count ?? metrics.filter(m => m.status === 'IMPROVED').length}
              </div>
            </div>

            <div style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '12px',
              padding: '12px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>
                Stable Markers
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
                {trajectory?.stable_count ?? metrics.filter(m => m.status === 'STABLE').length}
              </div>
            </div>

            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '12px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase' }}>
                Worsened Markers
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                {trajectory?.worsened_count ?? metrics.filter(m => m.status === 'WORSENED').length}
              </div>
            </div>
          </div>

          {/* Clinical Biomarker Comparison Table */}
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: '14px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#f8fafc',
              padding: '12px 18px',
              borderBottom: '1.5px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HeartPulse size={16} color="#0284c7" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                  Biomarker & Diagnostic Score Deltas
                </span>
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                Calculated between baseline and serial follow-up
              </span>
            </div>

            {metrics.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                No quantitative biomarker differences extracted between reports.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '11.5px', fontWeight: 700 }}>
                      <th style={{ padding: '10px 16px' }}>CLINICAL PARAMETER</th>
                      <th style={{ padding: '10px 16px' }}>PREVIOUS / BASELINE</th>
                      <th style={{ padding: '10px 16px' }}>LATEST TEST VALUE</th>
                      <th style={{ padding: '10px 16px' }}>DELTA / CHANGE</th>
                      <th style={{ padding: '10px 16px' }}>STATUS & TRAJECTORY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((m, idx) => {
                      const badge = getStatusBadge(m.status);
                      return (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: idx % 2 === 0 ? '#ffffff' : '#fafafa'
                          }}
                        >
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.name}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{m.category} {m.unit ? `(${m.unit})` : ''}</div>
                          </td>
                          <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#334155' }}>
                            {m.baseline_display}
                          </td>
                          <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#0f172a' }}>
                            {m.latest_display}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              fontWeight: 700,
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '12px',
                              color: m.status === 'IMPROVED' ? '#059669' : m.status === 'WORSENED' ? '#dc2626' : '#2563eb'
                            }}>
                              {m.delta_display}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '11.5px',
                              fontWeight: 800,
                              background: badge.bg,
                              color: badge.text,
                              border: `1px solid ${badge.border}`
                            }}>
                              {badge.icon}
                              <span>{badge.label}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Clinical Evolution Narrative */}
          {trajectory?.clinical_narrative && (
            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: '14px',
              padding: '16px 20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldCheck size={16} color="#16a34a" />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#166534' }}>
                  Clinical Progress & Trajectory Narrative
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#14532d', lineHeight: '1.6' }}>
                {trajectory.clinical_narrative}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '16px 28px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                onSwitchReport && onSwitchReport('baseline');
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: activeReportType === 'baseline' ? '#eff6ff' : '#ffffff',
                border: activeReportType === 'baseline' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: activeReportType === 'baseline' ? '#2563eb' : '#475569',
                cursor: 'pointer'
              }}
            >
              <FileText size={14} />
              <span>Inspect Baseline Report</span>
            </button>

            <button
              onClick={() => {
                onSwitchReport && onSwitchReport('latest');
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: activeReportType === 'latest' ? '#eff6ff' : '#ffffff',
                border: activeReportType === 'latest' ? '1.5px solid #059669' : '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: activeReportType === 'latest' ? '#059669' : '#475569',
                cursor: 'pointer'
              }}
            >
              <Activity size={14} />
              <span>Inspect Latest Follow-Up</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onOpenUploadFollowup && (
              <button
                onClick={() => {
                  onClose();
                  onOpenUploadFollowup();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                <UploadCloud size={15} />
                <span>Upload Newer Serial Report</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="btn btn-primary"
              style={{
                padding: '8px 20px',
                fontSize: '12.5px',
                fontWeight: 700,
                borderRadius: '8px'
              }}
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
