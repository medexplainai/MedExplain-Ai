import React, { useState } from 'react';
import { Eye, Zap, Info, Sliders } from 'lucide-react';

export default function ExplainabilityHeatmap({ heatmapHtml, rawText, specialty }) {
  const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap' or 'raw'

  return (
    <div className="card" style={{ marginBottom: '24px' }}>
      <div className="card-header">
        <div className="card-title">
          <Zap size={17} color="#d97706" />
          <span>Explainable AI (XAI): Token-Level Shapley Feature Attributions</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setViewMode('heatmap')}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: `1px solid ${viewMode === 'heatmap' ? '#2563eb' : '#cbd5e1'}`,
              background: viewMode === 'heatmap' ? '#eff6ff' : '#ffffff',
              color: viewMode === 'heatmap' ? '#1d4ed8' : '#64748b',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            SHAP Attribution Heatmap
          </button>
          <button
            onClick={() => setViewMode('raw')}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              border: `1px solid ${viewMode === 'raw' ? '#2563eb' : '#cbd5e1'}`,
              background: viewMode === 'raw' ? '#eff6ff' : '#ffffff',
              color: viewMode === 'raw' ? '#1d4ed8' : '#64748b',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Raw Clinical Note
          </button>
        </div>
      </div>

      <div className="card-body">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '8px',
          padding: '10px 14px',
          marginBottom: '14px',
          fontSize: '12px',
          color: '#92400e'
        }}>
          <Info size={15} color="#d97706" style={{ flexShrink: 0 }} />
          <span>
            <strong>Shapley Attribution Interpretation:</strong> Words highlighted in red/amber mathematically contributed the highest diagnostic weight toward the <strong>{specialty}</strong> classification. Hover over highlighted tokens to inspect feature weights.
          </span>
        </div>

        {viewMode === 'heatmap' ? (
          <div
            style={{
              lineHeight: '1.9',
              fontSize: '13.5px',
              color: '#1e293b',
              padding: '14px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              maxHeight: '380px',
              overflowY: 'auto'
            }}
            dangerouslySetInnerHTML={{ __html: heatmapHtml || '<p>Heatmap computation complete.</p>' }}
          />
        ) : (
          <textarea
            readOnly
            value={rawText}
            style={{
              width: '100%',
              height: '320px',
              padding: '14px',
              fontSize: '12.5px',
              fontFamily: 'JetBrains Mono, monospace',
              color: '#334155',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              lineHeight: '1.6',
              resize: 'none'
            }}
          />
        )}
      </div>
    </div>
  );
}
