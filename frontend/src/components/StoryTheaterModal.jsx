import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, RotateCcw, Volume2, Sparkles, Moon, Sun, 
  Trees, Waves, ChevronRight, ChevronLeft, Maximize2, Minimize2,
  Bookmark, Award
} from 'lucide-react';
import { playClickSound, playOptionSelect, playSuccessChime } from '../services/soundEffects';
import { playAmbientSound, stopAmbientSound } from '../services/ambientSoundscapes';

const THEMES = [
  {
    id: 'cosmic',
    name: 'Cosmic Galaxy',
    icon: '🌌',
    background: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
    textColor: '#f8fafc',
    highlightBg: 'rgba(168, 85, 247, 0.35)',
    highlightBorder: '#c084fc',
    accentColor: '#c084fc',
    ambientSound: 'rain'
  },
  {
    id: 'forest',
    name: 'Enchanted Forest',
    icon: '🌲',
    background: 'radial-gradient(circle at 50% 20%, #064e3b 0%, #022c22 60%, #051b14 100%)',
    textColor: '#f0fdf4',
    highlightBg: 'rgba(52, 211, 153, 0.3)',
    highlightBorder: '#6ee7b7',
    accentColor: '#34d399',
    ambientSound: 'forest'
  },
  {
    id: 'sunset',
    name: 'Sunset Twilight',
    icon: '🌅',
    background: 'linear-gradient(135deg, #451a03 0%, #31135e 50%, #1a0826 100%)',
    textColor: '#fffbeb',
    highlightBg: 'rgba(245, 158, 11, 0.35)',
    highlightBorder: '#fde047',
    accentColor: '#f59e0b',
    ambientSound: 'ocean'
  },
  {
    id: 'ocean',
    name: 'Deep Blue Coral',
    icon: '🌊',
    background: 'radial-gradient(circle at 50% 30%, #083344 0%, #032333 60%, #02121c 100%)',
    textColor: '#ecfeff',
    highlightBg: 'rgba(6, 182, 212, 0.35)',
    highlightBorder: '#67e8f9',
    accentColor: '#22d3ee',
    ambientSound: 'ocean'
  }
];

