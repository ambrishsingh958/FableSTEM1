import React, { useState } from 'react';
import { 
  X, Volume2, Sparkles, Lightbulb, Zap, Award, CheckCircle, 
  HelpCircle, ArrowRight, RotateCcw, Smile
} from 'lucide-react';
import { playClickSound, playSuccessChime, playFanfareSound } from '../services/soundEffects';

// Phonics syllable breakdown generator
function getSyllables(word) {
  if (!word) return ['word'];
  // Common educational words custom breakdowns
  const known = {
    'photosynthesis': ['Pho', 'to', 'syn', 'the', 'sis'],
    'evaporation': ['E', 'vap', 'o', 'ra', 'tion'],
    'precipitation': ['Pre', 'cip', 'i', 'ta', 'tion'],
    'condensation': ['Con', 'den', 'sa', 'tion'],
    'gravity': ['Grav', 'i', 'ty'],
    'transpiration': ['Tran', 'spi', 'ra', 'tion'],
    'honesty': ['Hon', 'es', 'ty'],
    'atmosphere': ['At', 'mos', 'phere'],
    'chlorophyll': ['Chlo', 'ro', 'phyll'],
    'ecosystem': ['E', 'co', 'sys', 'tem'],
    'molecule': ['Mol', 'e', 'cule'],
    'orbit': ['Or', 'bit'],
    'friction': ['Fric', 'tion'],
    'magnification': ['Mag', 'ni', 'fi', 'ca', 'tion']
  };

  const lower = word.toLowerCase().replace(/[^a-z]/g, '');
  if (known[lower]) return known[lower];

  // Algorithmic fallback syllable splitter for English
  const parts = lower.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]+(?=$|[^aeiouy]))?/gi);
  if (parts && parts.length > 1) {
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1));
  }
  return [word.charAt(0).toUpperCase() + word.slice(1)];
}

// Generate fun kid-friendly mnemonics
function getMnemonic(word, meaning) {
  const w = word.toLowerCase();
  if (w.includes('photo')) {
    return "💡 'Photo' is Greek for LIGHT! Plants snap sunlight like a camera snaps pictures!";
  }
  if (w.includes('evapor')) {
    return "💨 Think of water getting invisible wings and flying up like steam from soup!";
  }
  if (w.includes('precip')) {
    return "🌧️ 'Precipitate' means water taking a speedy slide down from clouds to the grass!";
  }
  if (w.includes('condens')) {
    return "❄️ Water droplets giving each other a big cold hug on the outside of an iced juice glass!";
  }
  if (w.includes('honest')) {
    return "💖 'Honesty' is like wearing clear glass glasses: no secrets, only the real truth!";
  }
  if (w.includes('gravit')) {
    return "🌍 Earth's invisible giant hug that stops your shoes from floating to outer space!";
  }
  return `✨ Remember: "${word}" has special powers! When you say it, you sound like a master scientist!`;
}

