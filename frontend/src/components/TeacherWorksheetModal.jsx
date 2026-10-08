import React, { useState } from 'react';
import { X, Printer, GraduationCap, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function TeacherWorksheetModal({ storyData, topic, ageGroup, quizQuestions = [], onClose }) {
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  const { title, story, reading_level, vocabulary = [], moral } = storyData || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="certificate-modal-overlay">
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '850px',
        width: '100%',
        padding: '2.5rem 2rem',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Controls bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e1b4b' }}>
                Teacher Classroom Worksheet & Lesson Plan
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Aligned with Educational Standards • Ready for Print & Classroom Handouts
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAnswerKey(!showAnswerKey)}
            >
              {showAnswerKey ? <EyeOff size={14} /> : <Eye size={14} />}
              {showAnswerKey ? "Hide Answer Key" : "Show Teacher Answer Key"}
            </button>

            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={14} /> Print Worksheet
            </button>

            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Printable Worksheet Body */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px' }} id="printable-worksheet">
          {/* Student Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: '1rem',
            borderBottom: '2px solid #0f172a',
            paddingBottom: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            <div>
              <strong>Student Name:</strong> ____________________________________
            </div>
            <div>
              <strong>Date:</strong> _______________
            </div>
            <div>
              <strong>Class / Grade:</strong> _________
            </div>
          </div>

          {/* Curriculum Standard Badge */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem'
          }}>
            <strong>Curriculum Standards:</strong> NGSS Science Inquiry & CCSS ELA Reading Informational Text (Grade Level: {reading_level || `Age ${ageGroup}`}).
            <br />
            <strong>Objective:</strong> Learners demonstrate conceptual comprehension of {topic} through narrative analysis and textual evidence.
          </div>

          {/* Story Reading Section */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '0.5rem' }}>
              Part 1: Reading Passage — {title}
            </h3>
            <div style={{
              fontSize: '0.95rem',
              lineHeight: 1.75,
              background: '#fdfdfd',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)'
            }}>
              {story}
            </div>
          </div>

          {/* Vocabulary Fill-in */}
          {vocabulary && vocabulary.length > 0 && (
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Part 2: Key Vocabulary Match
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Match each word with its correct meaning based on the text:
              </p>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {vocabulary.map((v, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 700, width: '130px', color: '#4338ca' }}>
                      {i + 1}. {v.word}
                    </span>
                    <span>➔ {showAnswerKey ? v.meaning : "________________________________________________________"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comprehension Questions */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Part 3: Reading Comprehension Questions
            </h3>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {quizQuestions.map((q, idx) => (
                <div key={q.id || idx} style={{ borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                    {idx + 1}. {q.question}
                  </div>

                  {q.type === 'mcq' && q.options && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', fontSize: '0.85rem' }}>
                      {q.options.map((opt, i) => (
                        <div key={i}>
                          ({String.fromCharCode(65 + i)}) {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'tf' && (
                    <div style={{ fontSize: '0.85rem' }}>
                      [  ] True &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [  ] False
                    </div>
                  )}

                  {q.type === 'short' && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                      Answer: ____________________________________________________________________________
                    </div>
                  )}

                  {/* Teacher Answer Key Reveal */}
                  {showAnswerKey && (
                    <div style={{
                      marginTop: '0.5rem',
                      background: '#dcfce7',
                      border: '1px solid #86efac',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.85rem',
                      color: '#166534'
                    }}>
                      <strong>Teacher Answer Key:</strong> {q.answer}
                      <br />
                      <em>Rubric & Explanation: {q.explanation}</em>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'right', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Worksheet
          </button>
        </div>
      </div>
    </div>
  );
}