export default function StoryTheaterModal({ 
  storyData, 
  topic, 
  ageGroup, 
  onClose,
  onAddXp
}) {
  const [theme, setTheme] = useState(THEMES[0]);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ambientAudioOn, setAmbientAudioOn] = useState(true);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1.15); // Large cinema text

  const utteranceRef = useRef(null);

  // Split story text into clean sentences for karaoke tracking
  const rawStory = storyData?.story || "";
  const sentences = React.useMemo(() => {
    if (!rawStory) return [];
    const matched = rawStory.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g);
    return matched ? matched.map(s => s.trim()).filter(Boolean) : [rawStory];
  }, [rawStory]);

  // Ambient sound management
  useEffect(() => {
    if (ambientAudioOn && theme.ambientSound) {
      playAmbientSound(theme.ambientSound);
    } else {
      stopAmbientSound();
    }
    return () => {
      stopAmbientSound();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [ambientAudioOn, theme]);

  const speakSentenceAtIndex = (index) => {
    if (index >= sentences.length) {
      setIsPlaying(false);
      setActiveSentenceIndex(0);
      playSuccessChime();
      if (onAddXp) onAddXp(25);
      return;
    }

    setActiveSentenceIndex(index);
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const textToSpeak = sentences[index];
    const u = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = u;

    // Bedtime/theater voice settings
    u.rate = 0.88;
    u.pitch = 1.0;

    u.onend = () => {
      // Auto advance to next sentence after short gentle breath pause
      setTimeout(() => {
        speakSentenceAtIndex(index + 1);
      }, 450);
    };

    u.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(u);
  };

  const togglePlayTheater = () => {
    playClickSound();
    if (isPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakSentenceAtIndex(activeSentenceIndex);
    }
  };

  const handleNextSentence = () => {
    playClickSound();
    const next = Math.min(sentences.length - 1, activeSentenceIndex + 1);
    setActiveSentenceIndex(next);
    if (isPlaying) speakSentenceAtIndex(next);
  };

  const handlePrevSentence = () => {
    playClickSound();
    const prev = Math.max(0, activeSentenceIndex - 1);
    setActiveSentenceIndex(prev);
    if (isPlaying) speakSentenceAtIndex(prev);
  };

  const handleRestart = () => {
    playClickSound();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setActiveSentenceIndex(0);
    if (isPlaying) speakSentenceAtIndex(0);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        background: theme.background,
        color: theme.textColor,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem',
        overflow: 'hidden',
        transition: 'background 0.5s ease'
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Top Bar Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.75rem 1.25rem',
        background: 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        {/* Title & Emojis */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.8rem' }}>
            {storyData?.emoji_scenes?.[0] || "✨"}
          </span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em',
                color: theme.accentColor
              }}>
                Bedtime & Cinema Theater
              </span>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.1rem 0.5rem',
                borderRadius: '8px',
                fontSize: '0.7rem',
                fontWeight: 700
              }}>
                Ages {ageGroup}
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>
              {storyData?.title || topic}
            </h2>
          </div>
        </div>

        {/* Theme Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                playOptionSelect();
                setTheme(t);
              }}
              style={{
                background: theme.id === t.id ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
                border: theme.id === t.id ? `2px solid ${t.accentColor}` : '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                padding: '0.4rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s'
              }}
              title={t.name}
            >
              <span>{t.icon}</span>
              <span style={{ display: 'none', smDisplay: 'inline' }}>{t.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Right actions: Ambient toggle & Exit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setAmbientAudioOn(!ambientAudioOn);
            }}
            style={{
              background: ambientAudioOn ? 'rgba(52, 211, 153, 0.25)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: ambientAudioOn ? '#6ee7b7' : 'white',
              padding: '0.45rem 0.8rem',
              borderRadius: '12px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            {ambientAudioOn ? "🎵 Ambient ON" : "🔇 Ambient OFF"}
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.25)',
              border: '1px solid rgba(248, 113, 113, 0.4)',
              color: '#fca5a5',
              padding: '0.45rem 0.8rem',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 800
            }}
            aria-label="Exit Cinema"
          >
            <X size={16} /> Exit Theater
          </button>
        </div>
      </div>

      {/* Main Cinema Reading Display */}
      <div style={{
        flex: 1,
        maxWidth: '920px',
        margin: '2rem auto',
        width: '100%',
        overflowY: 'auto',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Story Emojis Banner */}
        {storyData?.emoji_scenes && storyData.emoji_scenes.length > 0 && (
          <div style={{ 
            fontSize: '3rem', 
            letterSpacing: '0.5rem', 
            marginBottom: '1.5rem',
            animation: 'floatSlow 4s ease-in-out infinite'
          }}>
            {storyData.emoji_scenes.join(" ")}
          </div>
        )}

        {/* Sentences with Karaoke Highlight */}
        <div style={{
          fontSize: `${1.25 * fontSizeMultiplier}rem`,
          lineHeight: 1.85,
          fontFamily: 'var(--font-heading)',
          fontWeight: 500,
          maxHeight: '55vh',
          overflowY: 'auto',
          padding: '1rem',
          borderRadius: '16px'
        }}>
          {sentences.map((sent, idx) => {
            const isCurrent = idx === activeSentenceIndex;
            return (
              <span
                key={idx}
                onClick={() => {
                  playClickSound();
                  speakSentenceAtIndex(idx);
                }}
                style={{
                  display: 'inline',
                  marginRight: '0.45rem',
                  padding: isCurrent ? '0.25rem 0.6rem' : '0.1rem 0.2rem',
                  borderRadius: isCurrent ? '10px' : '4px',
                  background: isCurrent ? theme.highlightBg : 'transparent',
                  border: isCurrent ? `1.5px solid ${theme.highlightBorder}` : '1.5px solid transparent',
                  color: isCurrent ? '#ffffff' : 'rgba(255, 255, 255, 0.72)',
                  fontWeight: isCurrent ? 800 : 400,
                  textShadow: isCurrent ? `0 0 16px ${theme.accentColor}` : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                title="Tap to jump reading here"
              >
                {sent}{' '}
              </span>
            );
          })}
        </div>

        {/* Moral Takeaway at end */}
        {storyData?.moral && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: `1px solid ${theme.highlightBorder}`,
            maxWidth: '680px',
            color: '#fef08a',
            fontSize: '1rem',
            fontWeight: 700
          }}>
            🌟 Moral Takeaway: "{storyData.moral}"
          </div>
        )}
      </div>

      {/* Bottom Playback & Progress Bar */}
      <div style={{
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(16px)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', opacity: 0.8, minWidth: '60px' }}>
            {activeSentenceIndex + 1} / {sentences.length}
          </span>
          <div style={{
            flex: 1,
            height: '8px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((activeSentenceIndex + 1) / sentences.length) * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${theme.accentColor}, #ffffff)`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
          <button
            type="button"
            onClick={handleRestart}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Restart from beginning"
          >
            <RotateCcw size={18} />
          </button>

          <button
            type="button"
            onClick={handlePrevSentence}
            disabled={activeSentenceIndex === 0}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              cursor: activeSentenceIndex === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: activeSentenceIndex === 0 ? 0.4 : 1
            }}
            title="Previous sentence"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={togglePlayTheater}
            style={{
              background: `linear-gradient(135deg, ${theme.accentColor}, #ffffff)`,
              border: 'none',
              color: '#0f172a',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 25px ${theme.accentColor}`,
              transform: 'scale(1.05)',
              transition: 'all 0.2s'
            }}
            title={isPlaying ? "Pause Theater" : "Start Karaoke Audiobook"}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
          </button>

          <button
            type="button"
            onClick={handleNextSentence}
            disabled={activeSentenceIndex >= sentences.length - 1}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              cursor: activeSentenceIndex >= sentences.length - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: activeSentenceIndex >= sentences.length - 1 ? 0.4 : 1
            }}
            title="Next sentence"
          >
            <ChevronRight size={22} />
          </button>

          {/* Text Size Scale */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setFontSizeMultiplier(prev => (prev >= 1.4 ? 1.0 : prev + 0.15));
            }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              padding: '0.4rem 0.8rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
            title="Cycle text size"
          >
            Aa ({Math.round(fontSizeMultiplier * 100)}%)
          </button>
        </div>
      </div>
    </div>
  );
}
