import React, { useState } from 'react';
import { X, UserPlus, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { playClickSound, playSuccessChime } from '../services/soundEffects';

// Official multi-color Google 'G' icon SVG
export function GoogleIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function GoogleAuthModal({ onSelectGoogleAccount, onClose }) {
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customRole, setCustomRole] = useState("student");
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const GOOGLE_ACCOUNTS = [
    {
      id: "acc_1",
      name: "Alex Chen",
      email: "alex.chen.student@gmail.com",
      role: "student",
      avatar: "🚀",
      grade: "Grade 3",
      xp: 320,
      streak: 4,
      bg: "#e0f2fe",
      color: "#0369a1"
    },
    {
      id: "acc_2",
      name: "Ms. Jennifer Davis",
      email: "jennifer.davis.edu@gmail.com",
      role: "teacher",
      avatar: "🍎",
      grade: "Lincoln Elementary (Educator)",
      xp: 850,
      streak: 15,
      bg: "#fee2e2",
      color: "#b91c1c"
    },
    {
      id: "acc_3",
      name: "Sarah Jenkins (Parent)",
      email: "sarah.jenkins.family@gmail.com",
      role: "parent",
      avatar: "🏡",
      grade: "Parent Observer",
      xp: 180,
      streak: 3,
      bg: "#fef3c7",
      color: "#b45309"
    }
  ];

  const handleSelect = (account) => {
    playClickSound();
    setSelectedId(account.id);
    setIsConnecting(true);

    setTimeout(() => {
      playSuccessChime();
      onSelectGoogleAccount({
        name: account.name,
        email: account.email,
        role: account.role,
        avatar: account.avatar,
        grade_or_class: account.grade,
        xp: account.xp,
        streak: account.streak,
        isGoogle: true,
        badges: ["Google Verified 🛡️", "Story Pioneer 📖", "Quiz Champion 🏆"]
      });
      onClose();
    }, 700);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;

    playClickSound();
    setIsConnecting(true);

    setTimeout(() => {
      playSuccessChime();
      onSelectGoogleAccount({
        name: customName.trim(),
        email: customEmail.trim(),
        role: customRole,
        avatar: customRole === 'teacher' ? '🍎' : customRole === 'parent' ? '🏡' : '🌟',
        grade_or_class: customRole === 'teacher' ? 'Educator' : 'Student',
        xp: 250,
        streak: 3,
        isGoogle: true,
        badges: ["Google Verified 🛡️", "Active Learner 🌟"]
      });
      onClose();
    }, 700);
  };

  return (
    <div className="certificate-modal-overlay">
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        maxWidth: '460px',
        width: '100%',
        padding: '2rem 1.75rem',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.25)',
        position: 'relative',
        fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
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
            color: '#5f6368'
          }}
          title="Cancel"
        >
          <X size={20} />
        </button>

        {/* Google Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <GoogleIcon size={36} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#202124', marginBottom: '0.35rem' }}>
            Sign in with Google
          </h2>
          <div style={{ fontSize: '0.9rem', color: '#5f6368' }}>
            Choose an account to continue to <strong>FableSTEM</strong>
          </div>
        </div>

        {isConnecting ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #e8eaed',
              borderTopColor: '#4285F4',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'googleSpin 0.8s linear infinite'
            }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 500, color: '#202124' }}>
              Signing in with Google...
            </div>
            <style>{`
              @keyframes googleSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : !isCustom ? (
          <>
            {/* Account List */}
            <div style={{
              borderTop: '1px solid #e8eaed',
              borderBottom: '1px solid #e8eaed',
              marginBottom: '1.25rem'
            }}>
              {GOOGLE_ACCOUNTS.map((acc) => (
                <div
                  key={acc.id}
                  onClick={() => handleSelect(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.85rem 0.5rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f1f3f4',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  role="button"
                  tabIndex={0}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: acc.bg,
                    color: acc.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {acc.avatar}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#202124' }}>
                        {acc.name}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        background: '#e8eaed',
                        color: '#3c4043',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        {acc.role}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#5f6368', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {acc.email}
                    </div>
                  </div>

                  <ArrowRight size={16} color="#5f6368" />
                </div>
              ))}

              {/* Add Custom Google Account button */}
              <div
                onClick={() => {
                  playClickSound();
                  setIsCustom(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 0.5rem',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                role="button"
                tabIndex={0}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#f1f3f4',
                  color: '#5f6368',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <UserPlus size={20} />
                </div>
                <div style={{ flex: 1, fontWeight: 500, fontSize: '0.92rem', color: '#1a73e8' }}>
                  Use another Google account
                </div>
              </div>
            </div>

            {/* Google privacy fine print */}
            <div style={{ fontSize: '0.75rem', color: '#5f6368', lineHeight: 1.5, textAlign: 'center' }}>
              To continue, Google will share your name, email address, language preference, and profile picture with <strong>FableSTEM</strong>.
            </div>
          </>
        ) : (
          /* Custom Google Account Form */
          <form onSubmit={handleCustomSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#3c4043', marginBottom: '0.35rem' }}>
                Your Name:
              </label>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. David Miller"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#3c4043', marginBottom: '0.35rem' }}>
                Google Email Address:
              </label>
              <input
                type="email"
                className="input-text"
                placeholder="e.g. david.miller@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#3c4043', marginBottom: '0.35rem' }}>
                Account Role:
              </label>
              <select
                className="input-text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
              >
                <option value="student">🎒 Student</option>
                <option value="teacher">🍎 Educator / Teacher</option>
                <option value="parent">🏡 Parent / Guardian</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsCustom(false)}
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2, background: '#1a73e8' }}
              >
                Sign In with Google
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
