import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openDrawer, closeDrawer } from '@/store/slices/drawerSlice';
import type { DrawerEntry } from '@/store/slices/drawerSlice';
import { selectTransactionActions } from '@/store/slices/transactionDetailsSlice';
import { isDrawerAllowed, ALWAYS_ALLOWED_DRAWERS } from '@/utils/drawerPermissions';
import { useDrawerParams } from './useDrawerParams';
import { NON_URL_DRAWER_TYPES } from './useDrawerUrlSync';

export function useDrawerControl() {
  const dispatch = useAppDispatch();
  const actions = useAppSelector(selectTransactionActions);
  const { setDrawerInUrl, clearDrawerFromUrl } = useDrawerParams();

  const current = useAppSelector((s) => s.drawers.current);

  const setDrawerInUrlRef = useRef(setDrawerInUrl);
  const clearDrawerFromUrlRef = useRef(clearDrawerFromUrl);
  const actionsRef = useRef(actions);
  const currentRef = useRef(current);

  useEffect(() => {
    setDrawerInUrlRef.current = setDrawerInUrl;
    clearDrawerFromUrlRef.current = clearDrawerFromUrl;
    actionsRef.current = actions;
    currentRef.current = current;
  });

  const open = useCallback(
    (entry: DrawerEntry) => {
      if (
        !ALWAYS_ALLOWED_DRAWERS.has(entry.type) &&
        !isDrawerAllowed(entry.type, actionsRef.current)
      ) {
        return;
      }
      dispatch(openDrawer(entry));
      // Transient drawers (e.g. forms with rich, non-serializable data like
      // callbacks) skip URL persistence. Otherwise the URL→Redux sync can
      // briefly observe `urlType=''` between the dispatch and the URL update,
      // close the drawer, and then rebuild it from URL with bare data —
      // erasing the rich payload we just pushed in.
      if (NON_URL_DRAWER_TYPES.has(entry.type)) return;
      const id = (entry.data?.transactionRefId as string | undefined) ?? null;
      setDrawerInUrlRef.current(entry.type, id);
    },
    [dispatch]
  );

  const close = useCallback(() => {
    // Use a single source of truth per drawer type to avoid a Redux/URL race:
    // when both updates fire together, Redux (sync) lands first while React
    // Router defers the URL change via a transition. In the gap, the URL still
    // holds `?drawer=…&id=…`, so `useDrawerUrlSync` sees `current=null` with
    // a stale `urlType` and re-dispatches `openDrawer` from the URL — the
    // drawer briefly re-opens with skeleton data before re-closing (flicker).
    const entry = currentRef.current;
    if (entry && NON_URL_DRAWER_TYPES.has(entry.type)) {
      // Transient drawers never wrote to the URL — close via Redux directly.
      dispatch(closeDrawer());
    } else {
      // URL-backed drawers: clear the URL; useDrawerUrlSync handles the close.
      clearDrawerFromUrlRef.current();
    }
  }, [dispatch]);

  return { open, close };
}
