import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, BrainCircuit } from 'lucide-react';

export default function Hero({ onStartLearning, onScrollToHowItWorks }) {
  return (
    <section className="hero">
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
