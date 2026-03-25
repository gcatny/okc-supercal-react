import React from 'react';

export default function HappyHourPanel({
  hhOn, onToggleHH, hhPatio, onTogglePatio, hhRoof, onToggleRoof,
  venueCount, patioCount, rooftopCount
}) {
  return (
    <div className={`hh-section${!hhOn ? ' hh-off' : ''}`} id="hh-section">
      <div className="hh-header">
        <span className="hh-title">Happy Hours</span>
      </div>
      <div className="hh-venue-row">
        <span>Total Venues</span>
        <span className="dist-count">{venueCount}</span>
      </div>
      <div className="hh-toggle-row">
        <label className="hh-main-toggle">
          <input type="checkbox" checked={hhOn} onChange={onToggleHH} />
          <span className="hh-switch"></span>
          Show on Calendar
        </label>
        <span className="hh-divider"></span>
        <div className="hh-sub-toggles">
          <button className={`hh-pill${hhPatio ? ' active' : ''}`} onClick={onTogglePatio}>
            Patio <span className="hh-count">{patioCount}</span>
          </button>
          <button className={`hh-pill${hhRoof ? ' active' : ''}`} onClick={onToggleRoof}>
            Rooftop <span className="hh-count">{rooftopCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
