import React, { useState } from 'react';
import { MessageCircle, Send, Volume2, Sparkles, Smile, Bot, X } from 'lucide-react';
import { chatWithCharacter } from '../services/api';
import { playClickSound, playSuccessChime } from '../services/soundEffects';

const QUICK_QUESTIONS = [
  "What was the most exciting part of your journey? ✨",
  "Why didn't you get lost in the sky? ☁️",
  "Can you explain your big secret one more time simply? 💡",
  "Do you have other drop friends with you? 💧"
];

export default function CharacterBuddyChat({ story, ageGroup, language }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "Pip",
      text: "Hi friend! 👋 I'm Pip, the story character! Did you have fun reading with me? Ask me anything about what happened in our adventure!",
      isBot: true
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async (msgText) => {
    const q = (msgText || inputVal).trim();
    if (!q || isThinking) return;

    playClickSound();
    setInputVal("");
    setMessages((prev) => [...prev, { sender: "You", text: q, isBot: false }]);
    setIsThinking(true);

    try {
      const res = await chatWithCharacter({
        story: story || "",
        character_name: "Pip",
        question: q,
        age_group: ageGroup || "8-10",
        language: language || "English"
      });

      playSuccessChime();
      setMessages((prev) => [
        ...prev,
        {
          sender: "Pip",
          text: res.reply || "That was such a wonderful question! Keep exploring!",
          isBot: true,
          mood: res.mood
        }
      ]);

      // Speak reply automatically
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(res.reply);
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "Pip",
          text: "Oops, I had a little flutter! But remember, every part of our story is an adventure!",
          isBot: true
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  if (!isOpen) {
    return (
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button
          className="btn btn-secondary"
          onClick={() => {
            playClickSound();
            setIsOpen(true);
          }}
          style={{
            background: 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)',
            border: '2px solid #818cf8',
            color: '#4338ca',
            fontWeight: 700,
            padding: '0.75rem 1.5rem',
            borderRadius: '999px',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.2)'
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>💬</span> Ask Pip (Chat with Story Character)
        </button>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: '2rem',
      background: 'white',
      border: '2px solid #818cf8',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-lg)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem'
          }}>
            💧
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#312e81', fontSize: '1.05rem' }}>
              Chat with Pip (Story Character)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
              ● Online & Ready to explain!
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Message History */}
      <div style={{
        maxHeight: '260px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        marginBottom: '1rem',
        paddingRight: '6px'
      }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.isBot ? 'flex-start' : 'flex-end',
              maxWidth: '85%',
              background: m.isBot ? '#f1f5f9' : '#4f46e5',
              color: m.isBot ? '#1e293b' : 'white',
              padding: '0.75rem 1.15rem',
              borderRadius: m.isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
              fontSize: '0.92rem',
              lineHeight: 1.5,
              position: 'relative'
            }}
          >
            {m.isBot && (
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', marginBottom: '3px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>💧 {m.sender}</span>
                <button
                  onClick={() => speakText(m.text)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1' }}
                  title="Listen"
                >
                  <Volume2 size={12} />
                </button>
              </div>
            )}
            <div>{m.text}</div>
          </div>
        ))}

        {isThinking && (
          <div style={{
            alignSelf: 'flex-start',
            background: '#f1f5f9',
            padding: '0.6rem 1rem',
            borderRadius: '16px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic'
          }}>
            Pip is thinking of a friendly answer... ✨
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            className="chip-btn"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            onClick={() => handleSendMessage(q)}
            disabled={isThinking}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{ display: 'flex', gap: '0.5rem' }}
      >
        <input
          type="text"
          className="input-text"
          placeholder="Ask Pip anything about this story..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={isThinking}
          style={{ flex: 1, padding: '0.65rem 1rem' }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!inputVal.trim() || isThinking}
          style={{ padding: '0.65rem 1.25rem' }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
