/** Context that stores the current list of movie IDs, so Details can
 * navigate Prev/Next in the same order the user sees in List/Gallery.
 * Uses stable callbacks via useCallback to avoid re-render loops. */

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

interface ListState {
  ids: number[];                               // order of movie IDs for Prev/Next
  setFromMovies: (movies: { id: number }[]) => void; // replace list with movies' ids
  focusId?: number;                            // optional current focus ID (not required)
  setFocusId: (id: number | undefined) => void;
}

const Ctx = createContext<ListState | undefined>(undefined);

const LS_KEY = 'tmdb_last_list_ids_v1';
const LS_FOCUS = 'tmdb_last_focus_id_v1';

export const ListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persist ids across reloads
  const [ids, setIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  });
  const [focusId, setFocusIdState] = useState<number | undefined>(() => {
    try { return JSON.parse(localStorage.getItem(LS_FOCUS) || 'null') ?? undefined; } catch { return undefined; }
  });

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify(ids)); }, [ids]);
  useEffect(() => { localStorage.setItem(LS_FOCUS, JSON.stringify(focusId ?? null)); }, [focusId]);

  /** Stable function: set ids from an array of movie objects */
  const setFromMovies = useCallback((movies: { id: number }[]) => {
    setIds(movies.map(m => m.id));
  }, []);

  /** Stable function: set focusId */
  const setFocusId = useCallback((id: number | undefined) => {
    setFocusIdState(id);
  }, []);

  // Memoized context value to avoid needless re-renders
  const value = useMemo(() => ({
    ids,
    setFromMovies,
    focusId,
    setFocusId,
  }), [ids, setFromMovies, focusId, setFocusId]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useList() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useList must be used within ListProvider');
  return ctx;
}