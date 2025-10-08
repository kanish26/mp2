/**
 * Sort control with a dropdown for sort key and a button to toggle asc/desc.
 * Includes "Relevance" which preserves API order (no client-side sorting).
 */

import React from 'react';
import type { SortDir, SortKey } from '../types';

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'title', label: 'Title' },
  { key: 'popularity', label: 'Popularity' },
  { key: 'vote_average', label: 'Rating' },
  { key: 'release_date', label: 'Release Date' },
];

export default function SortControls({
  sortKey, sortDir, onChange
}:{ sortKey: SortKey; sortDir: SortDir; onChange: (k: SortKey, d: SortDir) => void; }) {
  return (
    <div className="sort-controls">
      <label>
        Sort by:{' '}
        <select value={sortKey} onChange={(e) => onChange(e.target.value as SortKey, sortDir)}>
          {OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </label>
      <button className="btn" onClick={() => onChange(sortKey, sortDir === 'asc' ? 'desc' : 'asc')}>
        {sortDir === 'asc' ? 'Asc ↑' : 'Desc ↓'}
      </button>
    </div>
  );
}