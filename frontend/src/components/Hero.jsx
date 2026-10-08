import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, BrainCircuit } from 'lucide-react';

export default function Hero({ onStartLearning, onScrollToHowItWorks }) {
  return (
    <section className="hero">
      {/* Official fableSTEAM Logo Showcase */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem'
      }}>
        <div style={{
          background: 'linear-gradient(145deg, #05070f 0%, #0f172a 100%)',
          borderRadius: '20px',
          padding: '8px 18px 8px 10px',
          border: '1px solid #1e293b',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2), 0 0 25px rgba(56, 189, 248, 0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <img 
            src="/logo.png" 
            alt="fableSTEAM" 
            style={{
              height: '46px',
              width: '46px',
              objectFit: 'contain',
              borderRadius: '8px'
            }} 
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.15
            }}>
              fable<span style={{ color: '#38bdf8' }}>STEAM</span>
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: '#94a3b8',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Science • Tech • Eng • Art • Math
            </div>
          </div>
        </div>
      </div>

      <div className="hero-pill">
        <Sparkles size={16} /> Powered by Google Gemini AI
      </div>

      <h1 className="hero-title">
        Learn through stories.<br />
        <span className="hero-title-highlight">Understand through curiosity.</span>
      </h1>

      <p className="hero-subtitle">
        <strong>FableSTEM</strong> turns any science, math, nature, or life-skills topic into an enchanting story written just for your age — with comprehension quizzes, 3D phonics, and curated book deep-dives on Amazon, Flipkart, & Google!
      </p>

      <div className="hero-cta-group">
        <button className="btn btn-primary btn-lg" onClick={onStartLearning}>
          Start Learning <ArrowRight size={18} />
        </button>
        <button className="btn btn-secondary btn-lg" onClick={onScrollToHowItWorks}>
          How It Works
        </button>
      </div>

      <div className="trust-badges">
        <div className="trust-item">
          <ShieldCheck size={16} color="#10b981" /> Child-Safe & Filtered
        </div>
        <div className="trust-item">
          <BrainCircuit size={16} color="#6366f1" /> Age-Tailored Vocabulary
        </div>
        <div className="trust-item">
          <HeartHandshake size={16} color="#f59e0b" /> No Personal Data Stored
        </div>
      </div>
    </section>
  );
}
