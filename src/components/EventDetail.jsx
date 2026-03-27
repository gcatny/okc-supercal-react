import React, { useEffect, useRef, useState } from 'react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../data/categories';
import { CATEGORY_IMAGES } from '../data/categoryImages';
import { buildGCalUrl, voteKey } from '../utils/eventUtils';

function EventHero({ event }) {
  const fallback = CATEGORY_IMAGES[event.cat] || CATEGORY_IMAGES['fest'];
  // Use event-specific image if present, otherwise the category fallback photo
  const src = event.image || fallback.url;
  const [imgSrc, setImgSrc] = useState(src);
  const [usedGradient, setUsedGradient] = useState(false);

  // If the event image changes (different event clicked), reset state
  useEffect(() => {
    setImgSrc(event.image || fallback.url);
    setUsedGradient(false);
  }, [event.image, event.cat]);

  if (usedGradient) {
    // Last resort: colored gradient + emoji
    return (
      <div
        className="detail-hero"
        style={{ background: fallback.gradient }}
        aria-hidden="true"
      >
        <span className="detail-hero-emoji">{fallback.emoji}</span>
      </div>
    );
  }

  return (
    <div className="detail-hero">
      <img
        src={imgSrc}
        alt={event.name}
        className="detail-hero-img"
        onError={() => {
          // If event-specific image fails, try the category fallback photo
          if (imgSrc !== fallback.url) {
            setImgSrc(fallback.url);
          } else {
            // Category photo also failed — use gradient
            setUsedGradient(true);
          }
        }}
      />
      <div className="detail-hero-scrim" />
    </div>
  );
}

export default function EventDetail({ event, onClose, onVote, voteCount, hasVoted }) {
  const detailRef = useRef(null);

  // Scroll the detail card into view when it appears or the event changes
  useEffect(() => {
    if (event && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [event]);

  if (!event) return null;

  const gCalUrl = buildGCalUrl(event);
  const key = voteKey(event);
  const color = CATEGORY_COLORS[event.cat] || '#888';
  const label = CATEGORY_LABELS[event.cat] || event.cat;

  return (
    <div className="detail open" ref={detailRef}>
      <EventHero event={event} />

      <div className="dtop">
        <div>
          <span className={`dcat ${event.cat}`}>{label}</span>
          {event.free && <span className="freebadge">FREE</span>}
          <div className="dname">{event.name}</div>
          <div className="dmeta">
            <span>📅 {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>📍 {event.venue}</span>
            {event.district && <span>🏘️ {event.district}</span>}
            {event.source && <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Source: {event.source}</span>}
          </div>
        </div>
        <button className="cx" onClick={onClose}>✕</button>
      </div>
      {event.desc && <div className="ddesc">{event.desc}</div>}
      <div className="dactions">
        <a href={gCalUrl} target="_blank" rel="noopener noreferrer" className="gcal-btn" onClick={e => e.stopPropagation()}>
          📅 Add to Google Calendar
        </a>
        {event.tickets && (
          <a href={event.tickets} target="_blank" rel="noopener noreferrer" className="tx-btn">
            🎟️ Tickets / Website
          </a>
        )}
        <button
          className={`upvote-btn${hasVoted ? ' voted' : ''}`}
          onClick={(e) => { e.stopPropagation(); onVote(key); }}
        >
          <span className="uv-icon">▲</span>
          <span className="uv-count">{voteCount || 0}</span>
          <span className="uv-label">likes</span>
        </button>
      </div>
    </div>
  );
}
