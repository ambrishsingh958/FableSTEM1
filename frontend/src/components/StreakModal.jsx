import React from 'react';
import { X, Flame, CheckCircle2, Calendar, Award, Sparkles, Trophy } from 'lucide-react';
import { playClickSound, playSuccessChime } from '../services/soundEffects';

export default function StreakModal({ streak = 3, onClose, onAddXp }) {
  const days = [
    { day: "Mon", completed: true },
    { day: "Tue", completed: true },
    { day: "Wed", completed: true },
    { day: "Thu", completed: false, isToday: true },
    { day: "Fri", completed: false },
    { day: "Sat", completed: false },
    { day: "Sun", completed: false }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '520px', 
          width: '95%', 
          padding: '2rem', 
          borderRadius: '24px',
          textAlign: 'center'
        }}
      >
        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-icon" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Flame Banner */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ffedd5, #fed7aa)',
          border: '3px solid #fb923c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: '0 8px 24px rgba(249, 115, 22, 0.25)',
          animation: 'pulseScale 2s infinite ease-in-out'
        }}>
          <Flame size={38} color="#ea580c" fill="#ea580c" />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b', marginBottom: '0.35rem' }}>
          {streak}-Day Learning Streak! 🔥
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
          You're on fire! Reading a story every day builds powerful STEM vocabulary and memory.
        </p>

        {/* Weekly Day Tracker */}
        <div style={{
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: '18px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            This Week's Reading Streak
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
            {days.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: d.completed ? '#ea580c' : d.isToday ? '#fed7aa' : '#f1f5f9',
                  border: d.isToday ? '2px dashed #f97316' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: d.completed ? 'white' : d.isToday ? '#c2410c' : '#94a3b8',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}>
                  {d.completed ? <CheckCircle2 size={18} /> : d.day.slice(0, 1)}
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: d.isToday ? '#c2410c' : '#64748b' }}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Box */}
        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: '16px',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textAlign: 'left',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b45309',
            flexShrink: 0
          }}>
            <Trophy size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#92400e' }}>
              Next Goal: 5-Day Streak (+100 XP)
            </div>
            <div style={{ fontSize: '0.78rem', color: '#78350f' }}>
              Read 2 more stories on consecutive days to unlock the "Streak Champion" medal!
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            playClickSound();
            onClose();
          }}
          style={{ width: '100%', borderRadius: '14px', padding: '0.75rem' }}
        >
          Keep the Fire Burning! 🚀
        </button>
      </div>
    </div>
  );
}
