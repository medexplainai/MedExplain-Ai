import React, { useState } from 'react';
import { Eye, FileText, Zap, Info, Award, Activity } from 'lucide-react';

export default function ExplainabilityHeatmap({ heatmapHtml, rawText, specialty, topDrivingKeywords = [] }) {
  const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap' or 'raw'

  return (
    <div className="card" style={{
      marginBottom: '24px',
      border: '1px solid #fed7aa',
      boxShadow: '0 4px 14px rgba(249, 115, 22, 0.06)'
    }}>
      {/* Header with Segmented Switcher */}
      <div className="card-header" style={{
        background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
        borderBottom: '1px solid #fed7aa',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div className="card-title" style={{ margin: 0 }}>
          <Zap size={18} color="#ea580c" />
          <span style={{ color: '#9a3412', fontWeight: 800 }}>
            Explainable AI (XAI): Token-Level Shapley Feature Attributions
          </span>
        </div>

        {/* Clean Segmented Tab Switcher */}
        <div style={{
          display: 'inline-flex',
          background: '#ffffff',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid #fdba74',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <button
            onClick={() => setViewMode('heatmap')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'heatmap' ? '#ea580c' : 'transparent',
              color: viewMode === 'heatmap' ? '#ffffff' : '#64748b',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Eye size={13} />
            <span>Feature Heatmap View</span>
          </button>
          <button
            onClick={() => setViewMode('raw')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'raw' ? '#ea580c' : 'transparent',
              color: viewMode === 'raw' ? '#ffffff' : '#64748b',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <FileText size={13} />
            <span>Raw Transcription View</span>
          </button>
        </div>
      </div>

      <div className="card-body" style={{ padding: '20px' }}>
        {/* Top Diagnostic Drivers Bar */}
        {topDrivingKeywords && topDrivingKeywords.length > 0 && (
          <div style={{
            background: '#ffffff',
            border: '1px solid #fed7aa',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
            boxShadow: '0 1px 4px rgba(234, 88, 12, 0.05)'
          }}>
            <div style={{
              fontSize: '11.5px',
              fontWeight: 800,
              color: '#c2410c',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Activity size={14} />
              <span>Primary Mathematical Feature Drivers ({specialty})</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {topDrivingKeywords.map((item, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#fff7ed',
                    border: '1px solid #fdba74',
                    color: '#9a3412',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{item.keyword}</span>
                  <span style={{ fontSize: '10.5px', color: '#ea580c', background: '#ffedd5', padding: '1px 5px', borderRadius: '4px' }}>
                    +{item.attribution_weight}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Shapley Legend & Interpretation Guide */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '10px 16px',
          marginBottom: '16px',
          fontSize: '12px',
          color: '#475569'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={15} color="#ea580c" />
            <span>
              Tokens highlighted in <strong>rose & crimson</strong> contributed the highest game-theoretic weight toward the <strong>{specialty}</strong> classification.
            </span>
          </div>

          {/* Color Gradient Scale Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600 }}>
            <span>Attribution Scale:</span>
            <span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', color: '#64748b' }}>Neutral</span>
            <span style={{ background: 'rgba(225, 29, 72, 0.25)', padding: '2px 6px', borderRadius: '4px', color: '#9f1239' }}>Moderate (+0.35)</span>
            <span style={{ background: 'rgba(225, 29, 72, 0.85)', padding: '2px 6px', borderRadius: '4px', color: '#ffffff', fontWeight: 700 }}>Critical (+0.85)</span>
          </div>
        </div>

        {/* Main Document Content View */}
        {viewMode === 'heatmap' ? (
          <div
            style={{
              lineHeight: '1.9',
              fontSize: '14px',
              color: '#1e293b',
              padding: '18px 20px',
              background: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              maxHeight: '440px',
              overflowY: 'auto',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
            }}
            dangerouslySetInnerHTML={{ __html: heatmapHtml || '<p>Heatmap computation complete.</p>' }}
          />
        ) : (
          <textarea
            readOnly
            value={rawText}
            style={{
              width: '100%',
              height: '380px',
              padding: '16px 20px',
              fontSize: '12.5px',
              fontFamily: 'JetBrains Mono, Consolas, monospace',
              color: '#334155',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              lineHeight: '1.65',
              resize: 'none'
            }}
          />
        )}
      </div>
    </div>
  );
}
