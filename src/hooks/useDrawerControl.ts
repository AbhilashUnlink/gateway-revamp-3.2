import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openDrawer } from '@/store/slices/drawerSlice';
import type { DrawerEntry } from '@/store/slices/drawerSlice';
import { selectTransactionActions } from '@/store/slices/transactionDetailsSlice';
import { isDrawerAllowed, ALWAYS_ALLOWED_DRAWERS } from '@/utils/drawerPermissions';
import { useDrawerParams } from './useDrawerParams';

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
      const id = (entry.data?.transactionRefId as string | undefined) ?? null;
      setDrawerInUrlRef.current(entry.type, id);
    },
    [dispatch]
  );

  const close = useCallback(() => {
    clearDrawerFromUrlRef.current();
  }, []);

  return { open, close };
}
