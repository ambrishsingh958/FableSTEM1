import React, { useState } from 'react';
import { Sparkles, BookOpen, Globe, Clock, Zap, AlertCircle } from 'lucide-react';

const SUGGESTED_TOPICS = [
  { label: "🌧️ Water Cycle", value: "The Water Cycle" },
  { label: "🌿 Photosynthesis", value: "Photosynthesis" },
  { label: "🪐 Solar System", value: "The Solar System & Planets" },
  { label: "🤝 Honesty", value: "Honesty and Kindness" },
  { label: "⚡ Electricity", value: "How Electricity Works" },
  { label: "🚗 Road Safety", value: "Road Safety Rules" },
  { label: "🍕 Fractions", value: "Fractions in Math" },
  { label: "🐢 Ocean Animals", value: "Ocean Ecosystems" },
];

const AGE_OPTIONS = [
  {
    id: "5-7",
    label: "Ages 5–7",
    sublabel: "Early Reader",
    words: "120–180 words",
    description: "Simple sentences, animal friends, gentle repetition & happy ending."
  },
  {
    id: "8-10",
    label: "Ages 8–10",
    sublabel: "Elementary",
    words: "250–350 words",
    description: "Exciting adventure quests, fun facts, and new words explained in the story."
  },
  {
    id: "11-14",
    label: "Ages 11–14",
    sublabel: "Middle School",
    words: "400–550 words",
    description: "Rich vocabulary, cause-and-effect science, dilemmas and concepts."
  },
  {
    id: "15+",
    label: "Ages 15+",
    sublabel: "Young Adult",
    words: "500–700 words",
    description: "In-depth real world applications, nuanced ideas and analytical thinking."
  }
];

const LANGUAGES = [
  { code: "English", label: "English" },
  { code: "Tamil", label: "தமிழ் (Tamil)" },
  { code: "Hindi", label: "हिन्दी (Hindi)" },
  { code: "Spanish", label: "Español (Spanish)" },
  { code: "French", label: "Français (French)" },
  { code: "German", label: "Deutsch (German)" }
];

export default function StoryForm({ onSubmit, isLoading, errorMessage, onClearError, onOpenAgeLens }) {
  const [topic, setTopic] = useState("The Water Cycle");
  const [ageGroup, setAgeGroup] = useState("5-7");
  const [language, setLanguage] = useState("English");
  const [length, setLength] = useState("medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit({ topic: topic.trim(), age_group: ageGroup, language, length });
  };

  const handleApplyPreset = (presetTopic, presetAge) => {
    setTopic(presetTopic);
    setAgeGroup(presetAge);
    if (onClearError) onClearError();
  };

  return (
    <div className="card" id="story-form-card">
      {/* Judge Demo Quick Presets */}
      <div className="demo-preset-bar">
        <div className="demo-preset-header">
          <div className="demo-preset-title">
            <Zap size={16} color="#4f46e5" /> <strong>Judge Quick Demo:</strong> Compare same topic across ages
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => onOpenAgeLens(topic)}
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
          >
            ⚡ Split Compare Ages (Side-by-Side)
          </button>
        </div>
        <div className="demo-preset-chips">
          <button 
            type="button" 
            className="preset-chip"
            onClick={() => handleApplyPreset("The Water Cycle", "5-7")}
          >
            💧 Water Cycle (Age 5–7)
          </button>
          <button 
            type="button" 
            className="preset-chip"
            onClick={() => handleApplyPreset("The Water Cycle", "11-14")}
          >
            💧 Water Cycle (Age 11–14)
          </button>
          <button 
            type="button" 
            className="preset-chip"
            onClick={() => handleApplyPreset("Photosynthesis", "8-10")}
          >
            🌿 Photosynthesis (Age 8–10)
          </button>
          <button 
            type="button" 
            className="preset-chip"
            onClick={() => handleApplyPreset("Honesty and Kindness", "5-7")}
          >
            💖 Honesty (Age 5–7)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Error message alert */}
        {errorMessage && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{errorMessage}</div>
          </div>
        )}

        {/* TOPIC INPUT */}
        <div className="form-group">
          <label className="form-label" htmlFor="topic-input">
            1. What do you want to learn today?
          </label>
          <p className="form-sublabel">
            Type any school subject, curiosity, or value (up to 100 characters).
          </p>

          <input
            id="topic-input"
            type="text"
            className="input-text"
            placeholder="e.g. The Water Cycle, Gravity, Honesty, Fractions..."
            value={topic}
            maxLength={100}
            onChange={(e) => {
              setTopic(e.target.value);
              if (onClearError) onClearError();
            }}
            required
          />

          <div className="topic-counter">
            <span>Try one of these fun ideas:</span>
            <span>{topic.length} / 100</span>
          </div>

          <div className="chips-grid">
            {SUGGESTED_TOPICS.map((item) => (
              <button
                type="button"
                key={item.value}
                className="chip-btn"
                onClick={() => {
                  setTopic(item.value);
                  if (onClearError) onClearError();
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* AGE GROUP SELECTION */}
        <div className="form-group">
          <label className="form-label">
            2. Choose the learner's age group
          </label>
          <p className="form-sublabel">
            The story length, vocabulary, and quiz questions adapt automatically to match their level.
          </p>

          <div className="age-grid">
            {AGE_OPTIONS.map((opt) => {
              const isSelected = ageGroup === opt.id;
              return (
                <div
                  key={opt.id}
                  className={`age-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setAgeGroup(opt.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="age-card-header">
                    <span className="age-years">{opt.label}</span>
                    <span className="age-badge">{opt.sublabel}</span>
                  </div>
                  <div className="age-desc">{opt.description}</div>
                  <div className="age-wordcount">{opt.words}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LANGUAGE & LENGTH */}
        <div className="select-grid form-group">
          <div>
            <label className="form-label" htmlFor="lang-select">
              <Globe size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
              3. Language
            </label>
            <p className="form-sublabel">Learn in your native or preferred language.</p>
            <select
              id="lang-select"
              className="input-text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">
              <Clock size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
              4. Story Length
            </label>
            <p className="form-sublabel">Adjust the reading session length.</p>
            <div className="length-options">
              {['short', 'medium', 'long'].map((len) => (
                <button
                  type="button"
                  key={len}
                  className={`length-btn ${length === len ? 'selected' : ''}`}
                  onClick={() => setLength(len)}
                >
                  {len.charAt(0).toUpperCase() + len.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isLoading || !topic.trim()}
            style={{ minWidth: '240px' }}
          >
            <Sparkles size={20} />
            {isLoading ? "Writing Your Story..." : "✨ Create My Story"}
          </button>
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Takes only 3–5 seconds • 100% child safe
          </div>
        </div>
      </form>
    </div>
  );
}
