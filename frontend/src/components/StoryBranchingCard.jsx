import React, { useState } from 'react';
import { Compass, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { playSuccessChime, playClickSound } from '../services/soundEffects';

export default function StoryBranchingCard({ topic = "", onBranchSelected, onAddXp }) {
  const [chosenBranch, setChosenBranch] = useState(null);

  const t = topic.toLowerCase();

  // Branch options adapted to the topic
  let optionA = {
    title: "Mountain Glacier Journey 🏔️",
    desc: "Fly high into freezing peaks and see how cold air turns vapor into sparkling snow crystals!",
    continuation: "High above the jagged mountain peaks, the freezing wind whistled. Pip felt the temperature drop below freezing. Instead of falling as a gentle raindrop, Pip crystallized into a sparkling, six-sided snowflake! Pip drifted softly onto a giant glacier, resting peacefully among millions of snowy friends."
  };

  let optionB = {
    title: "Tropical Rainforest Waterfall 🌴",
    desc: "Float toward vibrant jungle canopies, nourishing giant ferns and singing tree frogs!",
    continuation: "Riding a warm ocean breeze, Pip soared towards an emerald-green rainforest. Below, colorful toucans sang among towering trees. Pip joined a gentle tropical sunshower, splashing onto a giant monstera leaf, trickling all the way down into a crystal-clear jungle stream that buzzed with happy wildlife."
  };

  if (t.includes('photo') || t.includes('plant')) {
    optionA = {
      title: "Nighttime Respiration Mission 🌙",
      desc: "Explore what happens inside plant leaves after the sun goes down!",
      continuation: "When the golden sun slipped below the horizon, the plant didn't stop working. In the peaceful night air, the leaf used the sugar energy it had stored during the day to grow strong new roots and tiny flower buds, ready to greet tomorrow's sunrise."
    };
    optionB = {
      title: "Deep Root Explorer 💧",
      desc: "Travel beneath the soil with tiny root hairs absorbing rich minerals!",
      continuation: "Down in the rich dark earth, microscopic root hairs reached out like friendly fingers. They collected essential nitrogen and phosphorus minerals from the soil, sending water up like a high-speed elevator to nourish every green leaf."
    };
  }

  const handleChoose = (branch, text) => {
    playClickSound();
    setChosenBranch(branch);
    playSuccessChime();
    if (onBranchSelected) onBranchSelected(text);
    if (onAddXp) onAddXp(25);
  };

  return (
    <div style={{
      marginTop: '2rem',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
      border: '2px solid #a7f3d0',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={22} color="#059669" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46' }}>
            Choose Your Own Adventure!
          </h3>
        </div>
        <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
          +25 Bonus XP
        </span>
      </div>

      <p style={{ fontSize: '0.88rem', color: '#047857', marginBottom: '1.25rem' }}>
        You're the storyteller now! Where should our characters travel next? Pick a path below:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div
          className="branch-card"
          onClick={() => handleChoose('A', optionA.continuation)}
          style={{
            borderColor: chosenBranch === 'A' ? '#10b981' : '#cbd5e1',
            background: chosenBranch === 'A' ? '#ecfdf5' : 'white'
          }}
        >
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#065f46', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{optionA.title}</span>
            {chosenBranch === 'A' && <CheckCircle size={18} color="#10b981" />}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {optionA.desc}
          </p>
        </div>

        <div
          className="branch-card"
          onClick={() => handleChoose('B', optionB.continuation)}
          style={{
            borderColor: chosenBranch === 'B' ? '#10b981' : '#cbd5e1',
            background: chosenBranch === 'B' ? '#ecfdf5' : 'white'
          }}
        >
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#065f46', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{optionB.title}</span>
            {chosenBranch === 'B' && <CheckCircle size={18} color="#10b981" />}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            {optionB.desc}
          </p>
        </div>
      </div>

      {chosenBranch && (
        <div style={{
          marginTop: '1.25rem',
          background: 'white',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          color: '#065f46'
        }}>
          <strong>✨ Your Story Chapter Unlocked:</strong>
          <div style={{ marginTop: '0.35rem' }}>
            {chosenBranch === 'A' ? optionA.continuation : optionB.continuation}
          </div>
        </div>
      )}
    </div>
  );
}
