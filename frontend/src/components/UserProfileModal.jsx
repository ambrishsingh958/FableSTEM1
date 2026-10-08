import React from 'react';
import { X, Award, Flame, Star, LogOut, GraduationCap, BookOpen, CheckCircle } from 'lucide-react';
import { playClickSound } from '../services/soundEffects';

export default function UserProfileModal({ user, onLogout, onOpenTeacherMode, onClose }) {
  if (!user) return null;

  const isTeacher = user.role === 'teacher';
  const xp = user.xp || 250;
  const nextLevelXp = 500;
  const progressPercent = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  return (
    <div className="certificate-modal-overlay">
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '540px',
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

        {/* User Card Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            background: isTeacher ? '#fee2e2' : '#ede9fe',
            border: isTeacher ? '2px solid #fca5a5' : '2px solid #a5b4fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.4rem'
          }}>
            {user.avatar || (isTeacher ? "🍎" : "🦉")}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b' }}>
                {user.name}
              </h2>
              <span className={`badge ${isTeacher ? 'badge-amber' : 'badge-indigo'}`}>
                {isTeacher ? "🍎 Teacher" : "🎒 Student"}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {user.grade_or_class || (isTeacher ? "Classroom Educator" : "Elementary Learner")}
            </div>
            {user.email && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.78rem',
                color: '#059669',
                fontWeight: 600,
                marginTop: '3px'
              }}>
                <CheckCircle size={12} color="#10b981" /> {user.email} (Google Verified)
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            background: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Star size={20} fill="#f59e0b" color="#f59e0b" /> {xp}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e' }}>
              Total Learner XP
            </div>
          </div>

          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Flame size={20} fill="#ef4444" color="#ef4444" /> {user.streak || 4} Days
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991b1b' }}>
              Curiosity Streak
            </div>
          </div>
        </div>

        {/* Level Progress */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span>Level 2: Curious Explorer</span>
            <span>{xp} / {nextLevelXp} XP</span>
          </div>
          <div style={{
            height: '8px',
            background: '#e2e8f0',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
              borderRadius: '999px'
            }} />
          </div>
        </div>

        {/* Badges Collection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={18} color="#f59e0b" /> Earned Badges & Medals
          </h3>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {(user.badges || ["Story Pioneer 📖", "Water Detective 🌊", "Quiz Champion 🏆"]).map((b, i) => (
              <span key={i} className="badge badge-purple" style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Teacher actions if role is teacher */}
        {isTeacher && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e1b4b', marginBottom: '0.35rem' }}>
              Classroom Management:
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Ready to print customized worksheets and test questions for your students.
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                onClose();
                if (onOpenTeacherMode) onOpenTeacherMode();
              }}
            >
              <GraduationCap size={15} /> Open Teacher Worksheet Planner
            </button>
          </div>
        )}

        {/* Log out / Switch account */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border)',
          paddingTop: '1rem'
        }}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ color: '#ef4444' }}
            onClick={() => {
              playClickSound();
              onLogout();
              onClose();
            }}
          >
            <LogOut size={14} /> Log Out
          </button>

          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
