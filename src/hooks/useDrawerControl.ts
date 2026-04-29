import { useCallback } from 'react';
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

  const open = useCallback(
    (entry: DrawerEntry) => {
      if (!ALWAYS_ALLOWED_DRAWERS.has(entry.type) && !isDrawerAllowed(entry.type, actions)) {
        return;
      }
      dispatch(openDrawer(entry));
      const id = (entry.data?.transactionRefId as string | undefined) ?? null;
      setDrawerInUrl(entry.type, id);
    },
    [dispatch, setDrawerInUrl, actions]
  );

  const close = useCallback(() => {
    clearDrawerFromUrl();
  }, [clearDrawerFromUrl]);

  return { open, close };
}
