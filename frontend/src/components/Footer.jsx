import React from 'react';
import { BookOpen, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onScrollToHowItWorks }) {
  return (
    <footer className="footer">
      <div className="app-container">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <BookOpen size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#1e1b4b', fontSize: '1rem' }}>
                Fable<span style={{ color: '#4f46e5' }}>STEM</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Learn STEM through stories. Deepen curiosity through books & discovery.
              </div>
            </div>
          </div>

          <div className="footer-links">
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); onScrollToHowItWorks(); }}>
              How It Works
            </a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} color="#10b981" /> Child-Safe
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span>STEM Discovery Hub</span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#4f46e5', fontWeight: 600 }}>
              <Sparkles size={14} /> Built with Gemini AI
            </span>
          </div>
        </div>

        <div className="footer-disclaimer">
          FableSTEM uses AI to create personalized educational content and deep-dive book recommendations. AI can make mistakes — always verify important facts with a teacher or trusted book. No personal data or cookies are stored.
        </div>
      </div>
    </footer>
  );
}
