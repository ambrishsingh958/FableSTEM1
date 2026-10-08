import React, { useState } from 'react';
import { Award, X, Printer, Sparkles, Check } from 'lucide-react';

export default function CertificateModal({ topic, scorePercentage, badgeTitle, initialName = "Curious Learner", onClose }) {
  const [studentName, setStudentName] = useState(initialName || "Curious Learner");
  const [isEditing, setIsEditing] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="certificate-modal-overlay">
      <div className="certificate-card">
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
          title="Close modal"
        >
          <X size={24} />
        </button>

        {/* Golden Seal */}
        <div className="certificate-seal">
          <Award size={36} />
        </div>

        <div style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', marginBottom: '0.5rem' }}>
          Official Certificate of Learning
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1e1b4b', marginBottom: '1rem' }}>
          FableSTEM Scholar Award
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
          This diploma is proudly awarded to:
        </p>

        {/* Student Name */}
        <div style={{ marginBottom: '1.5rem' }}>
          {isEditing ? (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', maxWidth: '300px', margin: '0 auto' }}>
              <input
                type="text"
                className="input-text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                autoFocus
              />
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setIsEditing(false)}
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#4338ca',
                borderBottom: '2px solid #818cf8',
                padding: '0 1rem'
              }}>
                {studentName}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <p style={{ fontSize: '1rem', color: '#334155', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          For successfully completing the interactive educational story and comprehension quiz on 
          <strong style={{ color: '#1e1b4b' }}> “{topic}”</strong> with a score of <strong style={{ color: '#10b981' }}>{scorePercentage}%</strong>!
        </p>

        <div style={{
          display: 'inline-block',
          background: '#fef3c7',
          border: '1px solid #fde68a',
          padding: '0.4rem 1.25rem',
          borderRadius: '999px',
          fontWeight: 700,
          color: '#92400e',
          marginBottom: '2rem'
        }}>
          ✨ Awarded Title: {badgeTitle}
        </div>

        {/* Signatures & Date */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#4f46e5' }}>
              FableSTEM AI Mentor
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              AI Learning Assistant
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#1e293b' }}>
              {today}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Date of Completion
            </div>
          </div>
        </div>

        {/* Print / Action */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print / Save Diploma
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Back to Results
          </button>
        </div>
      </div>
    </div>
  );
}
