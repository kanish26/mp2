/**
 * Simple multi-select chip list for genres.
 */

import React from 'react';
import type { Genre } from '../types';

export default function GenreFilter({
  genres, selected, onToggle
}:{ genres: Genre[]; selected: number[]; onToggle: (id: number) => void; }) {
  return (
    <div className="genre-filter">
      {genres.map(g => (
        <label key={g.id} className={`chip ${selected.includes(g.id) ? 'chip--on' : ''}`}>
          <input
            type="checkbox"
            checked={selected.includes(g.id)}
            onChange={() => onToggle(g.id)}
          />
          {g.name}
        </label>
      ))}
    </div>
  );
}