import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function CollegeTeamFooter({ onOpenAbout }) {
  return (
    <footer style={{
      marginTop: '40px',
      padding: '16px 24px',
      borderTop: '1px solid #e2e8f0',
      background: '#ffffff',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      fontSize: '12px',
      color: '#64748b',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldCheck size={16} color="#059669" />
        <span style={{ fontWeight: 600, color: '#334155' }}>
          MetroHealth Clinical AI Decision Support System
        </span>
        <span style={{ color: '#cbd5e1' }}>•</span>
        <span>JNTU College of Engineering</span>
      </div>

      <div>
        {onOpenAbout && (
          <button
            onClick={onOpenAbout}
            style={{
              background: 'transparent',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#2563eb',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              transition: 'all 0.15s ease'
            }}
          >
            <GraduationCap size={15} color="#2563eb" />
            <span>About Academic Project (Team-8)</span>
          </button>
        )}
      </div>
    </footer>
  );
}
