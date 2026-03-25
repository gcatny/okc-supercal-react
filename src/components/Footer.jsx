import React from 'react';

export default function Footer({ totalEvents }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 0 40px', marginTop: '24px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '.05em', color: 'var(--text)', marginBottom: '8px' }}>
            OKC SUPER CALENDAR
          </div>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', maxWidth: '600px' }}>
            The most complete calendar of events in Oklahoma City. Community-powered, updated nightly.
            Not affiliated with any venue or promoter.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
          <span className="ft">
            {totalEvents ? `${totalEvents.toLocaleString()} events tracked` : ''}
          </span>
          <span className="ft" id="footer-updated">Last loaded: {today}</span>
          <span className="fs">Built with caffeine &amp; community data</span>
        </div>
      </div>
    </footer>
  );
}
