import React, { useMemo, useState, useEffect } from 'react';
import { MONTHS } from '../utils/dateUtils';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../data/categories';
import { buildGCalUrl } from '../utils/eventUtils';

export default function CalendarGrid({
  calYear, calMonth, prevMonth, nextMonth, goToday,
  events, activeFilters, districtActive, hhOn, hhPatio, hhRoof,
  onEventClick, searchQuery
}) {
  const today = new Date();
  const todayD = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const prevMonthDays = new Date(calYear, calMonth, 0).getDate();

  // Track which day is expanded to show all events
  const [expandedDay, setExpandedDay] = useState(null);

  // Filter events for this month
  const eventsByDay = useMemo(() => {
    const bd = {};
    events.forEach(ev => {
      if (!ev || !ev.date) return;
      const [y, m, d] = ev.date.split('-').map(Number);
      if (y === calYear && m - 1 === calMonth) {
        if (!bd[d]) bd[d] = [];
        bd[d].push(ev);
      }
    });
    return bd;
  }, [events, calYear, calMonth]);

  // Count future events this month
  const monthEventCount = useMemo(() => {
    return Object.entries(eventsByDay).reduce((sum, [day, evs]) => {
      const cellDate = new Date(calYear, calMonth, Number(day));
      return sum + (cellDate >= todayD ? evs.length : 0);
    }, 0);
  }, [eventsByDay, calYear, calMonth]);

  // Reset expanded day when month changes
  useEffect(() => { setExpandedDay(null); }, [calYear, calMonth]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Handle event chip click
  const handleChipClick = (ev, e) => {
    e.stopPropagation();
    onEventClick(ev);
  };

  // Handle "+N more" click — expand day to show all events below
  const handleMoreClick = (dayNum, e) => {
    e.stopPropagation();
    setExpandedDay(prev => prev === dayNum ? null : dayNum);
  };

  // Build cells
  const cells = [];

  // Previous month padding
  for (let i = 0; i < firstDay; i++) {
    cells.push(
      <div key={`prev-${i}`} className="cell dim">
        <div className="cnum">{prevMonthDays - firstDay + i + 1}</div>
      </div>
    );
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(calYear, calMonth, d);
    const isToday = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === d;
    const dow = cellDate.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isPast = cellDate < todayD;
    const dayEvents = isPast ? [] : (eventsByDay[d] || []);
    const shown = dayEvents.slice(0, 4);
    const extra = dayEvents.length - 4;

    const classNames = ['cell'];
    if (isToday) classNames.push('today');
    if (isWeekend) classNames.push('wknd');
    if (isPast) classNames.push('past');

    cells.push(
      <div key={`day-${d}`} className={classNames.join(' ')}>
        <div className="cnum">{d}</div>
        {shown.map((ev, idx) => (
          <div
            key={idx}
            className={`ev ${ev.cat}${ev.free ? ' free-ev' : ''}`}
            title={ev.name}
            onClick={(e) => handleChipClick(ev, e)}
            style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {ev.name}
              {ev.confirmed && <span style={{ opacity: 0.55, fontSize: '9px' }}> ✓</span>}
            </span>
          </div>
        ))}
        {extra > 0 && (
          <div
            className="more"
            onClick={(e) => handleMoreClick(d, e)}
            style={{ fontWeight: expandedDay === d ? 600 : 400, color: expandedDay === d ? 'var(--accent)' : undefined }}
          >
            {expandedDay === d ? '▾ collapse' : `+${extra} more`}
          </div>
        )}
      </div>
    );
  }

  // Next month padding
  const totalCells = firstDay + daysInMonth;
  const trailing = (7 - totalCells % 7) % 7;
  for (let i = 1; i <= trailing; i++) {
    cells.push(
      <div key={`next-${i}`} className="cell dim">
        <div className="cnum">{i}</div>
      </div>
    );
  }

  // Expanded day events
  const expandedEvents = expandedDay ? (eventsByDay[expandedDay] || []) : [];

  return (
    <div>
      <div className="cnav" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <button className="nb" onClick={prevMonth}>&lt;</button>
        <div className="mlbl" id="mlbl">{MONTHS[calMonth]} {calYear}</div>
        <button className="nb" onClick={nextMonth}>&gt;</button>
        <button className="nb" onClick={goToday} title="Go to today" style={{ fontSize: '12px' }}>Today</button>
        <span className="ecnt" id="ecnt">
          {monthEventCount ? `${monthEventCount} event${monthEventCount !== 1 ? 's' : ''} this month` : ''}
        </span>
      </div>
      <div className="dlbls">
        {dayLabels.map(l => <div key={l} className="dlbl">{l}</div>)}
      </div>
      <div className="cgrid">
        {cells}
      </div>

      {/* Expanded day — full event list for a day */}
      {expandedDay && expandedEvents.length > 0 && (
        <div style={{ marginTop: '12px', background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '.03em', color: 'var(--text)' }}>
              {dayNames[new Date(calYear, calMonth, expandedDay).getDay()]}, {MONTHS[calMonth]} {expandedDay} — {expandedEvents.length} event{expandedEvents.length !== 1 ? 's' : ''}
            </div>
            <button
              onClick={() => setExpandedDay(null)}
              style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: 'var(--muted)', padding: '0 4px' }}
            >✕</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {expandedEvents.map((ev, i) => {
              const col = CATEGORY_COLORS[ev.cat] || '#888';
              return (
                <div key={i} onClick={() => onEventClick(ev)}
                  style={{
                    display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 12px',
                    background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px',
                    cursor: 'pointer', transition: 'border-color .15s'
                  }}
                  onMouseOver={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ minWidth: '6px', borderRadius: '3px', background: col, alignSelf: 'stretch' }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '.03em', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ev.name}
                      {ev.free && <span style={{ fontSize: '10px', padding: '2px 5px', borderRadius: '3px', background: 'var(--free-bg)', color: 'var(--free)', border: '1px solid var(--free-bd)', marginLeft: '4px', fontWeight: 500 }}>FREE</span>}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                      📍 {ev.venue}{ev.district && <span> · {ev.district}</span>}
                    </div>
                    {ev.desc && (
                      <div style={{ fontSize: '11px', color: 'rgba(26,32,53,.55)', marginTop: '3px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {ev.desc}
                      </div>
                    )}
                    <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '10px', padding: '2px 8px', borderRadius: '3px', background: col + '12', color: col, fontWeight: 500 }}>
                      {CATEGORY_LABELS[ev.cat] || ev.cat}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); window.open(buildGCalUrl(ev), '_blank'); }}
                      style={{ padding: '5px 8px', border: '1px solid var(--border2)', borderRadius: '5px', background: 'var(--surface)', color: 'var(--muted)', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      + Cal
                    </button>
                    {ev.tickets && (
                      <a href={ev.tickets} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '5px 8px', border: '1px solid var(--border2)', borderRadius: '5px', background: 'var(--surface)', color: 'var(--accent)', fontSize: '11px', textDecoration: 'none', textAlign: 'center', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        🎟️ Info
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
