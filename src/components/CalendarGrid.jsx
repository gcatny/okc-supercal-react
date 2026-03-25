import React, { useMemo } from 'react';
import { MONTHS } from '../utils/dateUtils';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../data/categories';

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

  // Filter events for this month
  const eventsByDay = useMemo(() => {
    const bd = {};
    events.forEach(ev => {
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

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            onClick={() => onEventClick(ev)}
            style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {ev.name}
              {ev.confirmed && <span style={{ opacity: 0.55, fontSize: '9px' }}> ✓</span>}
            </span>
          </div>
        ))}
        {extra > 0 && (
          <div className="more" onClick={() => onEventClick(dayEvents[4])}>
            +{extra} more
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
    </div>
  );
}
