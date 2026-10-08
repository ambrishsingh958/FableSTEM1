import React, { useState } from 'react';
import { 
  X, Printer, Sparkles, Download, Smile, MessageSquare, 
  Lightbulb, CheckCircle2, Bookmark, Flame
} from 'lucide-react';
import { playClickSound, playSuccessChime } from '../services/soundEffects';

// Splits story paragraphs into 4 distinct comic panel narratives
function generateComicPanels(storyText, emojis = [], topic = "") {
  if (!storyText) return [];
  const paragraphs = storyText.split(/\n+/).map(p => p.trim()).filter(Boolean);
  
  // Default emojis if none
  const defaultEmojis = ["🌱", "✨", "💧", "🎉", "🌞", "🦉"];
  const panelEmojis = emojis.length >= 4 ? emojis : defaultEmojis;

  const panels = [
    {
      step: "PANEL 1",
      badge: "THE DISCOVERY",
      sfx: "WHOOSH!",
      sfxColor: "#3b82f6",
      emoji: panelEmojis[0] || "✨",
      caption: `In the beginning, a curious question arose about ${topic}...`,
      dialogue: paragraphs[0] ? paragraphs[0].slice(0, 140) + "..." : "Once upon a time in a wonderful world...",
      character: "Pip the Explorer",
      bgGradient: "linear-gradient(135deg, #eff6ff, #dbeafe)",
      borderColor: "#93c5fd"
    },
    {
      step: "PANEL 2",
      badge: "THE PUZZLE",
      sfx: "HMM...?",
      sfxColor: "#8b5cf6",
      emoji: panelEmojis[1] || "🔍",
      caption: "Something mysterious was taking place...",
      dialogue: paragraphs[1] ? paragraphs[1].slice(0, 140) + "..." : "How could this happen? Let's take a closer look!",
      character: "Detective Owl",
      bgGradient: "linear-gradient(135deg, #faf5ff, #f3e8ff)",
      borderColor: "#d8b4fe"
    },
    {
      step: "PANEL 3",
      badge: "THE EUREKA MOMENT",
      sfx: "AHA! 💡",
      sfxColor: "#f59e0b",
      emoji: panelEmojis[2] || "⚡",
      caption: "Suddenly, the secret scientific mechanism was revealed!",
      dialogue: paragraphs[2] ? paragraphs[2].slice(0, 140) + "..." : "Look! That's how nature does it all!",
      character: "Professor Pip",
      bgGradient: "linear-gradient(135deg, #fffbeb, #fef3c7)",
      borderColor: "#fde047"
    },
    {
      step: "PANEL 4",
      badge: "THE LESSON & VICTORY",
      sfx: "HOORAY! 🎉",
      sfxColor: "#10b981",
      emoji: panelEmojis[3] || "🌟",
      caption: "And so, understanding brought joy to everyone!",
      dialogue: paragraphs[paragraphs.length - 1] ? paragraphs[paragraphs.length - 1].slice(0, 140) + "..." : "Now we understand how it works together!",
      character: "Happy Friends",
      bgGradient: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
      borderColor: "#6ee7b7"
    }
  ];

  return panels;
}

export default function ComicStripModal({ 
  storyData, 
  topic, 
  ageGroup, 
  onClose,
  onAddXp
}) {
  const [comicStyle, setComicStyle] = useState('superhero'); // 'superhero' | 'manga' | 'storybook'
  const [copiedNotification, setCopiedNotification] = useState(false);

  const panels = generateComicPanels(
    storyData?.story, 
    storyData?.emoji_scenes, 
    topic || storyData?.title
  );

  const handlePrint = () => {
    playClickSound();
    window.print();
    if (onAddXp) onAddXp(20);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '880px', 
          width: '95%', 
          padding: '2rem', 
          borderRadius: '24px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
              transform: 'rotate(-4deg)'
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-amber" style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>
                  Graphic Novel Edition
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Ages {ageGroup}
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e1b4b', margin: 0, fontFamily: 'var(--font-heading)' }}>
                {storyData?.title || topic} — Comic Strip
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handlePrint}
              style={{ borderRadius: '12px', fontWeight: 700 }}
              title="Print classroom comic strip"
            >
              <Printer size={15} /> Print Comic
            </button>
            <button 
              type="button" 
              className="btn btn-secondary btn-icon" 
              onClick={onClose}
              aria-label="Close Comic Studio"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Comic Strip 4-Panel Grid */}
        <div 
          id="printable-comic-strip"
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '0.25rem',
            marginBottom: '1rem'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.25rem'
          }}>
            {panels.map((panel, idx) => (
              <div
                key={idx}
                style={{
                  background: panel.bgGradient,
                  border: `3px solid ${panel.borderColor}`,
                  borderRadius: '18px',
                  padding: '1.25rem',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                  overflow: 'hidden'
                }}
              >
                {/* Comic Halftone dots decor */}
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '-15px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(0,0,0,0.05) 15%, transparent 20%)',
                  backgroundSize: '10px 10px',
                  pointerEvents: 'none'
                }} />

                {/* Panel Header & SFX Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{
                    background: '#1e1b4b',
                    color: 'white',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    letterSpacing: '0.05em'
                  }}>
                    {panel.step}: {panel.badge}
                  </div>

                  {/* Sound Effect Boom Sticker */}
                  <div style={{
                    background: panel.sfxColor,
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    transform: idx % 2 === 0 ? 'rotate(5deg)' : 'rotate(-5deg)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    letterSpacing: '0.05em'
                  }}>
                    {panel.sfx}
                  </div>
                </div>

                {/* Scene Emoji Art Centerpiece */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0.5rem 0'
                }}>
                  <div style={{
                    fontSize: '3.2rem',
                    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.12))',
                    animation: 'floatSlow 3s ease-in-out infinite'
                  }}>
                    {panel.emoji}
                  </div>
                </div>

                {/* Speech Bubble */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '0.85rem 1rem',
                  border: '2px solid #1e293b',
                  position: 'relative',
                  marginBottom: '0.75rem',
                  boxShadow: '2px 3px 0px #1e293b'
                }}>
                  {/* Little speech tail */}
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '28px',
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid #1e293b'
                  }} />
                  <p style={{
                    margin: 0,
                    fontSize: '0.85rem',
                    lineHeight: 1.45,
                    color: '#0f172a',
                    fontWeight: 600,
                    fontStyle: 'italic'
                  }}>
                    "{panel.dialogue}"
                  </p>
                </div>

                {/* Bottom Caption */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: '#475569',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <Bookmark size={13} color="#64748b" /> {panel.caption}
                </div>
              </div>
            ))}
          </div>

          {/* Moral Box at bottom */}
          {storyData?.moral && (
            <div style={{
              marginTop: '1.25rem',
              background: '#fefce8',
              border: '2px dashed #facc15',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🌟</span>
              <div>
                <strong style={{ color: '#854d0e', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  Comic Strips Takeaway
                </strong>
                <p style={{ margin: 0, color: '#713f12', fontSize: '0.9rem', fontWeight: 600 }}>
                  "{storyData.moral}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            💡 Tip: Click "Print Comic" to save as a PDF for classroom reading logs!
          </span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onClose}
            style={{ borderRadius: '12px', padding: '0.5rem 1.25rem' }}
          >
            Done Reading Comic 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
