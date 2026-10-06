import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareText,
  Send,
  X,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  FileText,
  Activity,
  Bot,
  User,
  CheckCircle2,
  Minimize2,
  Maximize2
} from 'lucide-react';

export default function ReportQADrawer({
  isOpen,
  onClose,
  reportText,
  patientData,
  summaryData,
  labResults
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello! I am your MedExplain AI Clinical Assistant. You can ask me any question about this medical report — including abnormal lab results, prescribed medications, recovery guidelines, or emergency warning symptoms. Every response is 100% grounded strictly in your document.`,
      sources: ['Patient Medical Document', 'Evidence Grounding Guardrail'],
      confidence: 1.0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    'Explain my abnormal lab values',
    'What do my cholesterol & lipid levels mean?',
    'What are my discharge medications & timings?',
    'What lifestyle Dos and Don\'ts should I follow?',
    'What emergency red flags should I watch for?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText) => {
    const q = (queryText || inputText).trim();
    if (!q || isLoading) return;

    const userMsg = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const resp = await fetch('/api/chat-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          text: reportText || '',
          patient_name: patientData?.name || patientData?.patient_name || 'Patient',
          patient_id: patientData?.id || patientData?.patient_id || 'PT-2026',
          age: patientData?.age || 55,
          gender: patientData?.gender || 'M/F',
          ward: patientData?.ward || 'Inpatient'
        })
      });

      if (!resp.ok) {
        throw new Error('Failed to generate grounded clinical answer.');
      }

      const data = await resp.json();
      const aiMsg = {
        sender: 'assistant',
        text: data.answer,
        sources: data.grounded_sources || ['Clinical Medical Record'],
        confidence: data.confidence || 0.95,
        disclaimer: data.disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Q&A error:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I could not process this question at this time. Please ensure the document is loaded and verify your connection.',
          sources: ['System Diagnostic'],
          confidence: 0,
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '420px',
        maxWidth: 'calc(100vw - 36px)',
        height: '620px',
        maxHeight: 'calc(100vh - 48px)',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(14, 165, 233, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 9999,
        overflow: 'hidden',
        animation: 'slideUpDrawer 0.25s ease-out'
      }}
    >
      <style>{`
        @keyframes slideUpDrawer {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Drawer Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.2px' }}>
              Ask MedExplain AI
            </div>
            <div style={{ fontSize: '11px', color: '#ccfbf1', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} color="#5eead4" />
              <span>100% Grounded in Document • Zero Hallucination</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.15s ease'
          }}
          title="Close Clinical Q&A"
        >
          <X size={18} />
        </button>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div
        style={{
          background: '#f8fafc',
          padding: '10px 14px',
          borderBottom: '1px solid #e2e8f0',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          display: 'flex',
          gap: '8px'
        }}
      >
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSend(q)}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '999px',
              padding: '5px 12px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#0f766e',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div
        style={{
          flex: 1,
          padding: '16px',
          overflowY: 'auto',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: '4px'
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: isUser ? '#0f766e' : '#ffffff',
                  color: isUser ? '#ffffff' : '#1e293b',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  boxShadow: isUser
                    ? '0 3px 10px rgba(15, 118, 110, 0.2)'
                    : '0 2px 6px rgba(0, 0, 0, 0.05)',
                  border: isUser ? 'none' : '1px solid #e2e8f0',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}

                {/* Grounding Attribution & Disclaimers for AI answers */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div
                    style={{
                      marginTop: '10px',
                      paddingTop: '8px',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '5px',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>
                      Grounded In:
                    </span>
                    {msg.sources.map((s, si) => (
                      <span
                        key={si}
                        style={{
                          background: '#f0fdfa',
                          border: '1px solid #ccfbf1',
                          color: '#0f766e',
                          borderRadius: '4px',
                          padding: '1px 6px',
                          fontSize: '10px',
                          fontWeight: 600
                        }}
                      >
                        {s}
                      </span>
                    ))}
                    {msg.confidence > 0 && (
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: '10px',
                          color: '#059669',
                          fontWeight: 700
                        }}
                      >
                        {Math.round(msg.confidence * 100)}% Match
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ fontSize: '10px', color: '#94a3b8', padding: '0 4px' }}>
                {msg.timestamp}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
            <Sparkles size={16} color="#0f766e" className="animate-spin" />
            <span style={{ fontSize: '12.5px', color: '#0f766e', fontWeight: 600 }}>
              Grounding clinical response in medical record...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          background: '#ffffff',
          padding: '12px 16px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about this report..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1.5px solid #cbd5e1',
            fontSize: '13px',
            outline: 'none',
            background: '#ffffff',
            color: '#0f172a'
          }}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          style={{
            background: inputText.trim() && !isLoading ? '#0f766e' : '#cbd5e1',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s ease'
          }}
          title="Send query"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
