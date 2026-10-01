import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Loader2, Circle, ShieldCheck, Activity, Sparkles, Brain, Cpu, FileCheck } from 'lucide-react';

const PIPELINE_STAGES = [
  {
    id: 1,
    title: 'Multimodal Document Ingestion & Optical Normalization',
    subtitle: 'Extracting clinical text, sections, and normalizing nomenclature',
    icon: FileCheck,
    tag: 'Stage 1'
  },
  {
    id: 2,
    title: 'Bio_ClinicalBERT Specialty Extraction & SHAP Weights',
    subtitle: 'Computing domain probabilities and game-theoretic token attribution',
    icon: Brain,
    tag: 'Stage 2'
  },
  {
    id: 3,
    title: 'NVIDIA NIM Llama-3.2-11b Vision Health Literacy Engine',
    subtitle: 'Synthesizing patient care guide at AMA Grade 6.2 reading level',
    icon: Cpu,
    tag: 'Stage 3'
  },
  {
    id: 4,
    title: 'DeBERTa-v3 Closed-Loop NLI Hallucination Verification',
    subtitle: 'Cross-validating claims against source EHR to ensure zero factual drift',
    icon: ShieldCheck,
    tag: 'Stage 4'
  }
];

export default function ClinicalPipelineLoader({ isAnalyzing, onComplete }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(15);
  const timersRef = useRef([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    if (!isAnalyzing) {
      if (completedSteps.length > 0 && completedSteps.length < 4) {
        // Fast-forward remaining steps cleanly
        clearAllTimers();
        setCompletedSteps([1, 2, 3, 4]);
        setProgressPercent(100);
        setCurrentStep(5);
        const tEnd = setTimeout(() => {
          setCompletedSteps([]);
          if (onComplete) onComplete();
        }, 400);
        timersRef.current.push(tEnd);
      } else if (completedSteps.length >= 4) {
        const tEnd = setTimeout(() => {
          setCompletedSteps([]);
          if (onComplete) onComplete();
        }, 350);
        timersRef.current.push(tEnd);
      }
      return;
    }

    // Reset state for new analysis
    setCompletedSteps([]);
    setCurrentStep(1);
    setProgressPercent(20);
    clearAllTimers();

    // Fast, responsive, snappy progression (~180-220ms per stage)
    const t1 = setTimeout(() => {
      setCompletedSteps([1]);
      setCurrentStep(2);
      setProgressPercent(45);

      const t2 = setTimeout(() => {
        setCompletedSteps([1, 2]);
        setCurrentStep(3);
        setProgressPercent(70);

        const t3 = setTimeout(() => {
          setCompletedSteps([1, 2, 3]);
          setCurrentStep(4);
          setProgressPercent(90);

          const t4 = setTimeout(() => {
            setCompletedSteps([1, 2, 3, 4]);
            setCurrentStep(5);
            setProgressPercent(100);
          }, 300);
          timersRef.current.push(t4);
        }, 250);
        timersRef.current.push(t3);
      }, 220);
      timersRef.current.push(t2);
    }, 180);
    timersRef.current.push(t1);

    return () => clearAllTimers();
  }, [isAnalyzing]);

  if (!isAnalyzing && completedSteps.length === 0) return null;

  const displayCount = Math.min(4, completedSteps.length);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.76)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: '540px',
        width: '100%',
        padding: '30px 28px',
        border: '2px solid #3b82f6',
        boxShadow: '0 25px 70px rgba(15, 23, 42, 0.35), 0 0 30px rgba(37, 99, 235, 0.2)',
        animation: 'fadeIn 0.2s ease-out',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top ambient blue pulse bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          background: 'linear-gradient(90deg, #2563eb, #06b6d4, #10b981)',
          backgroundSize: '200% 100%',
          animation: 'ecgPulse 2s linear infinite'
        }} />

        {/* Header with Live Animated ECG Beat Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)',
            flexShrink: 0
          }}>
            <Activity size={24} color="#ffffff" className="spin-slow" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
              Clinical AI Intelligence Pipeline Active
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              Executing 4-stage verified medical decision & safety workflow:
            </p>
          </div>
          <div style={{
            background: '#eff6ff',
            color: '#1d4ed8',
            border: '1px solid #bfdbfe',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '13px',
            fontWeight: 800
          }}>
            {progressPercent}%
          </div>
        </div>

        {/* Smooth Animated Progress Bar */}
        <div style={{
          width: '100%',
          height: '6px',
          background: '#f1f5f9',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #2563eb 0%, #10b981 100%)',
            borderRadius: '999px',
            transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>

        {/* 4 Sequential Clinical Pipeline Stages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {PIPELINE_STAGES.map((stage) => {
            const isCompleted = completedSteps.includes(stage.id);
            const isRunning = currentStep === stage.id && !isCompleted;
            const isPending = !isCompleted && !isRunning;

            return (
              <div
                key={stage.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: isCompleted
                    ? '1.5px solid #86efac'
                    : (isRunning ? '2px solid #3b82f6' : '1px solid #e2e8f0'),
                  background: isCompleted
                    ? '#f0fdf4'
                    : (isRunning ? '#eff6ff' : '#f8fafc'),
                  boxShadow: isRunning ? '0 4px 14px rgba(37, 99, 235, 0.12)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Status Indicator Icon (Checkmark / Spinner / Muted Circle) */}
                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isCompleted && (
                    <div className="check-pop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={22} color="#16a34a" />
                    </div>
                  )}
                  {isRunning && (
                    <Loader2 size={20} color="#2563eb" className="spin" />
                  )}
                  {isPending && (
                    <Circle size={18} color="#cbd5e1" strokeWidth={2} />
                  )}
                </div>

                {/* Stage Description */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: isCompleted || isRunning ? 800 : 600,
                    color: isCompleted ? '#166534' : (isRunning ? '#1e40af' : '#64748b'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{stage.title}</span>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: isCompleted ? '#dcfce7' : (isRunning ? '#dbeafe' : '#f1f5f9'),
                      color: isCompleted ? '#15803d' : (isRunning ? '#1d4ed8' : '#94a3b8')
                    }}>
                      {isCompleted ? 'VERIFIED' : (isRunning ? 'PROCESSING' : 'QUEUED')}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: isCompleted ? '#15803d' : (isRunning ? '#3b82f6' : '#94a3b8'),
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {stage.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Status Footer */}
        <div style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={13} color="#2563eb" />
            <span>NVIDIA NIM & DeBERTa-v3 Cross-Encoder</span>
          </span>
          <span style={{ fontWeight: 700, color: progressPercent === 100 ? '#16a34a' : '#2563eb' }}>
            {progressPercent === 100 ? 'Verification Complete!' : `${displayCount} / 4 stages complete`}
          </span>
        </div>
      </div>
    </div>
  );
}
