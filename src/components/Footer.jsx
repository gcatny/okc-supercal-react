import React from 'react';

export default function Footer({ totalEvents }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 0 40px', marginTop: '24px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 16px' }}>

        {/* About This Calendar */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '.05em', color: 'var(--text)', marginBottom: '6px' }}>
            ABOUT THIS CALENDAR
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.7', color: 'var(--muted)', margin: 0 }}>
            The OKC Super Calendar aggregates events from 1k+ local sources including VisitOKC, Paycom Center, Bricktown OKC, The Yale Theater, Paseo Arts District, Plaza District, and many more.
            Hardcoded events are researched and confirmed at time of publication. Live sources are refreshed nightly via automated search — new events, cancellations, and schedule changes discovered overnight are incorporated into the next day's update.
          </p>
        </div>

        {/* Please Verify Before You Go */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '.05em', color: 'var(--text)', marginBottom: '6px' }}>
            PLEASE VERIFY BEFORE YOU GO
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.7', color: 'var(--muted)', margin: 0 }}>
            Event details — including dates, times, venues, and ticket availability — are subject to change. We strongly encourage you to confirm all event information directly with the ticketing provider or venue before making travel arrangements or purchasing tickets.
            Cancellations, rescheduling, and venue changes can occur at any time without prior notice to this calendar.
          </p>
        </div>

        {/* Total Events Counter */}
        <div style={{ textAlign: 'center', marginTop: '18px', padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '8px' }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '.03em', color: 'var(--accent)' }}>
            {totalEvents ? totalEvents.toLocaleString() : '0'}
          </span>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
            total events on the calendar
          </div>
        </div>

        {/* Bottom Attribution */}
        <div style={{ marginTop: '18px', paddingTop: '18px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>
          OKC Super Calendar &bull; Oklahoma City, OK &bull; Calendar data refreshed nightly &bull; Not affiliated with any venue or event organizer &bull; Last loaded: {today}
        </div>

      </div>
    </footer>
  );
}
