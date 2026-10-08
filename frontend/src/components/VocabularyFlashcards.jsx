import React, { useState } from 'react';
import { Volume2, Sparkles, RotateCw, Lightbulb, Zap } from 'lucide-react';
import { playClickSound, playOptionSelect } from '../services/soundEffects';

export default function VocabularyFlashcards({ vocabulary = [], onOpenWordLab }) {
  const [flippedCards, setFlippedCards] = useState({});

  if (!vocabulary || vocabulary.length === 0) return null;

  const toggleFlip = (idx) => {
    playClickSound();
    setFlippedCards((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const speakWord = (e, word) => {
    e.stopPropagation();
    playOptionSelect();
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  return (
    <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e1b4b' }}>
            <Sparkles size={20} color="#7c3aed" /> 3D Vocabulary Flashcards
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Click any card to flip it over and reveal its secret superpower!
          </p>
        </div>
        <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
          Interactive Practice
        </span>
      </div>

      <div className="flashcard-grid">
        {vocabulary.map((item, idx) => {
          const isFlipped = !!flippedCards[idx];
          return (
            <div
              key={idx}
              className={`flashcard-container ${isFlipped ? 'is-flipped' : ''}`}
              onClick={() => toggleFlip(idx)}
              role="button"
              tabIndex={0}
            >
              <div className="flashcard-inner">
                {/* Front */}
                <div className="flashcard-front">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4338ca', fontFamily: 'var(--font-heading)' }}>
                      {item.word}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => speakWord(e, item.word)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '3px 8px', borderRadius: '999px' }}
                      title="Pronounce Word"
                    >
                      <Volume2 size={13} color="#4f46e5" />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginTop: 'auto' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RotateCw size={12} /> Flip ↷
                    </span>
                    {onOpenWordLab && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          onOpenWordLab(item);
                        }}
                        style={{
                          background: '#e0e7ff',
                          border: 'none',
                          color: '#4338ca',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                        title="Explore in Magic Phonics Word Lab"
                      >
                        <Zap size={11} /> Word Lab
                      </button>
                    )}
                  </div>
                </div>

                {/* Back */}
                <div className="flashcard-back">
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#7c3aed', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Meaning
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.45, fontWeight: 500, marginBottom: '0.5rem' }}>
                    {item.meaning}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6d28d9', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lightbulb size={12} /> Click to flip back
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
