import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, CheckCircle, XCircle, AlertCircle, RefreshCw, 
  BookOpen, Award, Printer, ArrowRight, Zap 
} from 'lucide-react';
import { playFanfare, playClickSound } from '../services/soundEffects';

export default function Result({ 
  evalResult, 
  storyData, 
  topic, 
  ageGroup, 
  onNewStory, 
  onReadAgain, 
  onOpenCertificate 
}) {
  const { score = 0, total = 5, percentage = 0, feedback = [], summary = "", badge = "Explorer 🌟" } = evalResult || {};

  // Confetti and fanfare effect on high score
  useEffect(() => {
    if (percentage >= 70) {
      playFanfare();
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }
    }
  }, [percentage]);

  // Score circle calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const scoreColor = percentage >= 80 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="card" id="quiz-results-card">
      {/* Hero / Score Ring */}
      <div className="result-hero">
        <div className="score-circle-wrapper">
          <svg className="score-circle-svg" viewBox="0 0 160 160">
            <circle
              className="score-circle-bg"
              cx="80"
              cy="80"
              r={radius}
            />
            <circle
              className="score-circle-progress"
              cx="80"
              cy="80"
              r={radius}
              stroke={scoreColor}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="score-circle-content">
            <div className="score-percent" style={{ color: scoreColor }}>
              {Math.round(percentage)}%
            </div>
            <div className="score-fraction">
              {score} of {total} Points
            </div>
          </div>
        </div>

        <div className="result-badge-pill">
          <Award size={18} color="#d97706" /> {badge}
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#ede9fe',
          color: '#5b21b6',
          fontSize: '0.85rem',
          fontWeight: 800,
          padding: '0.25rem 0.85rem',
          borderRadius: '999px',
          marginBottom: '1rem'
        }}>
          <Zap size={14} color="#7c3aed" /> +100 Explorer XP Earned! Level Up 🚀
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>
          {percentage >= 80 ? "Superb Job! 🌟" : percentage >= 50 ? "Great Effort! 👏" : "Keep Exploring! 🌱"}
        </h2>

        {summary && (
          <div className="result-summary-box">
            {summary}
          </div>
        )}

        {/* Certificate Promo Button */}
        <div style={{ marginBottom: '2rem' }}>
          <button 
            className="btn btn-accent btn-md"
            onClick={onOpenCertificate}
          >
            <Trophy size={16} /> 🎖️ Get Your Certificate of Achievement
          </button>
        </div>
      </div>

      {/* Question Feedback Breakdown */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Detailed Teacher Feedback & Explanations:
        </h3>

        <div className="feedback-list">
          {feedback.map((item, idx) => {
            const isCorrect = item.correct && item.score >= 1.0;
            const isPartial = item.score > 0 && item.score < 1.0;
            const cardClass = isCorrect ? 'correct' : isPartial ? 'partial' : 'incorrect';

            return (
              <div key={item.id || idx} className={`feedback-card ${cardClass}`}>
                <div className="feedback-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isCorrect ? (
                      <CheckCircle size={20} color="#10b981" />
                    ) : isPartial ? (
                      <AlertCircle size={20} color="#f59e0b" />
                    ) : (
                      <XCircle size={20} color="#ef4444" />
                    )}
                    <span className="feedback-card-title">
                      Question {idx + 1}
                    </span>
                  </div>

                  <span className={`badge ${isCorrect ? 'badge-green' : isPartial ? 'badge-amber' : 'badge-purple'}`}>
                    {isCorrect ? "Correct (+1.0)" : isPartial ? "Partial Credit (+0.5)" : "Needs Review (+0)"}
                  </span>
                </div>

                {item.learner_answer && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    <strong>Your Answer:</strong> {String(item.learner_answer)}
                  </div>
                )}

                {item.correct_answer && !isCorrect && (
                  <div style={{ fontSize: '0.85rem', color: '#047857', marginBottom: '0.35rem' }}>
                    <strong>Story Answer:</strong> {String(item.correct_answer)}
                  </div>
                )}

                <div className="feedback-comment">
                  {item.comment}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
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
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={onReadAgain}
          >
            <BookOpen size={16} /> 📖 Read Story Again
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            <Printer size={16} /> Print Report
          </button>
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={onNewStory}
        >
          <RefreshCw size={18} /> 🔄 Tell Me a New Story
        </button>
      </div>
    </div>
  );
}
