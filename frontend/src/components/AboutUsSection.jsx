import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Users, 
  Building2, 
  CheckCircle2, 
  FileCheck2, 
  ExternalLink,
  ShieldCheck,
  Cpu,
  BrainCircuit,
  Sparkles
} from 'lucide-react';

export default function AboutUsSection() {
  const teamMembers = [
    { name: 'M. Deepika', rollNo: '23A51A4293', role: 'AI/ML Research & NLP Architecture' },
    { name: 'U. Girishma', rollNo: '23A51A42B7', role: 'Clinical Guardrails & NLI Cross-Encoders' },
    { name: 'T. Satvika', rollNo: '23A51A42B5', role: 'Patient Health Communication & Lexical Simplification' },
    { name: 'E. Jyothish Kumar', rollNo: '23A51A4275', role: 'Full-Stack Clinical Systems & XAI Attribution' },
  ];

  const researchPapers = [
    {
      id: 1,
      title: 'ClinicalBERT: Publicly Available Clinical BERT Embeddings',
      authors: 'Alsentzer et al.',
      venue: 'NAACL-ClinicalNLP',
      focus: 'Domain-adapted clinical representations trained on extensive MIMIC-III intensive care electronic health records, establishing foundational context for clinical entities.'
    },
    {
      id: 2,
      title: 'Med-HALT: Medical Multimodal Hallucination Test',
      authors: 'Umapathi et al.',
      venue: 'EMNLP',
      focus: 'Empirical benchmark demonstrating that standard autoregressive models exhibit 18-35% hallucination rates on clinical summaries, motivating mathematical closed-loop NLI guardrails.'
    }
  ];

  const contributions = [
    {
      title: 'Token-Level Shapley Attribution',
      desc: 'Eliminates black-box opacity through fine-grained token saliency attribution, providing clinicians with exact visual rationale for diagnostic specialty predictions.',
      tag: 'Explainable AI (XAI)'
    },
    {
      title: 'Closed-Loop DeBERTa-v3 NLI Guardrail',
      desc: 'Eradicates medical hallucinations by mathematically cross-verifying generated summaries against raw patient documents, blocking contradictory or ungrounded assertions prior to patient release.',
      tag: 'Clinical Safety'
    },
    {
      title: 'AMA Grade 6 Health Communication Synthesizer',
      desc: 'Translates dense inpatient medical terminology, complex lab panels, and pharmacotherapy instructions into accessible 6th-grade reading level summaries with clear medication schedules.',
      tag: 'Health Literacy'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0369a1 100%)',
        borderRadius: '16px',
        padding: '32px 36px',
        color: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            <GraduationCap size={16} />
            Academic Project Release • Team-8
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
            Department of Artificial Intelligence & Machine Learning
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.95, margin: 0, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Building2 size={18} />
            <span>Aditya Institute of Technology and Management</span>
            <span>•</span>
            <span style={{ color: '#bae6fd', fontWeight: 600 }}>Final Year Major Project</span>
          </p>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="card-title">
            <Users size={18} color="#2563eb" />
            <span>Project Engineering Team</span>
          </div>
          <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
            Team-8 Cohort
          </span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {teamMembers.map((member, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '15px',
                  flexShrink: 0,
                  boxShadow: '0 3px 8px rgba(37, 99, 235, 0.25)'
                }}>
                  {member.name.charAt(0)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                    {member.name}
                  </div>
                  <div style={{ 
                    fontFamily: 'JetBrains Mono, monospace', 
                    fontSize: '12.5px', 
                    color: '#2563eb', 
                    fontWeight: 700,
                    margin: '2px 0' 
                  }}>
                    {member.rollNo}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {member.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Base Research Papers & Key Contributions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Research Papers Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen size={18} color="#0891b2" />
              <span>Peer-Reviewed Base Research Papers</span>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {researchPapers.map((paper) => (
              <div 
                key={paper.id}
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', lineHeight: '1.4' }}>
                    {paper.id}. {paper.title}
                  </span>
                  <span style={{ 
                    background: '#e0f2fe', 
                    color: '#0284c7', 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    padding: '3px 8px', 
                    borderRadius: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    {paper.venue}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                  Authors: {paper.authors}
                </div>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                  {paper.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Research Contributions Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Award size={18} color="#059669" />
              <span>Key Research Contributions</span>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {contributions.map((c, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    {c.title}
                  </span>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    background: '#ecfdf5',
                    color: '#047857',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    border: '1px solid #a7f3d0'
                  }}>
                    {c.tag}
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: '1.55', paddingLeft: '24px' }}>
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
