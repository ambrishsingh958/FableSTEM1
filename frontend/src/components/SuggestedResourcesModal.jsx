import React, { useState } from 'react';
import { 
  X, ExternalLink, ShoppingBag, BookOpen, Globe, Search, 
  Sparkles, Star, Award, Compass, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { playClickSound, playOptionSelect, playSuccessChime } from '../services/soundEffects';
import { 
  getSuggestedBooks, 
  getCuratedPortals, 
  getAmazonUrl, 
  getFlipkartUrl, 
  getGoogleSearchUrl,
  getGoogleBooksUrl 
} from '../services/resourceCurator';

export default function SuggestedResourcesModal({ 
  topic, 
  ageGroup = "8-10", 
  onClose,
  onAddXp
}) {
  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'portals' | 'search'
  const [useAmazonIn, setUseAmazonIn] = useState(true); // Toggle Amazon.in vs Amazon.com
  const [customQuery, setCustomQuery] = useState("");

  const books = getSuggestedBooks(topic, ageGroup);
  const portals = getCuratedPortals(topic);

  const handleExternalClick = () => {
    playSuccessChime();
    if (onAddXp) onAddXp(15);
  };

  const handleCustomSearch = (platform) => {
    playClickSound();
    const query = customQuery.trim() || topic;
    let url = "";
    if (platform === 'amazon') {
      url = getAmazonUrl(query, useAmazonIn);
    } else if (platform === 'flipkart') {
      url = getFlipkartUrl(query);
    } else {
      url = getGoogleSearchUrl(query, ageGroup);
    }
    handleExternalClick();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '820px', 
          width: '95%', 
          padding: '2rem', 
          borderRadius: '24px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)'
            }}>
              <BookOpen size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                  STEM Discovery Hub
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Ages {ageGroup}
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>
                Books & Web Explorer: "{topic}"
              </h2>
            </div>
          </div>

          <button 
            type="button" 
            className="btn btn-secondary btn-icon" 
            onClick={onClose}
            aria-label="Close Explorer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '0.75rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'books' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                playClickSound();
                setActiveTab('books');
              }}
              style={{ borderRadius: '20px', fontSize: '0.85rem' }}
            >
              📖 Suggested Books ({books.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'portals' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                playClickSound();
                setActiveTab('portals');
              }}
              style={{ borderRadius: '20px', fontSize: '0.85rem' }}
            >
              🌐 Educational Websites ({portals.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'search' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                playClickSound();
                setActiveTab('search');
              }}
              style={{ borderRadius: '20px', fontSize: '0.85rem' }}
            >
              🔍 Search Marketplaces
            </button>
          </div>

          {/* Region selector for Amazon */}
          {activeTab === 'books' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#475569' }}>
              <span>Store:</span>
              <button
                type="button"
                onClick={() => setUseAmazonIn(!useAmazonIn)}
                style={{
                  background: useAmazonIn ? '#fef3c7' : '#e0e7ff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: useAmazonIn ? '#b45309' : '#4338ca'
                }}
                title="Switch between Amazon India (.in) and Amazon Global (.com)"
              >
                {useAmazonIn ? "🇮🇳 Amazon.in (India)" : "🌐 Amazon.com (Global)"}
              </button>
            </div>
          )}
        </div>

        {/* Tab Content 1: Suggested Books */}
        {activeTab === 'books' && (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
            <div style={{
              background: '#f8fafc',
              padding: '0.75rem 1rem',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>
                💡 Hand-picked books for <strong>Ages {ageGroup}</strong> to deepen understanding after the story.
              </span>
              <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                Earn +15 XP on Click
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {books.map((b, idx) => {
                const amazonUrl = getAmazonUrl(b.amazonQuery, useAmazonIn);
                const flipkartUrl = getFlipkartUrl(b.flipkartQuery);
                const googleBooksUrl = getGoogleBooksUrl(b.amazonQuery);

                return (
                  <div
                    key={idx}
                    style={{
                      background: 'white',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '18px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        {/* Book Icon / Emoji Avatar */}
                        <div style={{
                          width: '52px',
                          height: '64px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                          border: '2px solid #bfdbfe',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.8rem',
                          flexShrink: 0,
                          boxShadow: '2px 3px 6px rgba(0,0,0,0.06)'
                        }}>
                          {b.coverEmoji}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                            <span style={{
                              background: '#fef3c7',
                              color: '#92400e',
                              padding: '0.1rem 0.5rem',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800
                            }}>
                              {b.age}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.8rem', color: '#eab308', fontWeight: 800 }}>
                              <Star size={13} fill="#eab308" /> {b.rating}
                            </span>
                          </div>

                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                            {b.title}
                          </h3>
                          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                            By {b.author}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                      {b.blurb}
                    </p>

                    {/* Direct Buy & Explorer Buttons */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      flexWrap: 'wrap',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid #f1f5f9'
                    }}>
                      {/* Amazon Button */}
                      <a
                        href={amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleExternalClick}
                        style={{
                          background: '#ff9900',
                          color: '#111827',
                          padding: '0.45rem 0.9rem',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          boxShadow: '0 2px 6px rgba(255, 153, 0, 0.3)',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        🛒 {useAmazonIn ? "Amazon.in" : "Amazon"} <ExternalLink size={12} />
                      </a>

                      {/* Flipkart Button */}
                      <a
                        href={flipkartUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleExternalClick}
                        style={{
                          background: '#2874f0',
                          color: 'white',
                          padding: '0.45rem 0.9rem',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          boxShadow: '0 2px 6px rgba(40, 116, 240, 0.3)',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        🛍️ Flipkart <ExternalLink size={12} />
                      </a>

                      {/* Google Books Preview */}
                      <a
                        href={googleBooksUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleExternalClick}
                        style={{
                          background: '#f8fafc',
                          color: '#334155',
                          border: '1.5px solid #cbd5e1',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <Search size={12} /> Google Books Preview
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 2: Curated Websites */}
        {activeTab === 'portals' && (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
            <div style={{
              background: '#f0fdf4',
              padding: '0.75rem 1rem',
              borderRadius: '14px',
              border: '1px solid #bbf7d0',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>
                🚀 Verified safe educational websites with interactive simulators, videos, and articles on <strong>{topic}</strong>.
              </span>
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                Safe for Kids
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1rem'
            }}>
              {portals.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'white',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.8rem' }}>{p.icon}</span>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}>
                        {p.badge}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {p.name}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.45 }}>
                      {p.description}
                    </p>
                  </div>

                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleExternalClick}
                    className="btn btn-secondary btn-sm"
                    style={{
                      marginTop: '1rem',
                      justifyContent: 'center',
                      borderColor: '#cbd5e1',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    Open on {p.name.split(' ')[0]} <ExternalLink size={13} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Custom Search on Marketplaces */}
        {activeTab === 'search' && (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '18px',
              padding: '1.5rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '0.4rem' }}>
                Search Any STEM Book or Topic Across Stores
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '520px', margin: '0 auto 1.25rem auto' }}>
                Type a topic, author, or book title to instantly search Amazon, Flipkart, or Google with one click!
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '560px', margin: '0 auto' }}>
                <input
                  type="text"
                  placeholder={`Search e.g. "${topic} for children"...`}
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '2px solid #cbd5e1',
                    fontSize: '0.95rem'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCustomSearch('amazon');
                  }}
                />
              </div>

              {/* 3 Quick-Search Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleCustomSearch('amazon')}
                  style={{
                    background: '#ff9900',
                    color: '#111827',
                    border: 'none',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(255, 153, 0, 0.3)'
                  }}
                >
                  🛒 Search on Amazon <ExternalLink size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => handleCustomSearch('flipkart')}
                  style={{
                    background: '#2874f0',
                    color: 'white',
                    border: 'none',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(40, 116, 240, 0.3)'
                  }}
                >
                  🛍️ Search on Flipkart <ExternalLink size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => handleCustomSearch('google')}
                  style={{
                    background: '#4285f4',
                    color: 'white',
                    border: 'none',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)'
                  }}
                >
                  🔍 Search on Google <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* Quick Links Banner */}
            <div style={{
              background: '#fefce8',
              border: '1.5px solid #fef08a',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '2rem' }}>📖</span>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', color: '#854d0e', fontSize: '0.95rem', fontWeight: 800 }}>
                  Why Physical Books + AI Stories Make the Ultimate Learning Duo:
                </h4>
                <p style={{ margin: 0, color: '#713f12', fontSize: '0.85rem', lineHeight: 1.45 }}>
                  FableSTEM provides immediate curiosity and tailored storytelling, while physical books build lasting tactile reading habits, family bedtime bonding, and deep topic exploration!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid #e2e8f0',
          marginTop: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🔗 Clicking any link safely opens official Amazon, Flipkart, or educational websites in a new window.
          </span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onClose}
            style={{ borderRadius: '12px', padding: '0.5rem 1.25rem' }}
          >
            Close Explorer ✨
          </button>
        </div>
      </div>
    </div>
  );
}
