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

  const setDrawerInUrlRef = useRef(setDrawerInUrl);
  const clearDrawerFromUrlRef = useRef(clearDrawerFromUrl);
  const actionsRef = useRef(actions);

  useEffect(() => {
    setDrawerInUrlRef.current = setDrawerInUrl;
    clearDrawerFromUrlRef.current = clearDrawerFromUrl;
    actionsRef.current = actions;
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
    // Dispatch directly so transient drawers (which never wrote to the URL)
    // also close. For URL-synced drawers, clearing the URL is a no-op after
    // close, but we still do it to keep the address bar in sync.
    dispatch(closeDrawer());
    clearDrawerFromUrlRef.current();
  }, [dispatch]);

  return { open, close };
}
