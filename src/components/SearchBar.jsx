import React, { useRef, useEffect } from 'react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../data/categories';
import { MONTHS } from '../utils/dateUtils';

export default function SearchBar({
  searchQuery, onSearch, clearSearch,
  results, visibleResults, isOpen, setIsOpen, showMore, hasMore,
  onEventClick
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') { clearSearch(); }
    };
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [clearSearch, setIsOpen]);

  return (
    <div className="search-wrap" ref={wrapRef}>
      <input
        className="search-input"
        type="text"
        placeholder="🔍 Search events, venues, artists, categories…"
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        onFocus={() => { if (searchQuery.trim()) setIsOpen(true); }}
      />
      {searchQuery && (
        <button className="search-clear" style={{ display: 'block' }} onClick={clearSearch}>✕</button>
      )}
      <div className={`search-overlay${isOpen ? ' open' : ''}`}>
        <div className="search-results-bar">
          {results.length > 0
            ? <><span>{results.length}</span> events found for "{searchQuery}"</>
            : searchQuery ? 'No events found' : ''
          }
        </div>
        <div className="search-list">
          {visibleResults.map((ev, i) => {
            const d = new Date(ev.date + 'T00:00:00');
            const mon = MONTHS[d.getMonth()].substring(0, 3).toUpperCase();
            const day = d.getDate();
            const col = CATEGORY_COLORS[ev.cat] || '#888';
            return (
              <div key={i} className="search-list-item" onClick={() => onEventClick(ev)}>
                <div className="sli-date" style={{ background: col + '12', color: col }}>
                  <div className="sli-month">{mon}</div>
                  <div className="sli-day">{day}</div>
                </div>
                <div className="sli-info">
                  <div className="sli-name">{ev.name}</div>
                  <div className="sli-venue">📍 {ev.venue}</div>
                  {ev.desc && <div className="sli-desc">{ev.desc}</div>}
                  <span className="sli-tag" style={{ background: col + '12', color: col }}>
                    {CATEGORY_LABELS[ev.cat] || ev.cat}
                  </span>
                </div>
              </div>
            );
          })}
          {hasMore && (
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <button onClick={showMore} style={{
                padding: '8px 20px', border: '1px solid var(--border2)', borderRadius: '6px',
                background: 'var(--surface)', color: 'var(--accent)', fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px', fontWeight: 500, cursor: 'pointer'
              }}>
                Show more results
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
