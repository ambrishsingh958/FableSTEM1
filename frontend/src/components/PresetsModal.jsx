import React from 'react';
import { X, PlayCircle, Sparkles, BookOpen, ArrowRight, Zap, Check } from 'lucide-react';
import { playClickSound, playSuccessChime } from '../services/soundEffects';

const PRESET_STORIES = [
  {
    id: "water_cycle_young",
    topic: "Water Cycle",
    age_group: "5-7",
    language: "English",
    label: "🌧️ Water Cycle (Ages 5-7, Early Reader)",
    desc: "Short sentences, friendly raindrops, gentle discovery.",
    badgeColor: "#dbeafe",
    textColor: "#1e40af"
  },
  {
    id: "water_cycle_older",
    topic: "Water Cycle",
    age_group: "11-14",
    language: "English",
    label: "🔬 Water Cycle (Ages 11-14, Middle School)",
    desc: "Transpiration, aquifers, thermodynamics, conceptual depth.",
    badgeColor: "#ede9fe",
    textColor: "#5b21b6"
  },
  {
    id: "photosynthesis_elem",
    topic: "Photosynthesis",
    age_group: "8-10",
    language: "English",
    label: "🌿 Photosynthesis (Ages 8-10, Elementary)",
    desc: "Sunlight, chlorophyll, plant leaves, adventure quest.",
    badgeColor: "#d1fae5",
    textColor: "#065f46"
  },
  {
    id: "solar_system_teen",
    topic: "The Solar System",
    age_group: "11-14",
    language: "English",
    label: "🪐 Solar System & Gravity (Ages 11-14)",
    desc: "Orbits, cosmic scale, planetary composition, space exploration.",
    badgeColor: "#fef3c7",
    textColor: "#92400e"
  },
  {
    id: "honesty_young",
    topic: "Honesty & Friendship",
    age_group: "5-7",
    language: "English",
    label: "💖 Honesty & Kindness (Ages 5-7)",
    desc: "Moral education, sharing, trust, heartwarming ending.",
    badgeColor: "#fce7f3",
    textColor: "#9d174d"
  }
];

export default function PresetsModal({ onSelectPreset, onClose }) {
  const handleSelect = (preset) => {
    playSuccessChime();
    onSelectPreset(preset);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '680px', 
          width: '95%', 
          padding: '2rem', 
          borderRadius: '24px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#ede9fe',
              color: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PlayCircle size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>
                Instant STEM Story Presets
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Pick a benchmark topic to load and generate instantly
              </p>
            </div>
          </div>

          <button 
            type="button" 
            className="btn btn-secondary btn-icon" 
            onClick={onClose}
            aria-label="Close Presets"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preset Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {PRESET_STORIES.map((p) => (
            <div
              key={p.id}
              onClick={() => handleSelect(p)}
              style={{
                background: 'white',
                border: '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1rem 1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{
                    background: p.badgeColor,
                    color: p.textColor,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    Ages {p.age_group}
                  </span>
                  <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>
                    {p.topic}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {p.desc}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '10px', pointerEvents: 'none' }}
              >
                Load <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            style={{ borderRadius: '12px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
