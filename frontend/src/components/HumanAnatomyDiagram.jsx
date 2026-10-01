import React from 'react';
import { HeartPulse, Brain, Bone, Activity, Wind, FlaskConical, Target, CheckCircle, Sparkles } from 'lucide-react';

export default function HumanAnatomyDiagram({ activeSpecialty, activeOrganId, onSelectHotspot }) {
  const hotspots = [
    {
      id: 'Neurology',
      name: 'Brain / Cerebrovascular',
      specialty: 'Neurology',
      sampleKey: 'Neurology: Acute Ischemic Stroke Evaluation',
      cx: 150,
      cy: 60,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      bg: '#faf5ff',
      tag: 'Left MCA Stroke',
      system: 'Central Nervous System',
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
      gradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      bg: '#fef2f2',
      tag: 'LAD Stenosis / Stent',
      system: 'Cardiovascular System',
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
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
      bg: '#ecfeff',
      tag: 'Lobar Pneumonia CT',
      system: 'Respiratory System',
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
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
      bg: '#fffbeb',
      tag: 'HbA1c 10.4% / Neuropathy',
      system: 'Endocrine System',
      icon: Activity
    },
    {
      id: 'Pathology',
      name: 'Vascular & Blood Chemistry',
      specialty: 'Pathology',
      sampleKey: 'Diagnostic Laboratory Report: Blood & Metabolic Panel',
      cx: 125,
      cy: 235,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      bg: '#ecfdf5',
      tag: 'Lipid & CBC Panel',
      system: 'Hematology & Biochemistry',
      icon: FlaskConical
    },
    {
      id: 'Orthopedics',
      name: 'Right Knee Joint & Meniscus',
      specialty: 'Orthopedics',
      sampleKey: 'Orthopedics: Right Knee Meniscal Tear',
      cx: 168,
      cy: 350,
      color: '#0284c7',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      bg: '#f0f9ff',
      tag: 'Meniscal Tear / Repair',
      system: 'Musculoskeletal System',
      icon: Bone
    }
  ];

  // Prioritize activeOrganId if set, otherwise activeSpecialty
  const currentKey = activeOrganId || activeSpecialty || 'Cardiology';
  const activeHotspot = hotspots.find(h =>
    h.id.toLowerCase() === currentKey.toLowerCase() ||
    h.specialty.toLowerCase() === currentKey.toLowerCase() ||
    (currentKey === 'Cardiology' && h.id === 'Cardiology')
  ) || hotspots[1];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 40%, #eff6ff 100%)',
      border: '2px solid #bfdbfe',
      borderRadius: '16px',
      padding: '24px 26px',
      marginBottom: '24px',
      boxShadow: '0 8px 30px rgba(37, 99, 235, 0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background medical ambient grid lines */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '400px',
        height: '100%',
        background: 'radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}></div>

      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
          }}>
            <Target size={22} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Interactive Anatomical Hotspot Cockpit</span>
              <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                MULTI-ORGAN XAI
              </span>
            </h3>
            <p style={{ fontSize: '12.5px', color: '#475569', margin: '2px 0 0 0' }}>
              Click any anatomical organ hotspot or clinical card to dynamically load and evaluate that diagnostic pathology:
            </p>
          </div>
        </div>

        {/* Current Active Indicator Badge */}
        <div style={{
          background: activeHotspot.bg,
          color: activeHotspot.color,
          border: `2px solid ${activeHotspot.color}`,
          borderRadius: '999px',
          padding: '6px 16px',
          fontSize: '12.5px',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: `0 2px 10px ${activeHotspot.color}30`
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeHotspot.color, display: 'inline-block', boxShadow: `0 0 8px ${activeHotspot.color}` }}></span>
          Active Target: {activeHotspot.name} ({activeHotspot.tag})
        </div>
      </div>

      {/* Main Grid: Anatomical Vector Body + Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '26px', alignItems: 'center' }}>
        {/* Anatomical Body Silhouette Vector Graphic */}
        <div style={{
          background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #e2e8f0 100%)',
          border: '2px solid #cbd5e1',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <svg viewBox="0 0 300 450" style={{ width: '100%', height: '380px', overflow: 'visible' }}>
            <defs>
              <linearGradient id="bodySkinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#64748b" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#475569" stopOpacity="0.70" />
              </linearGradient>
              <linearGradient id="arteryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="veinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
              </linearGradient>
              <filter id="organGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Stylized Enhanced Human Body Silhouette */}
            {/* Head & Cranium */}
            <circle cx="150" cy="55" r="30" fill="url(#bodySkinGradient)" />
            {/* Brain Cavity Contour */}
            <ellipse cx="150" cy="52" rx="18" ry="16" fill="#8b5cf6" fillOpacity="0.25" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="3 2" />
            
            {/* Neck */}
            <rect x="143" y="82" width="14" height="20" rx="4" fill="url(#bodySkinGradient)" />
            
            {/* Shoulders & Torso */}
            <path d="M 100 110 C 120 95, 180 95, 200 110 C 212 122, 195 240, 188 252 C 182 260, 118 260, 112 252 C 105 240, 88 122, 100 110 Z" fill="url(#bodySkinGradient)" />
            
            {/* Thoracic Ribcage Arcs */}
            <path d="M 125 125 C 140 120, 160 120, 175 125" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
            <path d="M 122 145 C 140 140, 160 140, 178 145" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
            <path d="M 124 165 C 140 160, 160 160, 176 165" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />

            {/* Bilateral Lung Contours */}
            <ellipse cx="132" cy="142" rx="12" ry="20" fill="#06b6d4" fillOpacity="0.22" stroke="#06b6d4" strokeWidth="1" />
            <ellipse cx="168" cy="142" rx="12" ry="20" fill="#06b6d4" fillOpacity="0.22" stroke="#06b6d4" strokeWidth="1" />

            {/* Heart Silhouette & Aorta Arch */}
            <path d="M 160 140 C 158 132, 170 132, 168 140 C 168 148, 160 154, 160 154 C 160 154, 152 148, 152 140 C 150 132, 162 132, 160 140 Z" fill="#ef4444" fillOpacity="0.5" />

            {/* Abdominal Pancreas / Visceral Field */}
            <ellipse cx="150" cy="205" rx="20" ry="10" fill="#f59e0b" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />

            {/* Vascular Pathways (Arterial & Venous Streamlines) */}
            <path d="M 152 154 L 152 260 L 140 340 L 138 420" stroke="url(#arteryGradient)" strokeWidth="2.5" fill="none" />
            <path d="M 148 154 L 148 260 L 160 340 L 162 420" stroke="url(#veinGradient)" strokeWidth="2.5" fill="none" />

            {/* Left Arm */}
            <path d="M 98 114 C 84 135, 74 190, 68 240 C 66 248, 76 250, 80 242 C 86 200, 96 145, 106 125 Z" fill="url(#bodySkinGradient)" />
            {/* Right Arm */}
            <path d="M 202 114 C 216 135, 226 190, 232 240 C 234 248, 224 250, 220 242 C 214 200, 204 145, 194 125 Z" fill="url(#bodySkinGradient)" />
            
            {/* Pelvis / Hips */}
            <path d="M 112 250 L 188 250 L 182 280 L 118 280 Z" fill="url(#bodySkinGradient)" />
            {/* Left Leg */}
            <path d="M 120 280 C 118 325, 120 375, 122 425 C 122 432, 132 432, 134 425 C 138 375, 140 325, 142 280 Z" fill="url(#bodySkinGradient)" />
            {/* Right Leg */}
            <path d="M 158 280 C 160 325, 162 375, 166 425 C 166 432, 176 432, 178 425 C 180 375, 182 325, 180 280 Z" fill="url(#bodySkinGradient)" />

            {/* Active Radar Scanner Rings */}
            <circle
              cx={activeHotspot.cx}
              cy={activeHotspot.cy}
              r="26"
              fill={activeHotspot.color}
              fillOpacity="0.18"
              stroke={activeHotspot.color}
              strokeWidth="2"
              strokeDasharray="5 3"
            />
            <circle
              cx={activeHotspot.cx}
              cy={activeHotspot.cy}
              r="34"
              fill="none"
              stroke={activeHotspot.color}
              strokeWidth="1"
              strokeOpacity="0.4"
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
                  {/* Outer pulse aura */}
                  <circle
                    cx={spot.cx}
                    cy={spot.cy}
                    r={isSelected ? 16 : 10}
                    fill={spot.color}
                    fillOpacity={isSelected ? 0.45 : 0.25}
                  />
                  {/* Central glowing core node */}
                  <circle
                    cx={spot.cx}
                    cy={spot.cy}
                    r={isSelected ? 9 : 6}
                    fill={spot.color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 3 : 2}
                    filter="url(#organGlow)"
                  />
                  {/* Active Crosshair Target */}
                  {isSelected && (
                    <>
                      <line
                        x1={spot.cx - 15}
                        y1={spot.cy}
                        x2={spot.cx + 15}
                        y2={spot.cy}
                        stroke={spot.color}
                        strokeWidth="2"
                      />
                      <line
                        x1={spot.cx}
                        y1={spot.cy - 15}
                        x2={spot.cx}
                        y2={spot.cy + 15}
                        stroke={spot.color}
                        strokeWidth="2"
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          <div style={{
            position: 'absolute',
            bottom: '12px',
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#1e293b',
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '4px 12px',
            borderRadius: '999px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Sparkles size={13} color="#2563eb" /> Click any organ node to focus
          </div>
        </div>

        {/* Organ System Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
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
                  borderLeft: `5px solid ${spot.color}`,
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected
                    ? `0 8px 20px ${spot.color}35`
                    : '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  position: 'relative'
                }}
              >
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '12px',
                    background: spot.color,
                    color: '#ffffff',
                    fontSize: '9.5px',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}>
                    Active Focus
                  </div>
                )}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: isSelected ? spot.gradient : spot.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: isSelected ? `0 4px 10px ${spot.color}40` : 'none',
                  transition: 'all 0.2s ease'
                }}>
                  <Icon size={20} color={isSelected ? '#ffffff' : spot.color} strokeWidth={2.4} />
                </div>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: isSelected ? spot.color : '#0f172a', lineHeight: '1.3' }}>
                    {spot.name}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '3px' }}>
                    Benchmark: <strong style={{ color: spot.color }}>{spot.tag}</strong>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '2px' }}>
                    {spot.system}
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
