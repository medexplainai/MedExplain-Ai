import React from 'react';
import { User, Hash, Clock, MapPin, AlertCircle, FileText } from 'lucide-react';

export default function PatientDemographicsBanner({ patient, documentType, specialty }) {
  if (!patient) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      color: '#ffffff',
      borderRadius: '12px',
      padding: '16px 24px',
      marginBottom: '22px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '16px',
      boxShadow: '0 4px 12px rgba(30, 58, 138, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div>
        <div style={{ fontSize: '11px', color: '#bfdbfe', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
          <User size={12} /> Patient Name
        </div>
        <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '2px', color: '#ffffff' }}>
          {patient.name}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '11px', color: '#bfdbfe', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Hash size={12} /> Medical Record No.
        </div>
        <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px', fontFamily: 'JetBrains Mono, monospace', color: '#ffffff' }}>
          {patient.id}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '11px', color: '#bfdbfe', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Clock size={12} /> Age / Gender
        </div>
        <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px', color: '#ffffff' }}>
          {patient.age} yrs / {patient.gender}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '11px', color: '#bfdbfe', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={12} /> Clinical Ward
        </div>
        <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px', color: '#ffffff' }}>
          {patient.ward || 'Diagnostic Suite'}
        </div>
      </div>

      <div>
        <div style={{ fontSize: '11px', color: '#bfdbfe', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FileText size={12} /> Document Archetype
        </div>
        <div style={{ marginTop: '2px' }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 700
          }}>
            {documentType || 'Clinical Summary'}
          </span>
        </div>
      </div>
    </div>
  );
}
