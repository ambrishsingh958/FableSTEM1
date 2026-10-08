import React from 'react';
import { 
  BookOpen, Sparkles, History, Zap, Flame, Trophy, 
  ShoppingBag, PlayCircle, Bookmark, Compass, Layers, 
  Brain, GraduationCap, BarChart3, User, LogIn, ChevronRight
} from 'lucide-react';
import { playClickSound, playOptionSelect } from '../services/soundEffects';

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
  onOpenResources,
  onOpenFlashcards,
  onOpenTeacherMode,
  onOpenPresets,
  onOpenStreak,
  activeTab = "studio"
}) {
  const streakCount = currentUser?.streak || 3;
  const userAvatar = currentUser?.avatar || "🧑‍🚀";
  const userName = currentUser?.name ? currentUser.name.split(' ')[0] : "Profile";

  return (
    <header className="navbar-wrapper" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
    }}>
      {/* =========================================
          TIER 1: TOP MAIN HEADER
         ========================================= */}
      <div className="app-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1rem',
        borderBottom: '1px solid #f1f5f9'
      }}>
        {/* Brand */}
        <div 
          onClick={() => {
            playClickSound();
            onReset();
          }} 
          role="button" 
          tabIndex={0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          {/* Purple rounded brand icon */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <BookOpen size={22} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontSize: '1.45rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#0f172a',
              fontFamily: 'var(--font-heading)'
            }}>
              FableSTEM
            </span>

            {/* ✨ STEM Badge */}
            <span style={{
              background: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              <Sparkles size={11} color="#d97706" /> STEM
            </span>
          </div>
        </div>

        {/* Top Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* ▶ Presets Pill Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onOpenPresets) onOpenPresets();
            }}
            style={{
              background: '#f5f3ff',
              border: '1px solid #ddd6fe',
              color: '#4f46e5',
              borderRadius: '999px',
              padding: '0.45rem 0.95rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Open quick benchmark STEM story presets"
          >
            <PlayCircle size={15} /> Presets
          </button>

          {/* 🔖 Library Pill Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onOpenHistory();
            }}
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              color: '#334155',
              borderRadius: '999px',
              padding: '0.45rem 0.95rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="View saved stories in your library"
          >
            <Bookmark size={15} color="#64748b" /> Library
          </button>

          {/* 🧑‍🚀 Profile Pill Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (currentUser) {
                onOpenProfile();
              } else {
                onOpenAuth();
              }
            }}
            style={{
              background: 'white',
              border: '1px solid #cbd5e1',
              color: '#1e293b',
              borderRadius: '999px',
              padding: '0.4rem 0.95rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
            title={currentUser ? "View student/educator profile" : "Log In to FableSTEM"}
          >
            <span style={{ fontSize: '1.1rem' }}>{userAvatar}</span>
            <span>{userName}</span>
          </button>
        </div>
      </div>

      {/* =========================================
          TIER 2: SEGREGATED SUB-NAVIGATION BAR
         ========================================= */}
      <div className="subnav-container" style={{
        background: '#ffffff',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        WebkitOverflowScrolling: 'touch',
        padding: '0.45rem 0'
      }}>
        <div className="app-container" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          minWidth: 'max-content'
        }}>
          {/* 1. 📖 Story Studio */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onReset();
            }}
            style={{
              background: activeTab === 'studio' ? '#f1f5f9' : 'transparent',
              border: '1px solid #e2e8f0',
              color: '#1e293b',
              borderRadius: '999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <BookOpen size={14} color="#475569" /> Story Studio
          </button>

          {/* 2. 🧭 Explore (Active Filled Purple Pill) */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onOpenResources) onOpenResources();
            }}
            style={{
              background: '#4f46e5',
              border: '1px solid #4338ca',
              color: 'white',
              borderRadius: '999px',
              padding: '0.35rem 0.95rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)',
              transition: 'all 0.15s ease'
            }}
            title="Explore STEM books on Amazon & Flipkart, NASA, and Google"
          >
            <Compass size={14} color="white" /> Explore
          </button>

          {/* 3. 📚 Age Lab */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onOpenAgeLens();
            }}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              borderRadius: '999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Side-by-side linguistic comparison: Ages 5-7 vs 11-14"
          >
            <Layers size={14} color="#6366f1" /> Age Lab
          </button>

          {/* 4. 🧠 Flashcards */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onOpenFlashcards) onOpenFlashcards();
            }}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              borderRadius: '999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Open 3D Flashcards & Phonics Syllables Lab"
          >
            <Brain size={14} color="#8b5cf6" /> Flashcards
          </button>

          {/* 5. 🏆 Passport & Badges */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onOpenTrophies) onOpenTrophies();
            }}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              borderRadius: '999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="View Hall of Fame Medals, Diplomas, and Badges"
          >
            <Trophy size={14} color="#d97706" /> Passport & Badges
          </button>

          {/* 6. 🎓 Educators */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onOpenTeacherMode) onOpenTeacherMode();
            }}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              borderRadius: '999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Classroom worksheets with NGSS standards & answer keys"
          >
            <GraduationCap size={14} color="#059669" /> Educators
          </button>

          {/* 7. 🔥 3d Streak (Amber Pill) */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onOpenStreak) onOpenStreak();
            }}
            style={{
              background: '#fffbeb',
              border: '1.5px solid #fed7aa',
              color: '#9a3412',
              borderRadius: '999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(234, 88, 12, 0.1)'
            }}
            title="Click to view your reading streak progress"
          >
            <Flame size={14} color="#ea580c" fill="#ea580c" /> {streakCount}d Streak
          </button>

          {/* 8. 🏆 {xp} XP (Trophies) */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              if (onOpenTrophies) onOpenTrophies();
            }}
            style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#78350f',
              borderRadius: '999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
            title="Total Learner XP"
          >
            <Trophy size={13} color="#b45309" /> {xp} XP
          </button>

          {/* 9. 📊 Analytics */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onOpenAnalytics();
            }}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#047857',
              borderRadius: '999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer'
            }}
            title="View learning analytics and growth"
          >
            <BarChart3 size={14} color="#059669" /> Analytics
          </button>
        </div>
      </div>
    </header>
  );
}
