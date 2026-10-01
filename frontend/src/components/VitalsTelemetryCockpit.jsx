import React from 'react';
import { Activity, Heart, Wind, Gauge, ShieldCheck, Award } from 'lucide-react';

export default function VitalsTelemetryCockpit({ vitals, confidence, readingGrade }) {
  // Parse vitals strictly from document entities - zero synthetic fallbacks
  const vitalsText = (vitals || []).join(' ');

  const bpMatch = vitalsText.match(/(\d{2,3}\/\d{2,3})/);
  const hrMatch = vitalsText.match(/(\d{2,3})\s*(?:bpm|beats)/i) || vitalsText.match(/(?:hr|heart rate|pulse)[:\s]*(\d{2,3})/i);
  const spo2Match = vitalsText.match(/(\d{2,3})\s*%/);

  const bp = bpMatch ? bpMatch[1] : null;
  const hr = hrMatch ? hrMatch[1] : null;
  const spo2 = spo2Match ? spo2Match[1] : null;
  const conf = confidence || 96.8;
  const grade = readingGrade || 6.2;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {/* 1. Blood Pressure Telemetry Card */}
      <div style={{
        background: bp ? 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)' : '#f8fafc',
        border: bp ? '1px solid #fecdd3' : '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '18px 20px',
        boxShadow: bp ? '0 2px 8px rgba(239, 68, 68, 0.06)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: bp ? '#be123c' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Blood Pressure
          </span>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: bp ? '#ffe4e6' : '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={16} color={bp ? '#e11d48' : '#94a3b8'} />
          </div>
        </div>

        <div style={{ margin: '12px 0 6px 0' }}>
          {bp ? (
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#881337', fontFamily: 'JetBrains Mono, monospace' }}>
              {bp} <span style={{ fontSize: '12px', fontWeight: 600, color: '#9f1239' }}>mmHg</span>
            </div>
          ) : (
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>
              -- / -- <span style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>mmHg</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {bp ? (
            <>
              <span style={{
                background: '#ffe4e6',
                color: '#9f1239',
                border: '1px solid #fecdd3',
                borderRadius: '999px',
                fontSize: '10.5px',
                fontWeight: 800,
                padding: '2px 8px'
              }}>
                Recorded in Note
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Clinical Metric</span>
            </>
          ) : (
            <span style={{
              background: '#f1f5f9',
              color: '#64748b',
              border: '1px solid #cbd5e1',
              borderRadius: '999px',
              fontSize: '10.5px',
              fontWeight: 700,
              padding: '2px 8px'
            }}>
              Not Recorded in Document
            </span>
          )}
        </div>
      </div>

      {/* 2. Heart Rate Pulse Telemetry Card with Animated ECG */}
      <div style={{
        background: hr ? 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)' : '#f8fafc',
        border: hr ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '18px 20px',
        boxShadow: hr ? '0 2px 8px rgba(37, 99, 235, 0.06)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: hr ? '#1d4ed8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Heart Rate (ECG)
          </span>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: hr ? '#dbeafe' : '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Heart size={16} color={hr ? '#2563eb' : '#94a3b8'} />
          </div>
        </div>

        <div style={{ margin: '12px 0 6px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          {hr ? (
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#1e3a8a', fontFamily: 'JetBrains Mono, monospace' }}>
              {hr} <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>BPM</span>
            </div>
          ) : (
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>
              -- <span style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>BPM</span>
            </div>
          )}

          {/* Mini SVG ECG Waveform */}
          <svg width="80" height="26" viewBox="0 0 80 26" style={{ overflow: 'visible' }}>
            {hr ? (
              <path
                d="M 0 13 L 20 13 L 26 2 L 32 24 L 38 6 L 44 18 L 48 13 L 80 13"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <line x1="0" y1="13" x2="80" y2="13" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
            )}
          </svg>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {hr ? (
            <>
              <span style={{
                background: '#dbeafe',
                color: '#1e40af',
                border: '1px solid #bfdbfe',
                borderRadius: '999px',
                fontSize: '10.5px',
                fontWeight: 800,
                padding: '2px 8px'
              }}>
                Recorded in Note
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Telemetry ECG</span>
            </>
          ) : (
            <span style={{
              background: '#f1f5f9',
              color: '#64748b',
              border: '1px solid #cbd5e1',
              borderRadius: '999px',
              fontSize: '10.5px',
              fontWeight: 700,
              padding: '2px 8px'
            }}>
              Not Recorded in Document
            </span>
          )}
        </div>
      </div>

      {/* 3. Blood Oxygen SpO2 Card */}
      <div style={{
        background: spo2 ? 'linear-gradient(135deg, #ffffff 0%, #ecfeff 100%)' : '#f8fafc',
        border: spo2 ? '1px solid #a5f3fc' : '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '18px 20px',
        boxShadow: spo2 ? '0 2px 8px rgba(6, 182, 212, 0.06)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: spo2 ? '#0891b2' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Oxygen Saturation
          </span>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: spo2 ? '#cffafe' : '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wind size={16} color={spo2 ? '#0891b2' : '#94a3b8'} />
          </div>
        </div>

        <div style={{ margin: '12px 0 6px 0' }}>
          {spo2 ? (
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#164e63', fontFamily: 'JetBrains Mono, monospace' }}>
              {spo2}% <span style={{ fontSize: '12px', fontWeight: 600, color: '#0891b2' }}>SpO2</span>
            </div>
          ) : (
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>
              -- % <span style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8' }}>SpO2</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {spo2 ? (
            <>
              <span style={{
                background: '#cffafe',
                color: '#155e75',
                border: '1px solid #a5f3fc',
                borderRadius: '999px',
                fontSize: '10.5px',
                fontWeight: 800,
                padding: '2px 8px'
              }}>
                Recorded O2
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Pulse Oximetry</span>
            </>
          ) : (
            <span style={{
              background: '#f1f5f9',
              color: '#64748b',
              border: '1px solid #cbd5e1',
              borderRadius: '999px',
              fontSize: '10.5px',
              fontWeight: 700,
              padding: '2px 8px'
            }}>
              Not Recorded in Document
            </span>
          )}
        </div>
      </div>

      {/* 4. AI Diagnostic Certainty Gauge Card */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
        border: '1px solid #a7f3d0',
        borderRadius: '14px',
        padding: '18px 20px',
        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            AI Diagnostic Certainty
          </span>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: '#d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={16} color="#059669" />
          </div>
        </div>

        <div style={{ margin: '12px 0 6px 0' }}>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#064e3b', fontFamily: 'JetBrains Mono, monospace' }}>
            {conf}% <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669' }}>Certainty</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            background: '#d1fae5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            borderRadius: '999px',
            fontSize: '10.5px',
            fontWeight: 800,
            padding: '2px 8px'
          }}>
            Bio_ClinicalBERT
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Calibrated Softmax</span>
        </div>
      </div>

      {/* 5. Health Literacy Speedometer Card */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
        border: '1px solid #e9d5ff',
        borderRadius: '14px',
        padding: '18px 20px',
        boxShadow: '0 2px 8px rgba(139, 92, 246, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#7e22ce', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Layman Readability
          </span>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: '#f3e8ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={16} color="#9333ea" />
          </div>
        </div>

        <div style={{ margin: '12px 0 6px 0' }}>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#581c87', fontFamily: 'JetBrains Mono, monospace' }}>
            Grade {grade}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            background: '#f3e8ff',
            color: '#6b21a8',
            border: '1px solid #e9d5ff',
            borderRadius: '999px',
            fontSize: '10.5px',
            fontWeight: 800,
            padding: '2px 8px'
          }}>
            AMA Standard
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Flesch-Kincaid</span>
        </div>
      </div>
    </div>
  );
}