export default function MagicWordLabModal({ 
  initialWord, 
  vocabularyList = [], 
  onClose,
  onAddXp
}) {
  const [selectedWordObj, setSelectedWordObj] = useState(() => {
    if (initialWord && typeof initialWord === 'object') return initialWord;
    if (initialWord && typeof initialWord === 'string') {
      const found = vocabularyList.find(v => v.word.toLowerCase() === initialWord.toLowerCase());
      return found || { word: initialWord, meaning: "An important educational concept!" };
    }
    return vocabularyList[0] || { word: "Photosynthesis", meaning: "How plants use sunlight to make food." };
  });

  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeSyllable, setActiveSyllable] = useState(null);

  const word = selectedWordObj?.word || "Word";
  const meaning = selectedWordObj?.meaning || "Meaning";
  const syllables = getSyllables(word);
  const mnemonic = getMnemonic(word, meaning);

  const speakText = (text, rate = 0.85) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = 1.05;
    window.speechSynthesis.speak(u);
  };

  const handleSyllableClick = (syl, idx) => {
    playClickSound();
    setActiveSyllable(idx);
    speakText(syl, 0.7);
    setTimeout(() => setActiveSyllable(null), 800);
  };

  const handleQuizAnswer = (isCorrect, opt) => {
    setSelectedOption(opt);
    setQuizAnswered(true);
    setQuizCorrect(isCorrect);
    if (isCorrect) {
      playSuccessChime();
      if (onAddXp) onAddXp(15);
    } else {
      playClickSound();
    }
  };

  // Generate mini quiz options
  const quizOptions = [
    { text: meaning, correct: true },
    { text: `Something that has nothing to do with ${word}`, correct: false },
    { text: `A type of giant blueberry from Jupiter`, correct: false }
  ].sort(() => 0.5 - Math.random());

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '640px', width: '95%', padding: '2rem', borderRadius: '24px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(168, 85, 247, 0.35)'
            }}>
              <Zap size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>
                Magic Word Lab 🧪
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Phonics breakdown & superpower memory lab
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="btn btn-secondary btn-icon" 
            onClick={onClose}
            aria-label="Close Word Lab"
          >
            <X size={18} />
          </button>
        </div>

        {/* Word Switcher Tabs if vocabularyList > 1 */}
        {vocabularyList.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            {vocabularyList.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedWordObj(item);
                  setQuizAnswered(false);
                  setSelectedOption(null);
                }}
                className={`btn btn-sm ${item.word === word ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '20px', whiteSpace: 'nowrap', fontSize: '0.8rem' }}
              >
                {item.word}
              </button>
            ))}
          </div>
        )}

        {/* Main Word Card */}
        <div style={{
          background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
          border: '2px solid #ddd6fe',
          borderRadius: '20px',
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Master Word
          </span>
          <h1 style={{ 
            fontSize: '2.4rem', 
            fontWeight: 900, 
            color: '#312e81', 
            margin: '0.25rem 0 1rem 0',
            fontFamily: 'var(--font-heading)'
          }}>
            {word}
          </h1>

          {/* Interactive Syllables */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', marginBottom: '0.5rem' }}>
              TAP SYLLABLES TO HEAR PHONICS:
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              {syllables.map((syl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSyllableClick(syl, idx)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: activeSyllable === idx ? '#4f46e5' : '#c7d2fe',
                    background: activeSyllable === idx ? '#4f46e5' : 'white',
                    color: activeSyllable === idx ? 'white' : '#4338ca',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    transform: activeSyllable === idx ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.15s ease'
                  }}
                  title="Hear this syllable"
                >
                  {syl}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Pronunciation Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                playClickSound();
                speakText(word, 0.9);
              }}
              style={{ borderRadius: '20px' }}
            >
              <Volume2 size={16} /> Listen Normal 🐰
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                playClickSound();
                speakText(word, 0.6);
              }}
              style={{ borderRadius: '20px', borderColor: '#c7d2fe' }}
            >
              <Volume2 size={16} /> Slow Phonics 🐢
            </button>
          </div>
        </div>

        {/* Kid Definition & Superpower Mnemonic */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            background: '#ffffff',
            border: '1.5px solid #e0e7ff',
            borderRadius: '16px',
            padding: '1.1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4338ca', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <Smile size={16} /> Child-Friendly Meaning
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#1f2937', lineHeight: 1.5, fontWeight: 500 }}>
              {meaning}
            </p>
          </div>

          <div style={{
            background: '#fefce8',
            border: '1.5px solid #fef08a',
            borderRadius: '16px',
            padding: '1.1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#854d0e', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <Lightbulb size={16} /> Memory Trick (Mnemonic)
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#713f12', lineHeight: 1.5 }}>
              {mnemonic}
            </p>
          </div>
        </div>

        {/* Mini Quiz Challenge for +15 XP */}
        <div style={{
          background: '#f8fafc',
          border: '1.5px solid #e2e8f0',
          borderRadius: '18px',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="#eab308" /> Mini Word Challenge (+15 XP)
            </span>
            {quizAnswered && (
              <span className={`badge ${quizCorrect ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.75rem' }}>
                {quizCorrect ? "Super Star! +15 XP 🌟" : "Keep Trying! 💪"}
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
            What is the true definition of <u>{word}</u>?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quizOptions.map((opt, i) => {
              const isChosen = selectedOption === opt;
              let btnStyle = {
                textAlign: 'left',
                padding: '0.65rem 0.9rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                border: '1.5px solid #cbd5e1',
                background: 'white',
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              };

              if (quizAnswered) {
                if (opt.correct) {
                  btnStyle.borderColor = '#10b981';
                  btnStyle.background = '#ecfdf5';
                  btnStyle.color = '#065f46';
                  btnStyle.fontWeight = 700;
                } else if (isChosen && !opt.correct) {
                  btnStyle.borderColor = '#f87171';
                  btnStyle.background = '#fef2f2';
                  btnStyle.color = '#991b1b';
                }
              }

              return (
                <button
                  key={i}
                  type="button"
                  style={btnStyle}
                  onClick={() => !quizAnswered && handleQuizAnswer(opt.correct, opt)}
                  disabled={quizAnswered}
                >
                  <span>{opt.text}</span>
                  {quizAnswered && opt.correct && <CheckCircle size={16} color="#059669" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
            style={{ borderRadius: '14px', padding: '0.6rem 1.5rem' }}
          >
            Done Exploring ✨
          </button>
        </div>
      </div>
    </div>
  );
}
