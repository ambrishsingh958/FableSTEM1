import React from 'react';
import { BookOpen, Sparkles, ShieldCheck, History, Award, Zap, Flame, Star, User, LogIn, BarChart3, Trophy, ShoppingBag } from 'lucide-react';
import { playClickSound } from '../services/soundEffects';

export default function Navbar({ 
  onOpenHistory, 
  onReset, 
  hasHistory, 
  onOpenAgeLens, 
  xp = 150, 
  currentUser, 
  onOpenAuth, 
  onOpenProfile,
  onOpenAnalytics,
  onOpenTrophies,
  onOpenResources
}) {
  return (
    <nav className="navbar">
      <div className="app-container navbar-inner">
        <div 
          className="brand" 
          onClick={() => {
            playClickSound();
            onReset();
          }} 
          role="button" 
          tabIndex={0}
        >
          <div className="brand-icon">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="brand-title">
              Fable<span style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>STEM</span>
            </div>
          </div>
        </div>

        <div className="nav-actions">
          {/* XP & Trophies Badge */}
          <button 
            type="button"
            className="badge badge-amber" 
            onClick={() => {
              playClickSound();
              if (onOpenTrophies) onOpenTrophies();
            }}
            title="View Hall of Fame Trophies"
            style={{ fontWeight: 800, cursor: 'pointer', border: '1px solid #fde68a' }}
          >
            <Trophy size={13} color="#b45309" /> {xp} XP (Trophies 🏆)
          </button>

          {/* Age Lens Split Explorer for Judges */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              playClickSound();
              onOpenAgeLens();
            }}
            title="Compare Age 5-7 vs Age 11-14 Side-by-Side (Judge Demo)"
            style={{ borderColor: '#818cf8', color: '#4338ca', background: '#f5f3ff' }}
          >
            <Zap size={14} color="#6366f1" fill="#6366f1" /> Age Lens
          </button>

          {/* STEM Books & Marketplace Explorer */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              playClickSound();
              if (onOpenResources) onOpenResources();
            }}
            title="Explore recommended STEM books on Amazon & Flipkart"
            style={{ borderColor: '#fde68a', color: '#b45309', background: '#fffbeb' }}
          >
            <ShoppingBag size={14} color="#d97706" /> STEM Books
          </button>

          {/* Analytics Dashboard */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              playClickSound();
              onOpenAnalytics();
            }}
            title="View Student Learning Analytics & Growth"
          >
            <BarChart3 size={14} color="#059669" /> Analytics
          </button>

          {/* History */}
          {hasHistory && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                playClickSound();
                onOpenHistory();
              }}
              title="View recent stories saved in this browser"
            >
              <History size={14} /> History
            </button>
          )}

          {/* User Profile or Login Button */}
          {currentUser ? (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                playClickSound();
                onOpenProfile();
              }}
              title="View your learning profile & badges"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: '#c7d2fe',
                background: '#f8fafc'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{currentUser.avatar || "🦉"}</span>
              <span style={{ fontWeight: 700, color: '#312e81' }}>{currentUser.name}</span>
            </button>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                playClickSound();
                onOpenAuth();
              }}
              style={{
                borderColor: '#cbd5e1',
                color: '#334155'
              }}
            >
              <LogIn size={14} /> Log In
            </button>
          )}

          <button 
            className="btn btn-primary btn-sm"
            onClick={() => {
              playClickSound();
              onReset();
            }}
          >
            <Sparkles size={14} /> New Story
          </button>
        </div>
      </div>
    </nav>
  );
}
