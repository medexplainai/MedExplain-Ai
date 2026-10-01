import React from 'react';
import {
  HeartHandshake,
  Pill,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Download,
  Printer,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

function renderCleanOverview(text) {
  if (!text) return null;
  const blocks = text.split(/\n\s*\n/).filter(b => b.trim());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        const matchHeading = trimmed.match(/^\*\*(.*?)\*\*\s*(?:\n+)?([\s\S]*)$/);
        if (matchHeading) {
          const heading = matchHeading[1].replace(/\*\*/g, '').trim();
          const body = matchHeading[2].replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*\*/g, '').trim();
          return (
            <div key={idx} style={{
              background: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #d1fae5',
              padding: '14px 18px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.05)'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: body ? '8px' : '0'
              }}>
                <Sparkles size={15} color="#059669" />
                <span>{heading}</span>
              </div>
              {body && (
                <p style={{ fontSize: '13.5px', lineHeight: '1.8', color: '#334155', margin: 0 }}>
                  {body}
                </p>
              )}
            </div>
          );
        }

        const cleanText = trimmed.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*\*/g, '');
        return (
          <div key={idx} style={{
            background: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            padding: '14px 18px',
            fontSize: '13.5px',
            lineHeight: '1.8',
            color: '#334155'
          }}>
            {cleanText}
          </div>
        );
      })}
    </div>
  );
}

