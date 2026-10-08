import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Mic, MicOff, Users, Swords, User, Trophy } from 'lucide-react';
import { playClickSound, playOptionSelect, playFanfareSound } from '../services/soundEffects';
import { isSpeechRecognitionSupported, startSpeechRecognition } from '../services/speechRecognition';

export default function Quiz({ questions = [], onSubmitQuiz, isEvaluating, onBackToStory }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  // 2-Player Battle Arena mode
  const [isTwoPlayer, setIsTwoPlayer] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player 1 🦊");
  const [player2Name, setPlayer2Name] = useState("Player 2 🐼");
  const [playerAnswers, setPlayerAnswers] = useState({}); // { qId: 'p1' | 'p2' }

  if (!questions || questions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p>No questions found. Please try generating the quiz again.</p>
        <button className="btn btn-secondary" onClick={onBackToStory} style={{ marginTop: '1rem' }}>
          Back to Story
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  const currentAnswer = answers[String(currentQ.id)] || answers[currentQ.id] || "";

  const handleSelectOption = (opt) => {
    playOptionSelect();
    setAnswers((prev) => ({
      ...prev,
      [String(currentQ.id)]: opt,
      [currentQ.id]: opt,
    }));
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setAnswers((prev) => ({
      ...prev,
      [String(currentQ.id)]: val,
      [currentQ.id]: val,
    }));
  };

  const handleNext = () => {
    playClickSound();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    playClickSound();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    playClickSound();
    onSubmitQuiz(answers);
  };

  // Voice Speech Recognition
  const handleToggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setVoiceError("");
    setIsListening(true);

    startSpeechRecognition({
      onResult: (transcript) => {
        playOptionSelect();
        setAnswers((prev) => ({
          ...prev,
          [String(currentQ.id)]: transcript,
          [currentQ.id]: transcript
        }));
        setIsListening(false);
      },
      onError: (err) => {
        setIsListening(false);
        setVoiceError("Microphone permission or audio not detected. You can type your answer!");
      },
      onEnd: () => {
        setIsListening(false);
      }
    });
  };

  const answeredCount = questions.filter(
    (q) => answers[String(q.id)] !== undefined && String(answers[String(q.id)]).trim() !== ""
  ).length;

  return (
    <div className="card" id="quiz-interactive-card">
      {/* Game Mode Selector: Solo vs 2-Player Battle Arena */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: isTwoPlayer ? 'linear-gradient(135deg, #eff6ff, #fdf2f8)' : '#f8fafc',
        borderRadius: '16px',
        border: isTwoPlayer ? '2px solid #c7d2fe' : '1px solid #e2e8f0',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${!isTwoPlayer ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              playClickSound();
              setIsTwoPlayer(false);
            }}
            style={{ borderRadius: '20px', fontSize: '0.8rem' }}
          >
            <User size={14} /> Solo Mode 🧘
          </button>
          <button
            type="button"
            className={`btn btn-sm ${isTwoPlayer ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              playFanfareSound();
              setIsTwoPlayer(true);
            }}
            style={{ 
              borderRadius: '20px', 
              fontSize: '0.8rem',
              background: isTwoPlayer ? 'linear-gradient(135deg, #6366f1, #ec4899)' : undefined,
              borderColor: isTwoPlayer ? 'transparent' : undefined
            }}
          >
            <Swords size={14} /> 2-Player Battle Arena ⚔️
          </button>
        </div>

        {isTwoPlayer && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 800 }}>
            <span style={{ 
              padding: '0.2rem 0.6rem', 
              borderRadius: '10px', 
              background: currentIndex % 2 === 0 ? '#dbeafe' : 'transparent',
              color: currentIndex % 2 === 0 ? '#1e40af' : '#64748b',
              border: currentIndex % 2 === 0 ? '1.5px solid #93c5fd' : '1px solid transparent'
            }}>
              🦊 P1: Benny
            </span>
            <span style={{ color: '#94a3b8' }}>VS</span>
            <span style={{ 
              padding: '0.2rem 0.6rem', 
              borderRadius: '10px', 
              background: currentIndex % 2 === 1 ? '#fce7f3' : 'transparent',
              color: currentIndex % 2 === 1 ? '#9d174d' : '#64748b',
              border: currentIndex % 2 === 1 ? '1.5px solid #fbcfe8' : '1px solid transparent'
            }}>
              🐼 P2: Maya / Judge
            </span>
          </div>
        )}
      </div>

      {/* 2-Player Turn Banner */}
      {isTwoPlayer && (
        <div style={{
          textAlign: 'center',
          padding: '0.4rem',
          borderRadius: '10px',
          background: currentIndex % 2 === 0 ? '#eff6ff' : '#fdf2f8',
          border: `1px solid ${currentIndex % 2 === 0 ? '#bfdbfe' : '#fbcfe8'}`,
          marginBottom: '1rem',
          fontSize: '0.85rem',
          fontWeight: 800,
          color: currentIndex % 2 === 0 ? '#1e40af' : '#9d174d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem'
        }}>
          <Swords size={15} /> 
          {currentIndex % 2 === 0 ? "🎯 Current Turn: Benny (Player 1)" : "🎯 Current Turn: Maya (Player 2)"}
        </div>
      )}

      {/* Quiz Header */}
      <div className="quiz-header">
        <div>
          <span className="question-badge">
            <HelpCircle size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Question {currentIndex + 1} of {totalQuestions}
          </span>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Answered {answeredCount} of {totalQuestions}
          </div>
        </div>

        {/* Question navigator dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {questions.map((q, idx) => {
            const hasAnswer = answers[String(q.id)] !== undefined && String(answers[String(q.id)]).trim() !== "";
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id || idx}
                type="button"
                onClick={() => {
                  playClickSound();
                  setCurrentIndex(idx);
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-full)',
                  border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: isCurrent ? 'var(--primary)' : hasAnswer ? '#d1fae5' : '#f1f5f9',
                  color: isCurrent ? 'white' : hasAnswer ? '#065f46' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title={`Jump to Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Track */}
      <div className="quiz-progress-track">
        <div 
          className="quiz-progress-fill" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Content */}
      <div className="question-box">
        <h2 className="question-text">{currentQ.question}</h2>

        {/* Render Multiple Choice Questions */}
        {currentQ.type === 'mcq' && currentQ.options && (
          <div className="options-grid">
            {currentQ.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = currentAnswer === opt;
              return (
                <div
                  key={idx}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(opt)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="option-letter">{letter}</div>
                  <div className="option-text">{opt}</div>
                  {isSelected && <CheckCircle2 size={20} color="#4f46e5" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Render True / False Questions */}
        {currentQ.type === 'tf' && (
          <div className="tf-grid">
            {['True', 'False'].map((opt) => {
              const isTrue = opt === 'True';
              const isSelected = currentAnswer === opt;
              return (
                <button
                  type="button"
                  key={opt}
                  className={`tf-btn ${
                    isSelected ? (isTrue ? 'selected-true' : 'selected-false') : ''
                  }`}
                  onClick={() => handleSelectOption(opt)}
                >
                  <span>{isTrue ? '👍' : '👎'}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Render Short Answer Questions */}
        {currentQ.type === 'short' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ✍️ Write your answer or use your voice to speak it aloud:
              </p>

              {/* Voice Input Button */}
              {isSpeechRecognitionSupported() && (
                <button
                  type="button"
                  className={`btn btn-sm ${isListening ? 'btn-accent' : 'btn-secondary'}`}
                  onClick={handleToggleVoice}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} color="#4f46e5" />}
                  {isListening ? "🔴 Listening... Speak now!" : "🎙️ Speak Answer"}
                </button>
              )}
            </div>

            {voiceError && (
              <div style={{ fontSize: '0.8rem', color: '#b45309', marginBottom: '0.5rem' }}>
                {voiceError}
              </div>
            )}

            <textarea
              className="short-answer-area"
              placeholder="Type your explanation here, or click 'Speak Answer' to talk into your microphone..."
              value={currentAnswer}
              onChange={handleTextChange}
            />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={currentIndex === 0 ? onBackToStory : handlePrev}
        >
          <ArrowLeft size={16} /> {currentIndex === 0 ? "Review Story" : "Previous"}
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
            >
              Next Question <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-accent btn-lg"
              onClick={handleSubmit}
              disabled={isEvaluating}
            >
              <Sparkles size={18} />
              {isEvaluating ? "Checking Answers..." : "Submit Answers ✨"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
