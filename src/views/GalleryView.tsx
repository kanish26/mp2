/**
 * Gallery view:
 * - Poster grid
 * - Multi-genre filtering via Discover endpoint
 * - Pushes API order to context (good for intuitive Prev/Next in Details)
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { discoverByGenres, getGenres, IMG, popularMovies } from '../api/tmdb';
import type { Genre, Movie } from '../types';
import GenreFilter from '../components/GenreFilter';
import { useList } from '../context/ListContext';

export default function GalleryView() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [sel, setSel] = useState<number[]>([]);
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const { setFromMovies } = useList();

  // Load list of genres once
  useEffect(() => {
    getGenres().then(res => setGenres(res.genres));
  }, []);

  // Load movies whenever selected genres change
  useEffect(() => {
    let keep = true;
    async function run() {
      setLoading(true);
      try {
        const data = sel.length ? await discoverByGenres(sel) : await popularMovies();
        if (!keep) return;
        setItems(data.results);
        setFromMovies(data.results); // context order = API order
      } finally { setLoading(false); }
    }
    run();
    return () => { keep = false; };
  }, [sel, setFromMovies]);

  function toggle(id: number) {
    setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  return (
    <section>
      <h1>Poster Gallery</h1>
      <p className="muted">Filter by one or more genres:</p>

      <GenreFilter genres={genres} selected={sel} onToggle={toggle} />
      {loading && <p>Loading…</p>}

      <div className="grid">
        {items.map(m => (
          <Link key={m.id} to={`/movie/${m.id}`} className="card">
            {m.poster_path ? (
              <img src={IMG.w342(m.poster_path)} alt={m.title} />
            ) : (
              <div className="placeholder big">No Image</div>
            )}
            <div className="card-meta">
              <h3>{m.title}</h3>
              <span className="badge">⭐ {m.vote_average?.toFixed?.(1) ?? '—'}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}