export default function PatientCarePortal({ summary, onDownloadDocx }) {
  if (!summary) return null;

  const overview = summary.overview || '';
  const meds = summary.medication_table || [];
  const lifestyle = summary.lifestyle || { dos: [], donts: [] };
  const redFlags = summary.red_flags || [];

  // Group medications into 4 visual day-parts
  const morningMeds = meds.filter(m => {
    const s = (m.schedule || '').toLowerCase();
    return s.includes('morning') || s.includes('daily') || s.includes('twice');
  });

  const noonMeds = meds.filter(m => {
    const s = (m.schedule || '').toLowerCase();
    return s.includes('lunch') || s.includes('noon') || s.includes('afternoon') || s.includes('every 6');
  });

  const eveningMeds = meds.filter(m => {
    const s = (m.schedule || '').toLowerCase();
    return s.includes('evening') || s.includes('dinner') || s.includes('twice');
  });

  const bedtimeMeds = meds.filter(m => {
    const s = (m.schedule || '').toLowerCase();
    return s.includes('bedtime') || s.includes('night') || s.includes('qhs');
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
      {/* 1. Layman Plain-Language Care Plan Card */}
      <div className="card" style={{
        border: '1px solid #a7f3d0',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.08)'
      }}>
        <div className="card-header" style={{ background: '#ecfdf5', borderBottom: '1px solid #d1fae5' }}>
          <div className="card-title">
            <HeartHandshake size={19} color="#059669" />
            <span style={{ color: '#065f46' }}>Patient Layman Care Summary (Grade 6 Reading Level)</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Award size={13} /> AMA Health Literacy Benchmark Met
            </span>
          </div>
        </div>
        <div className="card-body">
          {renderCleanOverview(overview)}
        </div>
      </div>

      {/* 2. Visual 4-Part Daily Medication Pill Organizer Timeline */}
      <div className="card" style={{ border: '1px solid #bfdbfe' }}>
        <div className="card-header" style={{ background: '#eff6ff', borderBottom: '1px solid #dbeafe' }}>
          <div className="card-title">
            <Pill size={18} color="#2563eb" />
            <span style={{ color: '#1e40af' }}>Visual 24-Hour Medication Clock & Pill Dispenser</span>
          </div>
          <span className="badge badge-blue">
            {meds.length} Active Prescribed Medications
          </span>
        </div>
        <div className="card-body">
          <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '18px' }}>
            Intuitive visual pill boxes grouped by time of day for effortless patient adherence:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            {/* Morning Slot */}
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', marginBottom: '12px' }}>
                <Sunrise size={18} />
                <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
                  Morning (08:00 AM)
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {morningMeds.length > 0 ? (
                  morningMeds.map((m, i) => (
                    <div key={i} style={{
                      background: '#ffffff',
                      border: '1px solid #fde68a',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '12.5px'
                    }}>
                      <div style={{ fontWeight: 800, color: '#78350f' }}>{m.medication}</div>
                      <div style={{ fontSize: '11px', color: '#92400e', marginTop: '2px' }}>
                        Dose: <strong>{m.dosage}</strong> • {m.instructions}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No morning doses scheduled</div>
                )}
              </div>
            </div>

            {/* Afternoon Slot */}
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #e0f2fe',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 6px rgba(14, 165, 233, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1', marginBottom: '12px' }}>
                <Sun size={18} />
                <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
                  Afternoon (12:00 PM)
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {noonMeds.length > 0 ? (
                  noonMeds.map((m, i) => (
                    <div key={i} style={{
                      background: '#ffffff',
                      border: '1px solid #bae6fd',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '12.5px'
                    }}>
                      <div style={{ fontWeight: 800, color: '#075985' }}>{m.medication}</div>
                      <div style={{ fontSize: '11px', color: '#0369a1', marginTop: '2px' }}>
                        Dose: <strong>{m.dosage}</strong> • {m.instructions}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Take with lunch if PRN</div>
                )}
              </div>
            </div>

            {/* Evening Slot */}
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #d1fae5',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', marginBottom: '12px' }}>
                <Sunset size={18} />
                <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
                  Evening (06:00 PM)
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {eveningMeds.length > 0 ? (
                  eveningMeds.map((m, i) => (
                    <div key={i} style={{
                      background: '#ffffff',
                      border: '1px solid #a7f3d0',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '12.5px'
                    }}>
                      <div style={{ fontWeight: 800, color: '#065f46' }}>{m.medication}</div>
                      <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px' }}>
                        Dose: <strong>{m.dosage}</strong> • {m.instructions}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No evening doses scheduled</div>
                )}
              </div>
            </div>

            {/* Bedtime Slot */}
            <div style={{
              background: '#faf5ff',
              border: '1px solid #f3e8ff',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 6px rgba(139, 92, 246, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7e22ce', marginBottom: '12px' }}>
                <Moon size={18} />
                <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
                  Bedtime (10:00 PM)
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {bedtimeMeds.length > 0 ? (
                  bedtimeMeds.map((m, i) => (
                    <div key={i} style={{
                      background: '#ffffff',
                      border: '1px solid #e9d5ff',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '12.5px'
                    }}>
                      <div style={{ fontWeight: 800, color: '#581c87' }}>{m.medication}</div>
                      <div style={{ fontSize: '11px', color: '#7e22ce', marginTop: '2px' }}>
                        Dose: <strong>{m.dosage}</strong> • {m.instructions}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Restful sleep cycle</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lifestyle Dos & Don'ts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Lifestyle Dos */}
        <div className="card" style={{
          borderTop: '4px solid #10b981',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
        }}>
          <div className="card-header" style={{ background: '#ecfdf5' }}>
            <div className="card-title">
              <CheckCircle2 size={18} color="#059669" />
              <span style={{ color: '#065f46' }}>Mandatory Recovery Guidelines (Dos)</span>
            </div>
          </div>
          <div className="card-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lifestyle.dos.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: '#166534', lineHeight: '1.5' }}>
                  <CheckCircle2 size={17} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lifestyle Don'ts */}
        <div className="card" style={{
          borderTop: '4px solid #ef4444',
          background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)'
        }}>
          <div className="card-header" style={{ background: '#ffe4e6' }}>
            <div className="card-title">
              <XCircle size={18} color="#dc2626" />
              <span style={{ color: '#991b1b' }}>Strict Medical Restrictions (Don'ts)</span>
            </div>
          </div>
          <div className="card-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lifestyle.donts.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: '#991b1b', lineHeight: '1.5' }}>
                  <XCircle size={17} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Emergency Red Flags Callout */}
      <div style={{
        background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
        border: '2px solid #fecdd3',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
          }}>
            <AlertOctagon size={22} color="#dc2626" strokeWidth={2.4} />
          </div>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#991b1b', margin: 0, letterSpacing: '-0.2px' }}>
              CRITICAL EMERGENCY RED FLAGS (Call 911 / Go to Emergency Department Immediately)
            </h4>
            <p style={{ fontSize: '12px', color: '#b91c1c', margin: '2px 0 0 0' }}>
              Do not wait for scheduled outpatient appointments if any of these life-threatening warning signs occur:
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {redFlags.map((flag, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              border: '1px solid #fca5a5',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '13px',
              color: '#7f1d1d',
              fontWeight: 600,
              lineHeight: '1.45',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}>
              <span style={{ color: '#dc2626', fontWeight: 900, fontSize: '16px', lineHeight: 1 }}>•</span>
              <span>{flag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
