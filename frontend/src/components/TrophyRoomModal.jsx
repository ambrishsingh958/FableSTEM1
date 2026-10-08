import React from 'react';
import { X, Trophy, Award, Lock, Sparkles, Star, Flame } from 'lucide-react';
import { playClickSound, playSuccessChime } from '../services/soundEffects';

const TROPHIES = [
  {
    id: 1,
    icon: "🏆",
    title: "Curious Pioneer",
    desc: "Read your very first story and sparked your curiosity!",
    unlocked: true,
    category: "Milestone",
    xpReward: 50
  },
  {
    id: 2,
    icon: "⚡",
    title: "Lightning Brain",
    desc: "Scored 100% on an educational comprehension quiz!",
    unlocked: true,
    category: "Mastery",
    xpReward: 100
  },
  {
    id: 3,
    icon: "🎙️",
    title: "Voice Explorer",
    desc: "Used the microphone to answer quiz questions with speech!",
    unlocked: true,
    category: "Tech",
    xpReward: 30
  },
  {
    id: 4,
    icon: "🎨",
    title: "Storybook Illustrator",
    desc: "Created and downloaded a custom story doodle artwork!",
    unlocked: true,
    category: "Art",
    xpReward: 40
  },
  {
    id: 5,
    icon: "🧭",
    title: "Pathfinder",
    desc: "Chose a custom story branch in Choose Your Own Adventure!",
    unlocked: true,
    category: "Adventure",
    xpReward: 25
  },
  {
    id: 6,
    icon: "👑",
    title: "Grand Storymaster",
    desc: "Reach 1,000 Total Learner Experience Points!",
    unlocked: false,
    progress: "350 / 1000 XP",
    category: "Legendary",
    xpReward: 250
  }
];

export default function TrophyRoomModal({ user, xp = 350, onClose }) {
  const handleTrophyClick = (trophy) => {
    if (trophy.unlocked) {
      playSuccessChime();
    } else {
      playClickSound();
    }
  };

  return (
    <div className="certificate-modal-overlay">
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '680px',
        width: '100%',
        padding: '2rem',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
          title="Close"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)'
          }}>
            <Trophy size={28} />
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#1e1b4b', marginBottom: '0.25rem' }}>
            Hall of Fame & Trophy Room
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Unlocked trophies for {user?.name || "Curious Learner"} • Tap any trophy to celebrate!
          </p>
        </div>

        {/* Trophies Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {TROPHIES.map((t) => (
            <div
              key={t.id}
              onClick={() => handleTrophyClick(t)}
              style={{
                border: t.unlocked ? '2px solid #fde68a' : '1px dashed #cbd5e1',
                background: t.unlocked ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : '#f8fafc',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                opacity: t.unlocked ? 1 : 0.65,
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (t.unlocked) e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
              }}
              role="button"
              tabIndex={0}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.35rem' }}>
                {t.icon}
              </div>

              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: t.unlocked ? '#92400e' : '#64748b', marginBottom: '0.25rem' }}>
                {t.title}
              </div>

              <div style={{ fontSize: '0.75rem', color: t.unlocked ? '#78350f' : '#94a3b8', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                {t.desc}
              </div>

              {t.unlocked ? (
                <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                  ✓ Unlocked (+{t.xpReward} XP)
                </span>
              ) : (
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={11} /> {t.progress}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Back to Learning
          </button>
        </div>
      </div>
    </div>
  );
}
