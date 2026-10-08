import React from 'react';
import { Compass, BookOpen, HelpCircle, Trophy } from 'lucide-react';

const STEPS = [
  {
    num: "01",
    title: "Choose",
    desc: "Pick any topic you want to learn, your age group, and your preferred language.",
    icon: Compass,
    color: "#4f46e5",
    bg: "#e0e7ff"
  },
  {
    num: "02",
    title: "Discover",
    desc: "Gemini crafts an original story shaped to your exact vocabulary and reading level.",
    icon: BookOpen,
    color: "#7c3aed",
    bg: "#ede9fe"
  },
  {
    num: "03",
    title: "Play",
    desc: "Challenge yourself with an interactive 5-question comprehension quiz.",
    icon: HelpCircle,
    color: "#f59e0b",
    bg: "#fef3c7"
  },
  {
    num: "04",
    title: "Grow",
    desc: "Receive friendly AI teacher feedback, score analysis, and celebrate your achievement!",
    icon: Trophy,
    color: "#10b981",
    bg: "#d1fae5"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ margin: '3rem 0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          How FableSTEM Works
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>
          A simple 4-step learning adventure designed to spark curiosity and build deep comprehension.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div 
              key={step.num}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: step.bg,
                  color: step.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} />
                </div>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  fontSize: '1.5rem',
                  color: '#cbd5e1'
                }}>
                  {step.num}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
