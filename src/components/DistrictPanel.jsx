import React from 'react';
import { DISTRICTS, OTHER_CITIES } from '../data/districts';

export default function DistrictPanel({ districtActive, onDistrictClick, districtCounts }) {
  return (
    <>
      <div id="district-panel">
        <div id="district-panel-header">Districts</div>
        <div id="district-panel-list">
          {DISTRICTS.map(dist => (
            <div
              key={dist}
              className={`dist-item${districtActive === dist ? ' dist-active' : ''}`}
              data-key={dist}
              onClick={() => onDistrictClick(dist)}
            >
              <span className="dist-name">{dist}</span>
              <span className="dist-count">{districtCounts[dist] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      <div id="district-panel" style={{ marginTop: '12px' }}>
        <div id="district-panel-header">Other Cities</div>
        <div id="district-panel-list">
          {OTHER_CITIES.map(city => (
            <div
              key={city}
              className={`dist-item${districtActive === city ? ' dist-active' : ''}`}
              data-key={city}
              onClick={() => onDistrictClick(city)}
            >
              <span className="dist-name">{city}</span>
              <span className="dist-count">{districtCounts[city] || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
