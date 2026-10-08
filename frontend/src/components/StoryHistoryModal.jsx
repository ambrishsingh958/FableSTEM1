import React from 'react';
import { X, BookOpen, Clock, Trash2, ArrowRight } from 'lucide-react';

export default function StoryHistoryModal({ history = [], onSelectStory, onClearHistory, onClose }) {
  return (
    <div className="certificate-modal-overlay">
      <div 
        style={{
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '600px',
          width: '100%',
          padding: '2rem',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={22} color="#4f46e5" /> Recent Stories
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={22} />
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Saved privately in your browser's local memory. No personal data is stored on any server.
        </p>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '4px' }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              No stories saved yet. Create your first story to see it here!
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
                    {item.storyData?.title || item.topic}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                      {item.topic}
                    </span>
                    <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                      Ages {item.ageGroup}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {item.date}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    onSelectStory(item);
                    onClose();
                  }}
                >
                  Read <ArrowRight size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ color: '#ef4444' }}
              onClick={onClearHistory}
            >
              <Trash2 size={14} /> Clear History
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
