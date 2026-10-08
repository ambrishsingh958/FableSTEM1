import React from 'react';
import { X, BarChart3, TrendingUp, Award, Clock, BookOpen, Target, Sparkles } from 'lucide-react';

export default function AnalyticsDashboardModal({ user, onClose, onSelectTopic }) {
  const categories = [
    { name: "Science & Physics", score: 92, color: "#4f46e5", bg: "#e0e7ff" },
    { name: "Nature & Biology", score: 88, color: "#10b981", bg: "#d1fae5" },
    { name: "Values & Kindness", score: 96, color: "#ec4899", bg: "#fce7f3" },
    { name: "Math & Systems", score: 85, color: "#f59e0b", bg: "#fef3c7" },
  ];

  const recommendations = [
    { title: "How Thunderstorms Work ⚡", category: "Earth Science", age: "8-10" },
    { title: "Why Bees Love Flowers 🐝", category: "Ecosystems", age: "5-7" },
    { title: "The Secrets of Gravity 🪐", category: "Physics", age: "11-14" },
  ];

  return (
    <div className="certificate-modal-overlay">
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '620px',
        width: '100%',
        padding: '2rem',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
          title="Close"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1e1b4b' }}>
              Learning Analytics & Growth Insights
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Comprehension tracking and personalized AI recommendations for {user?.name || "Curious Learner"}
            </div>
          </div>
        </div>

        {/* Weekly Reading Goal Card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b' }}>
              <Clock size={16} color="#4f46e5" /> Weekly Reading Goal
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4f46e5' }}>
              35 / 50 Minutes (70%)
            </span>
          </div>

          <div style={{
            height: '10px',
            background: '#e2e8f0',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: '70%',
              background: 'linear-gradient(90deg, #4f46e5, #10b981)',
              borderRadius: '999px'
            }} />
          </div>
        </div>

        {/* Comprehension Mastery by Subject */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Target size={18} color="#10b981" /> Comprehension by Domain
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {categories.map((cat, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  <span>{cat.name}</span>
                  <span style={{ color: cat.color }}>{cat.score}% Mastery</span>
                </div>
                <div style={{
                  height: '8px',
                  background: '#f1f5f9',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${cat.score}%`,
                    background: cat.color,
                    borderRadius: '999px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Learning Path Recommendations */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={18} color="#f59e0b" /> AI Recommended Next Topics
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Based on your quiz strengths, Gemini recommends exploring these next:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                    {rec.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {rec.category} • Ages {rec.age}
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    if (onSelectTopic) onSelectTopic(rec.title.replace(/[^\w\s]/gi, '').trim());
                    onClose();
                  }}
                >
                  Start ➔
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div style={{ textAlign: 'right', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
