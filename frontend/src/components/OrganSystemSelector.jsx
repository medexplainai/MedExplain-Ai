import React from 'react';
import { HeartPulse, Brain, Bone, Activity, Wind, FlaskConical } from 'lucide-react';

const ORGAN_SYSTEMS = [
  {
    id: 'Cardiology',
    name: 'Cardiovascular',
    organ: 'Heart & Coronary Vessels',
    icon: HeartPulse,
    color: '#ef4444',
    bg: '#fef2f2',
    borderColor: '#fecaca',
    badge: 'CCU / Cath Lab',
    sampleKey: 'Cardiology: Acute Myocardial Ischemia'
  },
  {
    id: 'Neurology',
    name: 'Neurological',
    organ: 'Brain & Cerebrovascular',
    icon: Brain,
    color: '#8b5cf6',
    bg: '#faf5ff',
    borderColor: '#e9d5ff',
    badge: 'Neuro ICU',
    sampleKey: 'Neurology: Acute Ischemic Stroke Evaluation'
  },
  {
    id: 'Orthopedics',
    name: 'Musculoskeletal',
    organ: 'Knee & Joint Cartilage',
    icon: Bone,
    color: '#0ea5e9',
    bg: '#f0f9ff',
    borderColor: '#bae6fd',
    badge: 'Ortho Surgery',
    sampleKey: 'Orthopedics: Right Knee Meniscal Tear'
  },
  {
    id: 'Endocrinology',
    name: 'Endocrine & Metabolic',
    organ: 'Pancreas & Glycemic Regulation',
    icon: Activity,
    color: '#f59e0b',
    bg: '#fffbeb',
    borderColor: '#fde68a',
    badge: 'Diabetes Unit',
    sampleKey: 'Endocrinology: Type 2 Diabetes with Neuropathy'
  },
  {
    id: 'Pulmonology',
    name: 'Respiratory & Lungs',
    organ: 'Lobar Parenchyma & Pleura',
    icon: Wind,
    color: '#06b6d4',
    bg: '#ecfeff',
    borderColor: '#a5f3fc',
    badge: 'Pulmonary Care',
    sampleKey: 'Radiology & Imaging Report: High-Resolution Chest CT Scan'
  },
  {
    id: 'Pathology',
    name: 'Clinical Pathology',
    organ: 'Blood, Enzymes & Metabolic Panels',
    icon: FlaskConical,
    color: '#10b981',
    bg: '#ecfdf5',
    borderColor: '#a7f3d0',
    badge: 'Diagnostic Labs',
    sampleKey: 'Diagnostic Laboratory Report: Blood & Metabolic Panel'
  }
];

export default function OrganSystemSelector({ activeSpecialty, onSelectSystem }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px 20px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Interactive Anatomical & Organ System Navigator
          </span>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
            Select an anatomical system or clinical specialty to load verified benchmark clinical cases:
          </p>
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#2563eb',
          background: '#eff6ff',
          padding: '3px 10px',
          borderRadius: '999px',
          border: '1px solid #dbeafe'
        }}>
          Multi-Specialty Engine Active
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px'
      }}>
        {ORGAN_SYSTEMS.map((sys) => {
          const Icon = sys.icon;
          const isSelected = activeSpecialty === sys.id || (activeSpecialty === 'Cardiology' && sys.id === 'Cardiology');
          return (
            <button
              key={sys.id}
              onClick={() => onSelectSystem(sys.sampleKey, sys.id)}
              style={{
                background: isSelected ? sys.bg : '#ffffff',
                border: `2px solid ${isSelected ? sys.color : '#e2e8f0'}`,
                borderRadius: '10px',
                padding: '12px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                transition: 'all 0.18s ease',
                boxShadow: isSelected ? `0 4px 12px ${sys.color}22` : 'none'
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: isSelected ? sys.color : sys.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={20} color={isSelected ? '#ffffff' : sys.color} strokeWidth={2.2} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: isSelected ? sys.color : '#1e293b',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}>
                  {sys.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}>
                  {sys.organ}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
