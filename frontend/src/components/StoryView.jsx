import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Pause, Play, BookOpen, Sparkles, 
  Printer, Copy, Check, ArrowRight, ArrowLeft, Lightbulb, Clock, Globe,
  GraduationCap, Eye, Type, Compass
} from 'lucide-react';
import SceneIllustrator from './SceneIllustrator';
import CharacterBuddyChat from './CharacterBuddyChat';
import VocabularyFlashcards from './VocabularyFlashcards';
import StoryBranchingCard from './StoryBranchingCard';
import StoryDoodleCanvas from './StoryDoodleCanvas';
import SuggestedResourcesCard from './SuggestedResourcesCard';
import { playClickSound, playOptionSelect } from '../services/soundEffects';
import { playAmbientSound, stopAmbientSound } from '../services/ambientSoundscapes';

export default function StoryView({ 
  storyData, 
  topic, 
  ageGroup, 
  language, 
  onTakeQuiz, 
  onBackToForm, 
  isLoadingQuiz,
  onOpenTeacherMode,
  onAddXp,
  onOpenTheater,
  onOpenComic,
  onOpenWordLab,
  onOpenResources
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  // Accessibility & Reading Tools
  const [isDyslexicMode, setIsDyslexicMode] = useState(false);
  const [showReadingRuler, setShowReadingRuler] = useState(false);
  const [rulerY, setRulerY] = useState(200);
  const [fontSizeOffset, setFontSizeOffset] = useState(0); // -2, 0, +3, +6
  const [showParallelLang, setShowParallelLang] = useState(false);

  // Adventure Branching
  const [branchText, setBranchText] = useState("");

  const { title, story, reading_level, vocabulary = [], moral, emoji_scenes = [] } = storyData || {};

  // Estimated reading time calculation
  const wordCount = story ? story.trim().split(/\s+/).length : 0;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 120));

  const [ambientSound, setAmbientSound] = useState(null); // 'rain' | 'ocean' | 'forest' | null

  // Speech Synthesis & Ambient Audio Cleanup
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      stopAmbientSound();
    };
  }, []);

  // Reading Ruler cursor follower
  useEffect(() => {
    if (!showReadingRuler) return;
    const handleMouseMove = (e) => {
      setRulerY(e.clientY - 18);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showReadingRuler]);

  const handleToggleSpeak = () => {
    playClickSound();
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }

    if (isPlaying && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();

    const fullStoryText = branchText ? `${story}\n\nBonus Chapter: ${branchText}` : story;
    const utterance = new SpeechSynthesisUtterance(fullStoryText);
    
    // Choose voice language
    const langMap = {
      English: "en-US",
      Hindi: "hi-IN",
      Tamil: "ta-IN",
      Spanish: "es-ES",
      French: "fr-FR",
      German: "de-DE",
    };
    utterance.lang = langMap[language] || "en-US";
    utterance.rate = ageGroup === "5-7" ? 0.85 : 0.95;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handleStopSpeak = () => {
    playClickSound();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handleCopy = () => {
    playClickSound();
    if (!story) return;
    const textToCopy = `${title}\n\n${story}\n\nMoral: ${moral || ''}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Split story into paragraphs
  const paragraphs = story ? story.split('\n\n').filter(p => p.trim()) : [];

  return (
    <div className="card" id="story-reader-view">
      {/* Reading focus ruler guide overlay */}
      {showReadingRuler && (
        <div 
          className="reading-guide-overlay"
          style={{ top: `${rulerY}px` }}
        />
      )}

      {/* Header & Badges */}
      <div className="story-header">
        <div className="story-meta-row">
          <span className="badge badge-indigo">
            <BookOpen size={12} /> {topic}
          </span>
          <span className="badge badge-amber">
            Ages {ageGroup}
          </span>
          <span className="badge badge-purple">
            <Globe size={12} /> {language}
          </span>
          {reading_level && (
            <span className="badge badge-green">
              {reading_level}
            </span>
          )}
          <span className="story-read-time">
            <Clock size={13} /> {readTimeMin} min read ({wordCount} words)
          </span>
        </div>

        <h1 className="story-title">{title || "Your Story"}</h1>

        {/* Scene Illustrator Header */}
        <SceneIllustrator topic={topic} />
      </div>

      {/* Toolbar / Audio Controls & Accessibility Tools */}
      <div className="reading-toolbar">
        <div className="tts-controls">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleToggleSpeak}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause size={16} /> Pause
              </>
            ) : isPaused ? (
              <>
                <Play size={16} /> Resume
              </>
            ) : (
              <>
                <Volume2 size={16} color="#4f46e5" /> 🔊 Read Aloud
              </>
            )}
          </button>

          {isPlaying && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleStopSpeak}
              title="Stop speech"
            >
              <VolumeX size={16} /> Stop
            </button>
          )}

          {/* Text Size Controls */}
          <div style={{ display: 'inline-flex', alignItems: 'center', background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '2px 4px' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ border: 'none', padding: '2px 6px', fontSize: '0.75rem' }}
              onClick={() => setFontSizeOffset(Math.max(-2, fontSizeOffset - 2))}
              title="Smaller font"
            >
              A-
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ border: 'none', padding: '2px 6px', fontSize: '0.9rem', fontWeight: 800 }}
              onClick={() => setFontSizeOffset(Math.min(6, fontSizeOffset + 2))}
              title="Larger font"
            >
              A+
            </button>
          </div>

          {/* Accessibility Dyslexia Mode Toggle */}
          <button
            className={`btn btn-sm ${isDyslexicMode ? 'btn-accent' : 'btn-secondary'}`}
            onClick={() => setIsDyslexicMode(!isDyslexicMode)}
            title="Toggle high-readability Dyslexia-friendly typography"
          >
            👓 Dyslexia Font
          </button>

          {/* Reading Focus Ruler */}
          <button
            className={`btn btn-sm ${showReadingRuler ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowReadingRuler(!showReadingRuler)}
            title="Follow along with a reading line ruler"
          >
            📏 Focus Ruler
          </button>

          {/* Ambient Soundscapes */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '2px 4px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>Focus Sound:</span>
            {[
              { id: 'rain', label: '🌧️ Rain' },
              { id: 'ocean', label: '🌊 Ocean' },
              { id: 'forest', label: '🌲 Forest' }
            ].map((snd) => (
              <button
                key={snd.id}
                type="button"
                className={`btn btn-sm ${ambientSound === snd.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '2px 6px', fontSize: '0.75rem', border: 'none' }}
                onClick={() => {
                  if (ambientSound === snd.id) {
                    stopAmbientSound();
                    setAmbientSound(null);
                  } else {
                    playAmbientSound(snd.id);
                    setAmbientSound(snd.id);
                  }
                }}
                title={`Play ambient ${snd.id} sound`}
              >
                {snd.label}
              </button>
            ))}
            {ambientSound && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ padding: '2px 5px', fontSize: '0.7rem', border: 'none', color: '#ef4444' }}
                onClick={() => {
                  stopAmbientSound();
                  setAmbientSound(null);
                }}
                title="Mute ambient sound"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Bedtime / Cinema Theater Mode */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              playClickSound();
              if (onOpenTheater) onOpenTheater();
            }}
            title="Open Fullscreen Storybook Cinema with Karaoke Highlighting"
            style={{ color: '#7c3aed', borderColor: '#ddd6fe', background: '#faf5ff', fontWeight: 700 }}
          >
            🎬 Cinema Theater
          </button>

          {/* Comic Strip Studio */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              playClickSound();
              if (onOpenComic) onOpenComic();
            }}
            title="Convert this story into a 4-panel illustrated comic strip"
            style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb', fontWeight: 700 }}
          >
            🎨 Comic Strip
          </button>

          {/* Magic Word Lab */}
          {vocabulary && vocabulary.length > 0 && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => {
                playClickSound();
                if (onOpenWordLab) onOpenWordLab(vocabulary[0]);
              }}
              title="Open Phonics Syllable Breakdown and Word Memory Lab"
              style={{ color: '#4338ca', borderColor: '#c7d2fe', background: '#f5f3ff', fontWeight: 700 }}
            >
              🧪 Magic Word Lab
            </button>
          )}

          {/* Suggested Books & Store Deep Dive */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              playClickSound();
              if (onOpenResources) onOpenResources();
            }}
            title="Recommended books on Amazon, Flipkart, and educational portals"
            style={{ color: '#b45309', borderColor: '#fde68a', background: '#fffbeb', fontWeight: 700 }}
          >
            📚 Books & Stores
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenTeacherMode}
            title="Classroom worksheet & lesson plan view"
            style={{ color: '#047857', borderColor: '#a7f3d0', background: '#ecfdf5' }}
          >
            <GraduationCap size={15} /> 🍎 Teacher Mode
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleCopy}
            title="Copy story text"
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => window.print()}
            title="Print printable story worksheet"
          >
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      {/* Story Content Reader */}
      <div 
        className={`story-reader-card ${isDyslexicMode ? 'dyslexia-mode' : ''}`}
        style={{ fontSize: `calc(1.25rem + ${fontSizeOffset}px)` }}
      >
        {paragraphs.map((p, idx) => (
          <p key={idx} className="story-paragraph">
            {p}
          </p>
        ))}

        {/* Branch continuation if chosen */}
        {branchText && (
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '2px dashed #818cf8',
            color: '#1e1b4b'
          }}>
            <strong style={{ color: '#4f46e5' }}>✨ Extra Chapter (Your Adventure Choice):</strong>
            <p style={{ marginTop: '0.5rem' }}>{branchText}</p>
          </div>
        )}
      </div>

      {/* Moral / Lesson Box */}
      {moral && (
        <div className="story-moral-banner">
          <div style={{
            background: '#f59e0b',
            color: 'white',
            borderRadius: 'var(--radius-full)',
            padding: '6px',
            display: 'flex'
          }}>
            <Lightbulb size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#b45309', marginBottom: '2px' }}>
              Story Takeaway & Moral
            </div>
            <div className="story-moral-text">
              "{moral}"
            </div>
          </div>
        </div>
      )}

      {/* Interactive 3D Vocabulary Flashcards */}
      <VocabularyFlashcards 
        vocabulary={vocabulary} 
        onOpenWordLab={onOpenWordLab} 
      />

      {/* Choose Your Own Adventure Branching */}
      <StoryBranchingCard 
        topic={topic}
        onBranchSelected={(txt) => setBranchText(txt)}
        onAddXp={onAddXp}
      />

      {/* Interactive Story Coloring & Doodle Studio */}
      <StoryDoodleCanvas 
        topic={topic}
        onAddXp={onAddXp}
      />

      {/* Interactive Story Character Chat Buddy */}
      <CharacterBuddyChat 
        story={story} 
        ageGroup={ageGroup} 
        language={language} 
      />

      {/* Suggested Books & Web Deep-Dive Explorer (Amazon, Flipkart, Google) */}
      <SuggestedResourcesCard 
        topic={topic}
        ageGroup={ageGroup}
        onOpenFullModal={onOpenResources}
        onAddXp={onAddXp}
      />

      {/* Bottom CTA to Take Quiz */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '2.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <button
          className="btn btn-secondary"
          onClick={() => {
            playClickSound();
            onBackToForm();
          }}
        >
          <ArrowLeft size={16} /> Change Topic / Age
        </button>

        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            playClickSound();
            onTakeQuiz();
          }}
          disabled={isLoadingQuiz}
        >
          {isLoadingQuiz ? (
            "Preparing Your Quiz..."
          ) : (
            <>
              🎯 Take the Quiz <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
