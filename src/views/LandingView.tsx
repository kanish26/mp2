/**
 * Landing (Home) page:
 * - Hero section: title, subtitle, CTAs to List & Gallery
 * - Quick tips about how to use the app
 * - "Trending Now" row (TMDB popular) for visual appeal
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { popularMovies, IMG } from '../api/tmdb';
import type { Movie } from '../types';

export default function LandingView() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let keep = true;
    async function run() {
      setLoading(true);
      try {
        const data = await popularMovies(1);
        if (!keep) return;
        // show just a few to keep landing light
        setTrending(data.results.slice(0, 10));
      } finally { setLoading(false); }
    }
    run();
    return () => { keep = false; };
  }, []);

  return (
    <section className="landing">
      {/* Hero */}
      <div className="hero">
        <div>
          <h1 className="hero-title"> Welcome to TMDB Movie Explorer - Discover movies instantly</h1>
          <p className="hero-sub">
            Search, sort, and filter movies powered by the TMDB API. Click any title for rich details,
            trailers, and cast—then hop through with Previous/Next.
          </p>
          <div className="hero-cta">
            <Link to="/list" className="btn">Start Searching</Link>
            <Link to="/gallery" className="btn btn--ghost">Browse Gallery</Link>
          </div>
          <p className="hero-note">Tip: the search bar filters as you type. Sort by Title, Popularity, Rating, or Release Date.</p>
        </div>
      </div>

      {/* Quick tips */}
      <div className="cards">
        <div className="info-card">
          <h3>List View</h3>
          <p>Live search + client-side sorting (Asc/Desc). Click a result to see full details.</p>
          <Link to="/list" className="link">Go to List →</Link>
        </div>
        <div className="info-card">
          <h3>Gallery View</h3>
          <p>Poster grid with multi-genre filtering powered by <code>discover/movie</code>.</p>
          <Link to="/gallery" className="link">Open Gallery →</Link>
        </div>
        <div className="info-card">
          <h3>Details View</h3>
          <p>Trailer, top cast, genres, runtime, and quick navigation with Previous/Next.</p>
          <span className="muted">Direct linkable at <code>/movie/:id</code></span>
        </div>
      </div>

      {/* Trending row */}
      <div className="trending">
        <div className="row-head">
          <h2>Trending Now</h2>
          {loading && <span className="muted">Loading…</span>}
        </div>
        <div className="scroll-row">
          {trending.map(m => (
            <Link key={m.id} to={`/movie/${m.id}`} className="thumb">
              {m.poster_path
                ? <img src={IMG.w185(m.poster_path)} alt={m.title} />
                : <div className="placeholder tall">No Image</div>}
              <div className="thumb-caption">
                <span className="thumb-title">{m.title}</span>
                <span className="badge">⭐ {m.vote_average?.toFixed?.(1) ?? '—'}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}