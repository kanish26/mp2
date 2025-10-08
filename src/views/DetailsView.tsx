/**
 * Details view:
 * - Renders poster, title, tagline, runtime, genres, cast
 * - Links to trailer (YouTube), official site, and IMDb when available
 * - Prev/Next buttons use the ID order stored in context
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getMovieDetails, IMG } from '../api/tmdb';
import type { MovieDetails } from '../types';
import { useList } from '../context/ListContext';

export default function DetailsView() {
  const { id } = useParams();
  const movieId = Number(id);
  const [data, setData] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { ids } = useList();
  const navigate = useNavigate();

  // Position of current movie ID in the context array
  const index = useMemo(() => ids.indexOf(movieId), [ids, movieId]);
  const prevId = index > 0 ? ids[index - 1] : undefined;
  const nextId = index >= 0 && index < ids.length - 1 ? ids[index + 1] : undefined;

  // Fetch details on mount / id change
  useEffect(() => {
    let keep = true;
    async function run() {
      setLoading(true);
      setErr(null);
      try {
        const d = await getMovieDetails(movieId);
        if (keep) setData(d);
      } catch (e: any) {
        if (keep) setErr('Failed to load details. Please try again.');
      } finally {
        if (keep) setLoading(false);
      }
    }
    run();
    return () => { keep = false; };
  }, [movieId]);

  if (loading) return <p>Loading…</p>;
  if (err) return <p>{err}</p>;
  if (!data) return null;

  // Helpers to enrich the UI
  const year = data.release_date ? ` (${new Date(data.release_date).getFullYear()})` : '';
  const trailer = (data as any).videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
  const cast = (data as any).credits?.cast?.slice(0, 6) ?? [];
  const imdbId = (data as any).external_ids?.imdb_id;

  return (
    <section className="details">
      <div className="details-grid">
        {/* Poster column */}
        <div>
          {data.poster_path ? (
            <img src={IMG.w342(data.poster_path)} alt={data.title} className="poster" />
          ) : (
            <div className="placeholder big">No Image</div>
          )}
        </div>

        {/* Text column */}
        <div>
          <h1>{data.title}{year}</h1>
          {data.tagline && <p className="tagline">“{data.tagline}”</p>}
          <p className="muted">
            Release: {data.release_date || '—'} · Runtime: {data.runtime ? `${data.runtime} min` : '—'} · ⭐ {data.vote_average?.toFixed?.(1) ?? '—'}
          </p>

          <p>{data.overview || 'No overview available.'}</p>

          {data.genres && data.genres.length > 0 && (
            <p><strong>Genres:</strong>{' '}
              {data.genres.map(g => <span key={g.id} className="badge" style={{ marginRight: 6 }}>{g.name}</span>)}
            </p>
          )}

          {cast.length > 0 && (
            <p><strong>Top Cast:</strong> {cast.map((c: any) => c.name).join(', ')}</p>
          )}

          {/* External links (if available) */}
          <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem', flexWrap: 'wrap' }}>
            {trailer && (
              <a className="btn" href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer">
                ▶ Watch Trailer
              </a>
            )}
            {data.homepage && (
              <a className="btn btn--ghost" href={data.homepage} target="_blank" rel="noreferrer">
                Official Site
              </a>
            )}
            {imdbId && (
              <a className="btn btn--ghost" href={`https://www.imdb.com/title/${imdbId}/`} target="_blank" rel="noreferrer">
                IMDb
              </a>
            )}
          </div>

          {/* Prev/Next navigation mirrors the context order */}
          <div className="nav-buttons" style={{ marginTop: '1rem' }}>
            <button className="btn" disabled={!prevId} onClick={() => prevId && navigate(`/movie/${prevId}`)}>← Previous</button>
            <Link to="/list" className="btn btn--ghost">Back to List</Link>
            <button className="btn" disabled={!nextId} onClick={() => nextId && navigate(`/movie/${nextId}`)}>Next →</button>
          </div>
        </div>
      </div>
    </section>
  );
}