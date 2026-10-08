import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Award } from 'lucide-react';

const STORY_MESSAGES = [
  "✨ Your teacher is writing your story...",
  "Finding the perfect words for your age...",
  "Weaving in clear and exciting scientific ideas...",
  "Adding playful characters and a warm ending...",
  "Polishing vocabulary and reading level...",
  "Almost ready for you! 🌟"
];

const QUIZ_MESSAGES = [
  "🧠 Crafting interactive questions from your story...",
  "Designing multiple choice and comprehension puzzles...",
  "Checking questions against what was taught...",
  "Almost ready for your quiz challenge! 🎯"
];

const EVAL_MESSAGES = [
  "🔎 Checking your answers with kindness and care...",
  "Reviewing short answer explanations...",
  "Preparing encouraging feedback and teacher praise...",
  "Calculating your achievement score! 🌟"
];

export default function LoadingState({ type = "story" }) {
  const [index, setIndex] = useState(0);

  const messages = type === "quiz" 
    ? QUIZ_MESSAGES 
    : type === "evaluate" 
      ? EVAL_MESSAGES 
      : STORY_MESSAGES;

  const Icon = type === "quiz" ? Brain : type === "evaluate" ? Award : Sparkles;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="card loading-box">
      <div className="loader-spark">
        <Icon size={36} />
      </div>

      <h3 className="loading-title">
        {type === "quiz" 
          ? "Creating Your Quiz" 
          : type === "evaluate" 
            ? "Evaluating Your Answers" 
            : "Writing Your Story"}
      </h3>

      <p className="loading-subtitle">
        {messages[index]}
      </p>

      <div style={{
        maxWidth: '300px',
        height: '6px',
        background: '#e2e8f0',
        borderRadius: '999px',
        margin: '1.5rem auto 0',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: '60%',
          background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
          borderRadius: '999px',
          animation: 'loadSlide 1.5s ease-in-out infinite alternate'
        }} />
      </div>

      <style>{`
        @keyframes loadSlide {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
