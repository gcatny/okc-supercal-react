import React from 'react';
import { DISTRICTS } from '../data/districts';

export default function DistrictPanel({ districtActive, onDistrictClick, districtCounts }) {
  return (
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
  );
}
