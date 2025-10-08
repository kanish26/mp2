/**
 * List view:
 * - Debounced search that filters as you type (via TMDB search endpoint)
 * - Sort by Relevance/Title/Popularity/Rating/Release Date with Asc/Desc
 * - Pushes the **sorted list** into context so Details Prev/Next matches on-screen order
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchMovies, popularMovies, IMG } from '../api/tmdb';
import type { Movie, SortDir, SortKey } from '../types';
import useDebounce from '../hooks/useDebounce';
import SortControls from '../components/SortControls';
import { useList } from '../context/ListContext';

export default function ListView() {
  // Search input and debounced value
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 300);

  // Async fetch state
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Movie[]>([]);

  // Sorting: default to "relevance" so we preserve API order during search
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortDir, setSortDir] = useState<SortDir>('desc'); // ignored for relevance
  const { setFromMovies } = useList();

  // When the debounced query changes, fetch either search results or popular
  useEffect(() => {
    let keep = true;
    async function run() {
      setLoading(true);
      try {
        const data = debounced ? await searchMovies(debounced) : await popularMovies();
        if (!keep) return;
        setItems(data.results); // keep raw API order in items
      } finally { setLoading(false); }
    }
    run();
    return () => { keep = false; };
  }, [debounced]);

  // Optional: when user starts searching, default sort becomes "relevance"
  useEffect(() => {
    if (debounced) {
      setSortKey('relevance');
      setSortDir('desc');
    }
  }, [debounced]);

  // Client-side sort (unless "relevance", which keeps API order)
  const sorted = useMemo(() => {
    if (sortKey === 'relevance') return items;
    const arr = [...items];
    arr.sort((a, b) => {
      let av: any, bv: any;
      if (sortKey === 'title') { av = a.title?.toLowerCase() || ''; bv = b.title?.toLowerCase() || ''; }
      else if (sortKey === 'release_date') { av = a.release_date || ''; bv = b.release_date || ''; }
      else { av = (a as any)[sortKey] ?? 0; bv = (b as any)[sortKey] ?? 0; }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [items, sortKey, sortDir]);

  // Push **sorted** list to context so Details Prev/Next follows on-screen order
  useEffect(() => {
    setFromMovies(sorted);
  }, [sorted, setFromMovies]);

  return (
    <section>
      <h1>Movie List</h1>

      {/* Search + sort toolbar */}
      <div className="toolbar">
        <input
          className="search"
          value={query}
          placeholder="Search movies..."
          onChange={(e) => setQuery(e.target.value)}
        />
        <SortControls
          sortKey={sortKey}
          sortDir={sortDir}
          onChange={(k, d) => { setSortKey(k); setSortDir(d); }}
        />
      </div>

      {loading && <p>Loading…</p>}

      {/* Results */}
      <ul className="list">
        {sorted.map(m => (
          <li key={m.id} className="list-item">
            <Link to={`/movie/${m.id}`} className="list-link">
              {m.poster_path ? (
                <img src={IMG.w92(m.poster_path)} alt={m.title} />
              ) : (
                <div className="placeholder">No Image</div>
              )}
              <div>
                <h3>{m.title}</h3>
                <p className="muted">
                  Release: {m.release_date || '—'} · Rating: {m.vote_average?.toFixed?.(1) ?? '—'} · Popularity: {Math.round(m.popularity)}
                </p>
                <p className="overview">{m.overview}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}