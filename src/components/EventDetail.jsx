import React, { useEffect, useRef } from 'react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../data/categories';
import { buildGCalUrl, voteKey } from '../utils/eventUtils';

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
