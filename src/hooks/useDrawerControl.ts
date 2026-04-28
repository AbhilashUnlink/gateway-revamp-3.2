import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { openDrawer, closeAllDrawers } from '@/store/slices/drawerSlice';
import type { DrawerEntry } from '@/store/slices/drawerSlice';
import { useDrawerParams } from './useDrawerParams';

export function useDrawerControl() {
  const dispatch = useAppDispatch();
  const { setDrawerInUrl, clearDrawerFromUrl } = useDrawerParams();

  const open = useCallback(
    (entry: DrawerEntry) => {
      dispatch(openDrawer(entry));
      const id = (entry.data?.transactionRefId as string | undefined) ?? null;
      setDrawerInUrl(entry.type, id);
    },
    [dispatch, setDrawerInUrl]
  );

  const close = useCallback(() => {
    dispatch(closeAllDrawers());
    clearDrawerFromUrl();
  }, [dispatch, clearDrawerFromUrl]);

  return { open, close };
}
