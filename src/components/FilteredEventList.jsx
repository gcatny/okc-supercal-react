import React, { useState, useMemo } from 'react';
import { ALL_CATS, CATEGORY_LABELS, CATEGORY_COLORS } from '../data/categories';
import { MONTHS } from '../utils/dateUtils';
import { getTodayStr } from '../utils/dateUtils';
import { buildGCalUrl } from '../utils/eventUtils';

const LIST_LIMIT = 30;

export default function FilteredEventList({
  events, activeFilters, districtActive, hhPatio, hhRoof, onEventClick
}) {
  const [shown, setShown] = useState(LIST_LIMIT);
  const allCatsOn = activeFilters.size === ALL_CATS.length;

  // Only show when filters are narrowed
  if (allCatsOn && !districtActive && !hhPatio && !hhRoof) return null;

  const todayStr = getTodayStr();

  // Build deduplicated, future-only list
  const items = useMemo(() => {
    const seen = {};
    const filtered = events.filter(ev => {
      if (ev.date < todayStr) return false;
      if (ev.cat === 'happyhour') {
        if (seen[ev.name]) return false;
        seen[ev.name] = true;
      }
      return true;
    });
    filtered.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.name < b.name ? -1 : 1);
    return filtered;
  }, [events, todayStr]);

  const visibleItems = items.slice(0, shown);
  const remaining = items.length - shown;

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div id="filter-list-wrap" style={{ marginTop: '16px' }}>
      <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', fontWeight: 500 }}>
        {items.length} upcoming event{items.length !== 1 ? 's' : ''}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {visibleItems.map((ev, i) => {
          const d = new Date(ev.date + 'T00:00:00');
          const mon = MONTHS[d.getMonth()].substring(0, 3).toUpperCase();
          const day = d.getDate();
          const wday = dayNames[d.getDay()].toUpperCase();
          const col = CATEGORY_COLORS[ev.cat] || '#888';
          return (
            <div key={i} onClick={() => onEventClick(ev)}
              style={{
                display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 12px',
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px',
                cursor: 'pointer', transition: 'border-color .15s'
              }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ minWidth: '44px', textAlign: 'center', padding: '6px 4px', borderRadius: '6px', background: col + '12', color: col }}>
                <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.05em' }}>{wday}</div>
                <div style={{ fontSize: '10px', fontWeight: 600, opacity: 0.7 }}>{mon}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.1 }}>{day}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '.03em', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ev.name}
                  {ev.free && <span style={{ fontSize: '10px', padding: '2px 5px', borderRadius: '3px', background: 'var(--free-bg)', color: 'var(--free)', border: '1px solid var(--free-bd)', marginLeft: '4px', fontWeight: 500 }}>FREE</span>}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  📍 {ev.venue}{ev.district && <span> · {ev.district}</span>}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(26,32,53,.55)', marginTop: '3px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ev.desc}
                </div>
                <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '10px', padding: '2px 8px', borderRadius: '3px', background: col + '12', color: col, fontWeight: 500 }}>
                  {CATEGORY_LABELS[ev.cat] || ev.cat}
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); window.open(buildGCalUrl(ev), '_blank'); }}
                style={{ flexShrink: 0, padding: '5px 8px', border: '1px solid var(--border2)', borderRadius: '5px', background: 'var(--surface)', color: 'var(--muted)', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}
              >
                + Cal
              </button>
            </div>
          );
        })}
      </div>
      {remaining > 0 && (
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <button onClick={() => setShown(s => s + LIST_LIMIT)} style={{
            padding: '10px 24px', border: '1px solid var(--border2)', borderRadius: '8px',
            background: 'var(--surface)', color: 'var(--accent)', fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px', fontWeight: 500, cursor: 'pointer'
          }}>
            Show {Math.min(remaining, LIST_LIMIT)} more of {remaining} remaining
          </button>
        </div>
      )}
    </div>
  );
}
