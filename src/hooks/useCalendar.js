import { useState } from 'react';

export function useCalendar() {
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const goToday = () => {
    const t = new Date();
    setCalYear(t.getFullYear());
    setCalMonth(t.getMonth());
  };

  return { calYear, calMonth, prevMonth, nextMonth, goToday };
}
