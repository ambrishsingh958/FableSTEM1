import React from 'react';

export default function SceneIllustrator({ topic = "" }) {
  const t = topic.toLowerCase();

  // Water cycle theme
  if (t.includes('water') || t.includes('rain') || t.includes('cloud')) {
    return (
      <div style={{
        background: 'linear-gradient(180deg, #bae6fd 0%, #e0f2fe 50%, #bfdbfe 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        margin: '1.25rem 0',
        border: '2px solid #7dd3fc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Sun */}
        <div style={{ textAlign: 'center', animation: 'floatSun 3s ease-in-out infinite alternate' }}>
          <div style={{ fontSize: '3rem' }}>☀️</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309' }}>Solar Heat</div>
        </div>

        {/* Rising Vapor arrow */}
        <div style={{ textAlign: 'center', color: '#0284c7', fontSize: '1.2rem', fontWeight: 800 }}>
          <div>☁️ ☁️</div>
          <div style={{ fontSize: '0.75rem' }}>⬆️ Evaporation</div>
        </div>

        {/* Rain Cloud */}
        <div style={{ textAlign: 'center', animation: 'floatCloud 4s ease-in-out infinite alternate' }}>
          <div style={{ fontSize: '3rem' }}>🌧️</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1' }}>Precipitation</div>
        </div>

        {/* River / Pond */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🌊</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1d4ed8' }}>Collection</div>
        </div>

        <style>{`
          @keyframes floatSun { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
          @keyframes floatCloud { 0% { transform: translateY(0); } 100% { transform: translateY(-6px); } }
        `}</style>
      </div>
    );
  }

  // Photosynthesis theme
  if (t.includes('photo') || t.includes('plant') || t.includes('tree') || t.includes('leaf')) {
    return (
      <div style={{
        background: 'linear-gradient(180deg, #fef3c7 0%, #dcfce7 60%, #bbf7d0 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        margin: '1.25rem 0',
        border: '2px solid #86efac',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>☀️</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309' }}>Sunlight</div>
        </div>
        <div style={{ fontSize: '1.5rem', color: '#16a34a' }}>+</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🌿</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d' }}>Chlorophyll</div>
        </div>
        <div style={{ fontSize: '1.5rem', color: '#16a34a' }}>+</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>💧</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7' }}>Water (H₂O)</div>
        </div>
        <div style={{ fontSize: '1.5rem', color: '#16a34a' }}>➔</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🍃 🍓</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#166534' }}>Oxygen + Food</div>
        </div>
      </div>
    );
  }

  // Solar system theme
  if (t.includes('solar') || t.includes('planet') || t.includes('space') || t.includes('star')) {
    return (
      <div style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        margin: '1.25rem 0',
        border: '2px solid #6366f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>☀️</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24' }}>Sun</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>🪐</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1' }}>Orbits</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>🌍</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>Earth</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>🚀</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e' }}>Gravity</div>
        </div>
      </div>
    );
  }

  // Default warm storybook scene
  return (
    <div style={{
      background: 'linear-gradient(135deg, #ede9fe 0%, #fef3c7 100%)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem 1.75rem',
      margin: '1.25rem 0',
      border: '1px solid #c7d2fe',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem' }}>📖</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4338ca' }}>Story Quest</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem' }}>✨</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309' }}>Curiosity</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem' }}>🌱</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d' }}>Knowledge Grows</div>
      </div>
    </div>
  );
}
