import React, { useState, useEffect } from 'react';
import { X, Volume2, Sparkles, Zap, ArrowRight, BrainCircuit, Check } from 'lucide-react';
import { compareAges } from '../services/api';

export default function AgeLensModal({ topic = "The Water Cycle", onSelectStory, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSpeech, setActiveSpeech] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    compareAges({ topic: topic || "The Water Cycle", language: "English" })
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [topic]);

  const speakText = (text, rate, id) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (activeSpeech === id) {
      setActiveSpeech(null);
      return;
    }

    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.onend = () => setActiveSpeech(null);
    u.onerror = () => setActiveSpeech(null);
    window.speechSynthesis.speak(u);
    setActiveSpeech(id);
  };

  const young = data?.young;
  const older = data?.older;

  return (
    <div className="certificate-modal-overlay">
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '1050px',
        width: '100%',
        padding: '2rem',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#4f46e5', fontWeight: 800, fontSize: '0.85rem' }}>
              <Zap size={16} /> JUDGE DEMO MODE
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1e1b4b' }}>
              Age Lens Explorer: Side-by-Side Comparison
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              See how Gemini AI transforms the <strong>same topic</strong> (“{topic}”) to adapt vocabulary, length, and cognition.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={26} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <Sparkles size={36} color="#4f46e5" style={{ animation: 'spin 2s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: 600 }}>Analyzing and contrasting both age levels...</p>
          </div>
        ) : data ? (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '4px' }}>
            {/* Top comparison insight */}
            {data.comparison_summary && (
              <div style={{
                background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)',
                border: '1px solid #c7d2fe',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.25rem',
                fontSize: '0.9rem',
                color: '#3730a3',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }}>
                <BrainCircuit size={20} style={{ flexShrink: 0 }} />
                <span>{data.comparison_summary}</span>
              </div>
            )}

            {/* Split Columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem'
            }}>
              {/* Left Column: Age 5-7 */}
              <div style={{
                border: '2px solid #a5b4fc',
                background: '#faf5ff',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-amber" style={{ fontSize: '0.85rem' }}>
                    Ages 5–7 (Early Reader)
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e' }}>
                    {young?.reading_level}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4338ca', marginBottom: '0.75rem' }}>
                  {young?.title}
                </h3>

                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  <span>📏 <strong>Words:</strong> ~{young?.story?.split(' ').length}</span>
                  <span>✍️ <strong>Style:</strong> {young?.sentence_style}</span>
                </div>

                {/* Vocabulary Chips */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6d28d9', marginBottom: '0.35rem' }}>
                    Key Vocabulary:
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {young?.key_words?.map((w, i) => (
                      <span key={i} className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Story text */}
                <div style={{
                  flex: 1,
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  color: '#1e293b',
                  marginBottom: '1rem',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0'
                }}>
                  {young?.story}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => speakText(young?.story, 0.85, 'young')}
                  >
                    <Volume2 size={14} /> {activeSpeech === 'young' ? "Stop" : "Listen (Age 5–7)"}
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      onSelectStory({
                        title: young?.title,
                        story: young?.story,
                        reading_level: young?.reading_level,
                        vocabulary: young?.key_words?.map(w => ({ word: w, meaning: "Child friendly term" })),
                        moral: "Nature works together in wonderful ways!"
                      }, "5-7");
                      onClose();
                    }}
                  >
                    Load & Take Quiz <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Right Column: Age 11-14 */}
              <div style={{
                border: '2px solid #818cf8',
                background: '#f8fafc',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-indigo" style={{ fontSize: '0.85rem' }}>
                    Ages 11–14 (Middle School)
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3730a3' }}>
                    {older?.reading_level}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '0.75rem' }}>
                  {older?.title}
                </h3>

                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  <span>📏 <strong>Words:</strong> ~{older?.story?.split(' ').length}</span>
                  <span>🔬 <strong>Style:</strong> {older?.sentence_style}</span>
                </div>

                {/* Vocabulary Chips */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4338ca', marginBottom: '0.35rem' }}>
                    Key Vocabulary:
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {older?.key_words?.map((w, i) => (
                      <span key={i} className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Story text */}
                <div style={{
                  flex: 1,
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  color: '#1e293b',
                  marginBottom: '1rem',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0'
                }}>
                  {older?.story}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => speakText(older?.story, 0.95, 'older')}
                  >
                    <Volume2 size={14} /> {activeSpeech === 'older' ? "Stop" : "Listen (Age 11–14)"}
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      onSelectStory({
                        title: older?.title,
                        story: older?.story,
                        reading_level: older?.reading_level,
                        vocabulary: older?.key_words?.map(w => ({ word: w, meaning: "Scientific term" })),
                        moral: "Scientific inquiry reveals the laws governing natural systems."
                      }, "11-14");
                      onClose();
                    }}
                  >
                    Load & Take Quiz <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Failed to load comparison data.
          </div>
        )}

        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
