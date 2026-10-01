import React, { useState } from 'react';
import { FlaskConical, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Filter, Zap, Activity } from 'lucide-react';

export default function LabReportVisualizer({ labResults }) {
  if (!labResults || labResults.length === 0) return null;

  const [filterMode, setFilterMode] = useState('all'); // 'all', 'abnormal', 'normal'

  const abnormalCount = labResults.filter(l => l.status !== 'NORMAL').length;
  const normalCount = labResults.length - abnormalCount;

  const filteredTests = labResults.filter(l => {
    if (filterMode === 'abnormal') return l.status !== 'NORMAL';
    if (filterMode === 'normal') return l.status === 'NORMAL';
    return true;
  });

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
      border: '1.5px solid #a7f3d0',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)'
          }}>
            <FlaskConical size={20} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.2px' }}>
              Diagnostic Laboratory Intelligence & Clinical Range Calibrations
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              Automated chemical panel extraction, reference-range mapping, and layperson physiological insights
            </p>
          </div>
        </div>

        {/* Filter Controls & Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setFilterMode('all')}
            style={{
              padding: '5px 12px',
              borderRadius: '8px',
              border: `1px solid ${filterMode === 'all' ? '#2563eb' : '#cbd5e1'}`,
              background: filterMode === 'all' ? '#eff6ff' : '#ffffff',
              color: filterMode === 'all' ? '#1d4ed8' : '#64748b',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            All Tests ({labResults.length})
          </button>
          <button
            onClick={() => setFilterMode('abnormal')}
            style={{
              padding: '5px 12px',
              borderRadius: '8px',
              border: `1px solid ${filterMode === 'abnormal' ? '#ef4444' : '#cbd5e1'}`,
              background: filterMode === 'abnormal' ? '#fef2f2' : '#ffffff',
              color: filterMode === 'abnormal' ? '#b91c1c' : '#64748b',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <AlertTriangle size={13} /> Flagged Abnormal ({abnormalCount})
          </button>
          <button
            onClick={() => setFilterMode('normal')}
            style={{
              padding: '5px 12px',
              borderRadius: '8px',
              border: `1px solid ${filterMode === 'normal' ? '#10b981' : '#cbd5e1'}`,
              background: filterMode === 'normal' ? '#ecfdf5' : '#ffffff',
              color: filterMode === 'normal' ? '#047857' : '#64748b',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <CheckCircle size={13} /> Normal ({normalCount})
          </button>
        </div>
      </div>

      {/* Lab Tests Grid with Dual-Gradient Range Sliders */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '16px'
      }}>
        {filteredTests.map((item, idx) => {
          const isHigh = item.status === 'HIGH';
          const isLow = item.status === 'LOW';
          const isNormal = item.status === 'NORMAL';

          const statusColor = isHigh ? '#ef4444' : isLow ? '#3b82f6' : '#10b981';
          const statusBg = isHigh ? '#fef2f2' : isLow ? '#eff6ff' : '#ecfdf5';
          const statusBorder = isHigh ? '#fecaca' : isLow ? '#bfdbfe' : '#a7f3d0';

          return (
            <div
              key={idx}
              style={{
                border: `1.5px solid ${isNormal ? '#e2e8f0' : statusBorder}`,
                background: isNormal ? '#ffffff' : statusBg + '44',
                borderRadius: '12px',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isNormal ? '0 1px 3px rgba(0,0,0,0.02)' : `0 4px 12px ${statusColor}18`,
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                      {item.test_name}
                    </span>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                      Organ System: <span style={{ color: '#2563eb' }}>{item.system}</span>
                    </div>
                  </div>
                  <span style={{
                    background: statusBg,
                    color: statusColor,
                    border: `1px solid ${statusBorder}`,
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isHigh && <TrendingUp size={12} />}
                    {isLow && <TrendingDown size={12} />}
                    {isNormal && <CheckCircle size={12} />}
                    {item.status}
                  </span>
                </div>

                {/* Patient Value vs Reference Range */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0 12px 0' }}>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: statusColor, fontFamily: 'JetBrains Mono, monospace' }}>
                    {item.value}
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 700 }}>
                    {item.unit}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8', marginLeft: 'auto', fontWeight: 500 }}>
                    Standard Ref: <strong>{item.ref_min} - {item.ref_max}</strong> {item.unit}
                  </span>
                </div>

                {/* Precision Range Meter with Floating Pin */}
                <div style={{ marginBottom: '14px', position: 'relative' }}>
                  <div style={{
                    position: 'relative',
                    height: '10px',
                    borderRadius: '5px',
                    background: 'linear-gradient(90deg, #93c5fd 0%, #86efac 30%, #86efac 70%, #fca5a5 100%)',
                    overflow: 'visible',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    {/* Glowing position needle */}
                    <div style={{
                      position: 'absolute',
                      left: `${item.gauge_percent}%`,
                      top: '-6px',
                      width: '16px',
                      height: '22px',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      zIndex: 2
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: statusColor,
                        border: '2px solid #ffffff',
                        boxShadow: `0 0 8px ${statusColor}`
                      }}></div>
                      <div style={{
                        width: '2px',
                        height: '10px',
                        background: statusColor
                      }}></div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    color: '#94a3b8',
                    marginTop: '8px',
                    fontWeight: 600
                  }}>
                    <span style={{ color: '#3b82f6' }}>Deficient / Low</span>
                    <span style={{ color: '#059669', fontWeight: 800 }}>Normal Safe Physiological Range</span>
                    <span style={{ color: '#ef4444' }}>Elevated / High</span>
                  </div>
                </div>
              </div>

              {/* Layman Patient Meaning Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '12px',
                color: '#334155',
                lineHeight: '1.5'
              }}>
                <strong style={{ color: '#0f172a' }}>Clinical Significance: </strong>
                {item.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
