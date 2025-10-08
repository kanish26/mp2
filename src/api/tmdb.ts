/**
 * TMDB API client (Axios) + lightweight in-memory + sessionStorage caching.
 * Requires .env.local with REACT_APP_TMDB_API_KEY=<your v3 key>.
 */

import axios from "axios";
import type { Movie, MovieDetails, Genre } from "../types";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY as string;   // CRA exposes REACT_APP_* vars
const BASE = "https://api.themoviedb.org/3";

/** Helpers to construct image URLs at common sizes */
export const IMG = {
  w92: (p: string) => `https://image.tmdb.org/t/p/w92${p}`,
  w185: (p: string) => `https://image.tmdb.org/t/p/w185${p}`,
  w342: (p: string) => `https://image.tmdb.org/t/p/w342${p}`,
  w500: (p: string) => `https://image.tmdb.org/t/p/w500${p}`,
  original: (p: string) => `https://image.tmdb.org/t/p/original${p}`,
};

/** Small cache to reduce rate-limit issues and speed up back/forward nav */
const cache = new Map<string, any>();
function key(url: string, params?: Record<string, any>) {
  return `${url}?${new URLSearchParams(params as any).toString()}`;
}
async function getCached<T>(url: string, params?: Record<string, any>): Promise<T> {
  const k = key(url, params);
  if (cache.has(k)) return cache.get(k);

  const fromSession = sessionStorage.getItem(k);
  if (fromSession) {
    const parsed = JSON.parse(fromSession);
    cache.set(k, parsed);
    return parsed;
  }

  const res = await axios.get<T>(url, { params: { api_key: API_KEY, ...params } });
  cache.set(k, res.data);
  sessionStorage.setItem(k, JSON.stringify(res.data));
  return res.data;
}

/** 🔍 Search movies (TMDB returns relevance/popularity ordering) */
export async function searchMovies(query: string, page = 1): Promise<{ results: Movie[] }> {
  return getCached(`${BASE}/search/movie`, { query, include_adult: false, page });
}

/** 🔥 Popular movies (used when search box is empty) */
export async function popularMovies(page = 1): Promise<{ results: Movie[] }> {
  return getCached(`${BASE}/movie/popular`, { page });
}

/** 🎭 All movie genres */
export async function getGenres(): Promise<{ genres: Genre[] }> {
  return getCached(`${BASE}/genre/movie/list`);
}

/** 🧮 Discover movies filtered by genre(s) */
export async function discoverByGenres(genreIds: number[], page = 1): Promise<{ results: Movie[] }> {
  return getCached(`${BASE}/discover/movie`, {
    with_genres: genreIds.join(","),
    sort_by: "popularity.desc",
    include_adult: false,
    page,
  });
}

/** 🧾 Rich details (append credits/images/videos/external_ids for one call) */
export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return getCached(`${BASE}/movie/${id}`, {
    append_to_response: "credits,images,videos,external_ids",
    include_image_language: "en,null",
  });
}