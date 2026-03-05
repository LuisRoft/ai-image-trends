import { useState, useEffect } from 'react';

/**
 * Devuelve un valor debounced. El valor se actualiza tras `delay`ms
 * sin cambios en el input.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debouncedValue;
}
