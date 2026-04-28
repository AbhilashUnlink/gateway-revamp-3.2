import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const DRAWER_KEY = 'drawer';
const ID_KEY = 'id';

export function useDrawerParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getDrawerFromUrl = useCallback((): string | null => {
    return searchParams.get(DRAWER_KEY);
  }, [searchParams]);

  const getIdFromUrl = useCallback((): string | null => {
    return searchParams.get(ID_KEY);
  }, [searchParams]);

  const setDrawerInUrl = useCallback(
    (type: string, id?: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(DRAWER_KEY, type);
          const resolvedId = id ?? next.get(ID_KEY);
          if (resolvedId) next.set(ID_KEY, resolvedId);
          else next.delete(ID_KEY);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const clearDrawerFromUrl = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(DRAWER_KEY);
        next.delete(ID_KEY);
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  return {
    getDrawerFromUrl,
    getIdFromUrl,
    setDrawerInUrl,
    clearDrawerFromUrl,
  };
}
