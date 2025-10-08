/* Shared types for movies, genres, and sorting. */

export type Genre = { id: number; name: string };

export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  vote_average: number;
  popularity: number;
  genre_ids?: number[];
};

export type MovieDetails = Movie & {
  genres?: Genre[];
  runtime?: number;
  homepage?: string | null;
  status?: string;
  tagline?: string | null;
};

/* SortKey includes "relevance" which preserves TMDB's original API order. */
export type SortKey = 'relevance' | 'title' | 'popularity' | 'vote_average' | 'release_date';
export type SortDir = 'asc' | 'desc';