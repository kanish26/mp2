/**
 * Debounce hook: returns a value only after it stops changing for `delay` ms.
 * Useful for "filter-as-you-type" search without spamming the API.
 */

import { useEffect, useState } from 'react';

export default function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}