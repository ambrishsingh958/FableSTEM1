import React, { useState } from 'react';
import { 
  X, User, Lock, Sparkles, GraduationCap, School, 
  Smile, ShieldCheck, Zap, ArrowRight, Check 
} from 'lucide-react';
import { loginUser, registerUser } from '../services/api';
import { playClickSound, playSuccessChime } from '../services/soundEffects';
import GoogleAuthModal, { GoogleIcon } from './GoogleAuthModal';

const STUDENT_AVATARS = [
  { id: "🦉", name: "Oliver the Owl" },
  { id: "🦁", name: "Leo the Lion" },
  { id: "🚀", name: "Nova the Astronaut" },
  { id: "🐬", name: "Daisy the Dolphin" },
  { id: "🦊", name: "Felix the Fox" },
  { id: "🐼", name: "Pip the Panda" },
  { id: "⭐", name: "Star Scholar" },
];

export default function AuthModal({ onLoginSuccess, onClose }) {
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("student"); // "student" | "teacher" | "parent"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("🦉");
  const [gradeOrClass, setGradeOrClass] = useState("Grade 2-3");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    setErrorMsg("");
    setLoading(true);

    try {
      const payload = {
        username: username.trim() || (role === 'student' ? "Curious Learner" : "Teacher Davis"),
        password,
        role,
        avatar: role === 'student' ? avatar : role === 'teacher' ? '🍎' : '🏡',
        grade_or_class: gradeOrClass
      };

      const res = isRegister ? await registerUser(payload) : await loginUser(payload);
      playSuccessChime();
      onLoginSuccess(res.user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Instant 1-Click Demo Profiles for Judges
  const handleDemoLogin = (demoRole) => {
    playClickSound();
    let demoUser;
    if (demoRole === 'student') {
      demoUser = {
        name: "Maya (Student)",
        role: "student",
        avatar: "🚀",
        grade_or_class: "Grade 2 (Ages 7-8)",
        xp: 350,
        streak: 5,
        email: "maya.student@school.org",
        badges: ["Story Pioneer 📖", "Water Detective 🌊", "Quiz Champion 🏆"]
      };
    } else if (demoRole === 'teacher') {
      demoUser = {
        name: "Ms. Davis (Teacher)",
        role: "teacher",
        avatar: "🍎",
        grade_or_class: "Lincoln Elementary (Grade 4)",
        xp: 850,
        streak: 12,
        email: "ms.davis@lincoln-edu.org",
        badges: ["Master Educator 🎓", "Curriculum Leader 📋", "Story Creator ✨"]
      };
    }
    playSuccessChime();
    onLoginSuccess(demoUser);
    onClose();
  };

  const handleGoogleSuccess = (googleUser) => {
    onLoginSuccess(googleUser);
    onClose();
  };

  return (
    <>
      <div className="certificate-modal-overlay">
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '490px',
          width: '100%',
          padding: '2rem',
          maxHeight: '92vh',
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

          {/* Brand & Title */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.65rem',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}>
              <Sparkles size={22} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e1b4b', marginBottom: '0.2rem' }}>
              {isRegister ? "Join FableSTEM" : "Welcome Back"}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Sign in to save stories, earn XP badges, and print diplomas!
            </p>
          </div>

          {/* Official Google Sign-In Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowGooglePicker(true);
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              background: '#ffffff',
              border: '1.5px solid #dadce0',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#3c4043',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'all 0.15s ease',
              marginBottom: '1rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            <GoogleIcon size={20} />
            <span>Continue with Google</span>
          </button>

          {/* 1-Click Judge Demo Quick Access */}
          <div style={{
            background: 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)',
            border: '1px solid #c7d2fe',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 0.85rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4338ca', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Zap size={13} color="#6366f1" fill="#6366f1" /> HACKATHON 1-CLICK DEMO LOGIN
            </div>
            <div style={{ display: 'flex', gap: '0.45rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => handleDemoLogin('student')}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
              >
                🚀 Demo Student (Maya)
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => handleDemoLogin('teacher')}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', borderColor: '#818cf8', color: '#4338ca' }}
              >
                🍎 Demo Teacher (Ms. Davis)
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            margin: '1rem 0',
            color: 'var(--text-light)',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              or use student passkey
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Role Selector Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '0.35rem',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem'
          }}>
            {[
              { id: 'student', label: '🎒 Student' },
              { id: 'teacher', label: '🍎 Teacher' },
              { id: 'parent', label: '🏡 Parent' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setRole(r.id);
                }}
                style={{
                  border: 'none',
                  padding: '0.45rem 0.25rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: role === r.id ? 'white' : 'transparent',
                  color: role === r.id ? '#4338ca' : 'var(--text-muted)',
                  boxShadow: role === r.id ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Error message */}
          {errorMsg && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem',
              color: '#991b1b',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Avatar Chooser (for students) */}
            {role === 'student' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Choose Your Character Avatar:
                </label>
                <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {STUDENT_AVATARS.map((av) => {
                    const isSel = avatar === av.id;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setAvatar(av.id);
                        }}
                        title={av.name}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: 'var(--radius-full)',
                          border: isSel ? '2px solid #4f46e5' : '1px solid var(--border)',
                          background: isSel ? '#ede9fe' : 'white',
                          fontSize: '1.3rem',
                          cursor: 'pointer',
                          transform: isSel ? 'scale(1.12)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {av.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Username / Name Input */}
            <div style={{ marginBottom: '0.85rem' }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                {role === 'student' ? "Learner Name / Nickname:" : role === 'teacher' ? "Educator / Teacher Name:" : "Parent Name:"}
              </label>
              <input
                type="text"
                className="input-text"
                placeholder={role === 'student' ? "e.g. Maya" : role === 'teacher' ? "e.g. Ms. Davis" : "e.g. Sarah"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Grade or School */}
            {role === 'student' ? (
              <div style={{ marginBottom: '0.85rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>
                  School Grade Level:
                </label>
                <select
                  className="input-text"
                  value={gradeOrClass}
                  onChange={(e) => setGradeOrClass(e.target.value)}
                >
                  <option value="Kindergarten / Early">Kindergarten (Ages 5-6)</option>
                  <option value="Grade 1-2">Grade 1–2 (Ages 6-8)</option>
                  <option value="Grade 3-4">Grade 3–4 (Ages 8-10)</option>
                  <option value="Grade 5-6">Grade 5–6 (Ages 10-12)</option>
                  <option value="Middle School">Middle School (Ages 12-14)</option>
                  <option value="High School">High School (Ages 14+)</option>
                </select>
              </div>
            ) : role === 'teacher' ? (
              <div style={{ marginBottom: '0.85rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>
                  School or Class Name:
                </label>
                <input
                  type="text"
                  className="input-text"
                  placeholder="e.g. Lincoln Elementary - Grade 4"
                  value={gradeOrClass}
                  onChange={(e) => setGradeOrClass(e.target.value)}
                />
              </div>
            ) : null}

            {/* Password / Passkey */}
            <div style={{ marginBottom: '1.15rem' }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                {role === 'student' ? "Passkey / Secret Word:" : "Password:"}
              </label>
              <input
                type="password"
                className="input-text"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              {loading ? "Signing in..." : isRegister ? "Create Profile & Start ✨" : "Sign In ✨"}
            </button>
          </form>

          {/* Toggle Sign In / Register */}
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {isRegister ? (
              <>
                Already have a profile?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                New learner?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Real Google Account Picker Popup */}
      {showGooglePicker && (
        <GoogleAuthModal
          onSelectGoogleAccount={handleGoogleSuccess}
          onClose={() => setShowGooglePicker(false)}
        />
      )}
    </>
  );
}
