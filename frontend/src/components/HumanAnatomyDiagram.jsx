import React from 'react';
import { HeartPulse, Brain, Bone, Activity, Wind, FlaskConical, Target, CheckCircle } from 'lucide-react';

export default function HumanAnatomyDiagram({ activeSpecialty, onSelectHotspot }) {
  const hotspots = [
    {
      id: 'Neurology',
      name: 'Brain / Cerebrovascular',
      specialty: 'Neurology',
      sampleKey: 'Neurology: Acute Ischemic Stroke Evaluation',
      cx: 150,
      cy: 62,
      color: '#8b5cf6',
      bg: '#faf5ff',
      tag: 'Left MCA Stroke',
      icon: Brain
    },
    {
      id: 'Cardiology',
      name: 'Heart / Coronary Arteries',
      specialty: 'Cardiology',
      sampleKey: 'Cardiology: Acute Myocardial Ischemia',
      cx: 165,
      cy: 145,
      color: '#ef4444',
      bg: '#fef2f2',
      tag: 'LAD Stenosis / Stent',
      icon: HeartPulse
    },
    {
      id: 'Pulmonology',
      name: 'Lungs / Thorax',
      specialty: 'Pulmonology',
      sampleKey: 'Radiology & Imaging Report: High-Resolution Chest CT Scan',
      cx: 135,
      cy: 140,
      color: '#06b6d4',
      bg: '#ecfeff',
      tag: 'Lobar Pneumonia CT',
      icon: Wind
    },
    {
      id: 'Endocrinology',
      name: 'Pancreas & Glycemic Regulation',
      specialty: 'Endocrinology',
      sampleKey: 'Endocrinology: Type 2 Diabetes with Neuropathy',
      cx: 150,
      cy: 205,
      color: '#f59e0b',
      bg: '#fffbeb',
      tag: 'HbA1c 10.4% / Neuropathy',
      icon: Activity
    },
    {
      id: 'Pathology',
      name: 'Vascular & Blood Chemistry',
      specialty: 'Pathology',
      sampleKey: 'Diagnostic Laboratory Report: Blood & Metabolic Panel',
      cx: 120,
      cy: 220,
      color: '#10b981',
      bg: '#ecfdf5',
      tag: 'Lipid & CBC Panel',
      icon: FlaskConical
    },
    {
      id: 'Orthopedics',
      name: 'Right Knee Joint & Meniscus',
      specialty: 'Orthopedics',
      sampleKey: 'Orthopedics: Right Knee Meniscal Tear',
      cx: 170,
      cy: 350,
      color: '#0ea5e9',
      bg: '#f0f9ff',
      tag: 'Meniscal Tear / Repair',
      icon: Bone
    }
  ];

  const activeHotspot = hotspots.find(h => h.id === activeSpecialty || (activeSpecialty === 'Cardiology' && h.id === 'Cardiology')) || hotspots[1];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient medical grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '300px',
        height: '100%',
        background: 'radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.06) 0%, transparent 60%)',
        pointerEvents: 'none'
      }}></div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)'
          }}>
            <Target size={19} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.2px' }}>
              Interactive Anatomical Hotspot Cockpit
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              Click any anatomical organ node or specialty card to immediately load that pathology and AI analysis:
            </p>
          </div>
        </div>

        <span style={{
          background: '#eff6ff',
          color: '#1d4ed8',
          border: '1px solid #bfdbfe',
          borderRadius: '999px',
          padding: '4px 12px',
          fontSize: '11.5px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <CheckCircle size={13} color="#2563eb" /> Active: {activeHotspot.name}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '24px', alignItems: 'center' }}>
        {/* Anatomical Body Silhouette Vector Graphic */}
        <div style={{
          background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <svg viewBox="0 0 300 440" style={{ width: '100%', height: '360px', overflow: 'visible' }}>
            <defs>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.6" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Stylized Human Body Silhouette */}
            {/* Head */}
            <circle cx="150" cy="55" r="28" fill="url(#bodyGradient)" />
            {/* Neck */}
            <rect x="144" y="80" width="12" height="18" rx="4" fill="url(#bodyGradient)" />
            {/* Shoulders & Torso */}
            <path d="M 105 105 C 120 95, 180 95, 195 105 C 205 115, 190 230, 185 240 C 180 248, 120 248, 115 240 C 110 230, 95 115, 105 105 Z" fill="url(#bodyGradient)" />
            {/* Left Arm */}
            <path d="M 103 108 C 88 125, 78 180, 72 230 C 70 238, 80 240, 84 232 C 90 190, 100 135, 110 115 Z" fill="url(#bodyGradient)" />
            {/* Right Arm */}
            <path d="M 197 108 C 212 125, 222 180, 228 230 C 230 238, 220 240, 216 232 C 210 190, 200 135, 190 115 Z" fill="url(#bodyGradient)" />
            {/* Pelvis / Hips */}
            <path d="M 116 238 L 184 238 L 180 268 L 120 268 Z" fill="url(#bodyGradient)" />
            {/* Left Leg */}
            <path d="M 122 268 C 120 310, 122 360, 124 415 C 124 422, 134 422, 136 415 C 140 360, 142 310, 144 268 Z" fill="url(#bodyGradient)" />
            {/* Right Leg */}
            <path d="M 156 268 C 158 310, 160 360, 164 415 C 164 422, 174 422, 176 415 C 178 360, 180 310, 178 268 Z" fill="url(#bodyGradient)" />

            {/* Connecting visual radar circles for active hotspot */}
            <circle
              cx={activeHotspot.cx}
              cy={activeHotspot.cy}
              r="22"
              fill={activeHotspot.color}
              fillOpacity="0.18"
              stroke={activeHotspot.color}
              strokeWidth="1.5"
              strokeDasharray="4 3"
              style={{ animation: 'spinSlow 10s linear infinite' }}
            />

            {/* Interactive Organ Hotspots */}
            {hotspots.map((spot) => {
              const isSelected = activeHotspot.id === spot.id;
              return (
                <g
                  key={spot.id}
                  onClick={() => onSelectHotspot(spot.sampleKey, spot.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer pulse circle */}
                  <circle
                    cx={spot.cx}
                    cy={spot.cy}
                    r={isSelected ? 14 : 9}
                    fill={spot.color}
                    fillOpacity={isSelected ? 0.35 : 0.2}
                  />
                  {/* Core hotspot node */}
                  <circle
                    cx={spot.cx}
                    cy={spot.cy}
                    r={isSelected ? 8 : 5}
                    fill={spot.color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter="url(#glow)"
                  />
                  {/* Target Crosshair on active */}
                  {isSelected && (
                    <line
                      x1={spot.cx - 12}
                      y1={spot.cy}
                      x2={spot.cx + 12}
                      y2={spot.cy}
                      stroke={spot.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.8"
                    />
                  )}
                  {isSelected && (
                    <line
                      x1={spot.cx}
                      y1={spot.cy - 12}
                      x2={spot.cx}
                      y2={spot.cy + 12}
                      stroke={spot.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.8"
                    />
                  )}
                </g>
              );
            })}
          </svg>
          <div style={{
            position: 'absolute',
            bottom: '12px',
            fontSize: '11px',
            color: '#64748b',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid #e2e8f0'
          }}>
            Click anatomy nodes to toggle organ focus
          </div>
        </div>

        {/* Organ System Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {hotspots.map((spot) => {
            const Icon = spot.icon;
            const isSelected = activeHotspot.id === spot.id;
            return (
              <div
                key={spot.id}
                onClick={() => onSelectHotspot(spot.sampleKey, spot.id)}
                style={{
                  background: isSelected ? spot.bg : '#ffffff',
                  border: `2px solid ${isSelected ? spot.color : '#e2e8f0'}`,
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected ? `0 6px 16px ${spot.color}25` : '0 1px 3px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  position: 'relative'
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '12px',
                    background: spot.color,
                    color: '#ffffff',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    padding: '1px 7px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px'
                  }}>
                    Active Focus
                  </div>
                )}
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: isSelected ? spot.color : spot.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}>
                  <Icon size={20} color={isSelected ? '#ffffff' : spot.color} strokeWidth={2.4} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: isSelected ? spot.color : '#0f172a' }}>
                    {spot.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    Benchmark: <strong>{spot.tag}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
