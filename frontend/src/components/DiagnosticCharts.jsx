import React from 'react';
import { BarChart3, Pill, Stethoscope, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function DiagnosticCharts({ classification, entities }) {
  if (!classification) return null;

  const topSpec = classification.top_specialty;
  const topConf = classification.confidence;
  const probs = classification.all_probabilities || {};

  // Sort specialties by probability descending
  const sortedProbs = Object.entries(probs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const diagnoses = entities?.diagnoses || [];
  const medications = entities?.medications || [];
  const vitals = entities?.vital_signs || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
      {/* Specialty Probability Distribution Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <BarChart3 size={17} color="#2563eb" />
            <span>Specialty Probability Distribution</span>
          </div>
          <span className="badge badge-blue">
            Top: {topSpec} ({topConf}%)
          </span>
        </div>
        <div className="card-body">
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
            Multi-class clinical classification calibrated across 5 medical domains:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {sortedProbs.map(([spec, pct]) => {
              const isTop = spec === topSpec;
              return (
                <div key={spec}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: isTop ? 700 : 500, color: isTop ? '#1e293b' : '#64748b' }}>
                      {spec}
                    </span>
                    <span style={{ fontWeight: 700, color: isTop ? '#2563eb' : '#94a3b8' }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: '#f1f5f9',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: isTop ? 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)' : '#cbd5e1',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease'
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Extracted Clinical Entities & Vitals */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Stethoscope size={17} color="#059669" />
            <span>Named Clinical Entities & Physiological Signs</span>
          </div>
          <span className="badge badge-green">
            Auto-Extracted
          </span>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Diagnoses */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
              <ShieldAlert size={14} color="#7c3aed" />
              <span>Identified Diagnoses & Pathologies</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {diagnoses.length > 0 ? (
                diagnoses.map((d, i) => (
                  <span key={i} className="badge badge-purple" style={{ padding: '4px 10px' }}>
                    {d}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Diagnostic review underway</span>
              )}
            </div>
          </div>

          {/* Medications */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
              <Pill size={14} color="#2563eb" />
              <span>Prescribed Medications & Dosages</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {medications.length > 0 ? (
                medications.map((m, i) => (
                  <span key={i} className="badge badge-blue" style={{ padding: '4px 10px' }}>
                    {m}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Medication list reviewed</span>
              )}
            </div>
          </div>

          {/* Vitals */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
              <Activity size={14} color="#059669" />
              <span>Vital Signs Recorded</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {vitals.length > 0 ? (
                vitals.map((v, i) => (
                  <span key={i} className="badge badge-green" style={{ padding: '4px 10px' }}>
                    {v}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Standard physiological baseline</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
