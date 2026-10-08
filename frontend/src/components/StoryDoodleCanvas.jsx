import React, { useRef, useState, useEffect } from 'react';
import { 
  Palette, Eraser, Trash2, Download, Undo, Sparkles, 
  Check, Brush, Smile, Heart 
} from 'lucide-react';
import { playClickSound, playSuccessChime } from '../services/soundEffects';

const COLORS = [
  { name: "Indigo", value: "#4f46e5" },
  { name: "Sky Blue", value: "#0ea5e9" },
  { name: "Emerald", value: "#10b981" },
  { name: "Sunny Amber", value: "#f59e0b" },
  { name: "Rose Red", value: "#ef4444" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Dark Slate", value: "#1e293b" }
];

const STICKERS = ["💧", "☀️", "☁️", "🌱", "🚀", "⭐", "💖", "🌈"];

export default function StoryDoodleCanvas({ topic = "", onAddXp }) {
  const [isOpen, setIsOpen] = useState(false);
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#4f46e5");
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas white background
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [isOpen]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const handleStart = (e) => {
    if (selectedSticker) {
      // Stamp sticker onto canvas
      const { x, y } = getCoordinates(e);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.font = '36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedSticker, x, y);
      playSuccessChime();
      setHasDrawn(true);
      return;
    }

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? brushSize * 3 : brushSize;
  };

  const handleDraw = (e) => {
    if (!isDrawing || selectedSticker) return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const handleStop = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    playClickSound();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    playSuccessChime();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `StoryTeacher_${topic.replace(/\s+/g, '_')}_Drawing.png`;
    a.click();
    if (onAddXp && hasDrawn) onAddXp(25);
  };

  if (!isOpen) {
    return (
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          className="btn btn-secondary"
          onClick={() => {
            playClickSound();
            setIsOpen(true);
          }}
          style={{
            background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)',
            border: '2px solid #d946ef',
            color: '#a21caf',
            fontWeight: 800,
            padding: '0.75rem 1.75rem',
            borderRadius: '999px',
            boxShadow: '0 4px 14px rgba(217, 70, 239, 0.2)'
          }}
        >
          <Palette size={18} color="#d946ef" /> 🎨 Draw & Color What You Learned (+25 XP)
        </button>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: '2.5rem',
      background: 'white',
      border: '2px solid #e879f9',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Palette size={22} color="#c026d3" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#701a75' }}>
            Story Coloring & Doodle Studio
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleClear} title="Clear Canvas">
            <Trash2 size={14} /> Clear
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleDownload} title="Save Drawing">
            <Download size={14} /> Save Artwork
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setIsOpen(false)}>
            Close Studio
          </button>
        </div>
      </div>

      {/* Tools Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Color Palette */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Colors:</span>
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                playClickSound();
                setColor(c.value);
                setIsEraser(false);
                setSelectedSticker(null);
              }}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: c.value,
                border: color === c.value && !isEraser && !selectedSticker ? '3px solid #0f172a' : '1px solid #cbd5e1',
                cursor: 'pointer',
                transform: color === c.value && !isEraser ? 'scale(1.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
              title={c.name}
            />
          ))}

          {/* Eraser */}
          <button
            onClick={() => {
              playClickSound();
              setIsEraser(!isEraser);
              setSelectedSticker(null);
            }}
            className={`btn btn-sm ${isEraser ? 'btn-accent' : 'btn-secondary'}`}
            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
            title="Eraser"
          >
            <Eraser size={13} />
          </button>
        </div>

        {/* Brush Size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Size:</span>
          {[3, 6, 12].map((s) => (
            <button
              key={s}
              onClick={() => {
                playClickSound();
                setBrushSize(s);
              }}
              className={`btn btn-sm ${brushSize === s ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
            >
              {s === 3 ? 'Fine' : s === 6 ? 'Med' : 'Bold'}
            </button>
          ))}
        </div>

        {/* Fun Stamps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Stamps:</span>
          {STICKERS.map((st) => (
            <button
              key={st}
              onClick={() => {
                playClickSound();
                setSelectedSticker(selectedSticker === st ? null : st);
                setIsEraser(false);
              }}
              style={{
                border: selectedSticker === st ? '2px solid #d946ef' : '1px solid #e2e8f0',
                background: selectedSticker === st ? '#fdf4ff' : 'white',
                borderRadius: '6px',
                padding: '2px 5px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
              title={`Stamp ${st}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div style={{
        border: '2px dashed #e2e8f0',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)'
      }}>
        <canvas
          ref={canvasRef}
          width={750}
          height={380}
          style={{ width: '100%', height: 'auto', display: 'block', cursor: selectedSticker ? 'copy' : isEraser ? 'cell' : 'crosshair', touchAction: 'none' }}
          onMouseDown={handleStart}
          onMouseMove={handleDraw}
          onMouseUp={handleStop}
          onMouseLeave={handleStop}
          onTouchStart={handleStart}
          onTouchMove={handleDraw}
          onTouchEnd={handleStop}
        />
      </div>

      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.65rem', textAlign: 'center' }}>
        💡 Tip: Select a stamp emoji like 💧 or ☀️ and click on the canvas to place it, or pick a color to draw!
      </div>
    </div>
  );
}
