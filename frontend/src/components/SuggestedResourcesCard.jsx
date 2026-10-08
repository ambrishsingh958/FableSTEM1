import React, { useState } from 'react';
import { 
  BookOpen, ExternalLink, ShoppingBag, Star, Sparkles, 
  ArrowRight, Compass, Globe, Search 
} from 'lucide-react';
import { playClickSound, playSuccessChime } from '../services/soundEffects';
import { 
  getSuggestedBooks, 
  getAmazonUrl, 
  getFlipkartUrl, 
  getGoogleSearchUrl,
  getGoogleBooksUrl 
} from '../services/resourceCurator';

export default function SuggestedResourcesCard({ 
  topic, 
  ageGroup = "8-10", 
  onOpenFullModal,
  onAddXp 
}) {
  const [preferIndia, setPreferIndia] = useState(true);
  const books = getSuggestedBooks(topic, ageGroup).slice(0, 3); // Display top 3 inline

  const handleLinkClick = () => {
    playSuccessChime();
    if (onAddXp) onAddXp(15);
  };

  const googleSearchUrl = getGoogleSearchUrl(topic, ageGroup);

  return (
    <div style={{
      marginTop: '2.5rem',
      marginBottom: '2rem',
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #ffffff 100%)',
      border: '2px solid #fde68a',
      borderRadius: '24px',
      padding: '1.75rem',
      boxShadow: '0 4px 20px rgba(245, 158, 11, 0.08)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                Keep Exploring
              </span>
              <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 700 }}>
                Ages {ageGroup}
              </span>
            </div>
            <h3 style={{ margin: '0.1rem 0 0 0', fontSize: '1.3rem', fontWeight: 900, color: '#78350f' }}>
              Suggested Books & Web Deep-Dive
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Store Switcher */}
          <button
            type="button"
            onClick={() => setPreferIndia(!preferIndia)}
            style={{
              background: 'white',
              border: '1.5px solid #fde68a',
              borderRadius: '20px',
              padding: '0.3rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              color: '#92400e'
            }}
            title="Toggle Amazon region"
          >
            {preferIndia ? "🇮🇳 Amazon.in" : "🌐 Amazon.com"}
          </button>

          {/* Open Full Hub Button */}
          {onOpenFullModal && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                playClickSound();
                onOpenFullModal();
              }}
              style={{ borderRadius: '20px', fontWeight: 800 }}
            >
              <Compass size={14} /> Full Discovery Hub
            </button>
          )}
        </div>
      </div>

      <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', color: '#92400e', lineHeight: 1.5 }}>
        Loved reading about <strong>{topic}</strong>? Extend your learning journey with top-rated books on <strong>Amazon</strong> & <strong>Flipkart</strong>, or explore interactive simulators on <strong>Google</strong>:
      </p>

      {/* 3 Books Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        {books.map((b, idx) => {
          const amazonUrl = getAmazonUrl(b.amazonQuery, preferIndia);
          const flipkartUrl = getFlipkartUrl(b.flipkartQuery);
          const googleBooksUrl = getGoogleBooksUrl(b.amazonQuery);

          return (
            <div
              key={idx}
              style={{
                background: 'white',
                border: '1.5px solid #fef08a',
                borderRadius: '16px',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2rem', flexShrink: 0 }}>{b.coverEmoji}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#fef3c7', color: '#92400e', padding: '1px 5px', borderRadius: '4px' }}>
                        {b.age}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#eab308', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Star size={11} fill="#eab308" /> {b.rating}
                      </span>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.35 }}>
                      {b.title}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      By {b.author}
                    </div>
                  </div>
                </div>

                <p style={{ margin: '0.4rem 0 0.75rem 0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                  {b.blurb}
                </p>
              </div>

              {/* Direct Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                flexWrap: 'wrap',
                paddingTop: '0.6rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  style={{
                    background: '#ff9900',
                    color: '#111827',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    boxShadow: '0 2px 4px rgba(255,153,0,0.25)'
                  }}
                  title="Search & buy on Amazon"
                >
                  🛒 {preferIndia ? "Amazon.in" : "Amazon"} <ExternalLink size={11} />
                </a>

                <a
                  href={flipkartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  style={{
                    background: '#2874f0',
                    color: 'white',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    boxShadow: '0 2px 4px rgba(40,116,240,0.25)'
                  }}
                  title="Search & buy on Flipkart"
                >
                  🛍️ Flipkart <ExternalLink size={11} />
                </a>

                <a
                  href={googleBooksUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  style={{
                    background: '#f8fafc',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  title="Preview on Google Books"
                >
                  <Search size={11} /> Preview
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Web Deep-Dive Bar */}
      <div style={{
        background: 'white',
        border: '1.5px solid #fde68a',
        borderRadius: '16px',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Globe size={18} color="#4285f4" />
          <span style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
            Want more interactive science experiments and videos on <strong>{topic}</strong>?
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href={googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, borderColor: '#cbd5e1' }}
          >
            🔍 Google Kids Search <ExternalLink size={12} />
          </a>

          {onOpenFullModal && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                playClickSound();
                onOpenFullModal();
              }}
              style={{ borderRadius: '12px', fontSize: '0.78rem' }}
            >
              NASA, Khan Academy & PhET Labs 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
