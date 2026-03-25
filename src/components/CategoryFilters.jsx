import React from 'react';
import { ALL_CATS, CATEGORY_LABELS } from '../data/categories';

export default function CategoryFilters({ activeFilters, onToggle, onToggleAll }) {
  const allOn = activeFilters.size === ALL_CATS.length;

  return (
    <div className="frow">
      <span className="flbl">Filter</span>
      <button
        onClick={onToggleAll}
        style={{
          fontSize: '11px', padding: '3px 14px', borderRadius: '20px',
          border: '1px solid var(--border2)', background: allOn ? 'var(--surface)' : 'var(--accent)',
          color: allOn ? 'var(--muted)' : '#fff', cursor: 'pointer', fontFamily: 'inherit',
          transition: 'background .15s, color .15s, border-color .15s'
        }}
      >
        {allOn ? 'Deselect All' : 'Select All'}
      </button>
      <span style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic' }}>
        Click any category to hide it
      </span>
      <div style={{ width: '100%' }}></div>
      {ALL_CATS.map(cat => (
        <button
          key={cat}
          className={`fp ${cat}${activeFilters.has(cat) ? ' active' : ''}`}
          onClick={() => onToggle(cat)}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
