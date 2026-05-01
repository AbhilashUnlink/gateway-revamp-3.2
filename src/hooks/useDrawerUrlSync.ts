import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openDrawer, closeDrawer } from '@/store/slices/drawerSlice';
import { DRAWER_REGISTRY } from '@/components/drawer/drawerRegistry';
import {
  selectTransactionDetailsData,
  selectTransactionDetailsLoading,
  selectTransactionActions,
} from '@/store/slices/transactionDetailsSlice';
import { isDrawerAllowed, ALWAYS_ALLOWED_DRAWERS } from '@/utils/drawerPermissions';

const REGISTERED_TYPES = new Set(DRAWER_REGISTRY.map((entry) => entry.type));

export function useDrawerUrlSync() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const current = useAppSelector((s) => s.drawers.current);
  const data = useAppSelector(selectTransactionDetailsData);
  const loading = useAppSelector(selectTransactionDetailsLoading);
  const actions = useAppSelector(selectTransactionActions);

  const id = searchParams.get('id');
  const urlType = searchParams.get('drawer')?.trim() ?? '';

  useEffect(() => {
    const clearUrl = () => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete('drawer');
          next.delete('id');
          return next;
        },
        { replace: true }
      );
    };

    if (!urlType && !id) {
      if (current) dispatch(closeDrawer());
      return;
    }

    if (!urlType || !id || !REGISTERED_TYPES.has(urlType)) {
      clearUrl();
      return;
    }

    if (!ALWAYS_ALLOWED_DRAWERS.has(urlType)) {
      if (loading || !data) return;
      if (!isDrawerAllowed(urlType, actions)) {
        clearUrl();
        return;
      }
    }

    if (current?.type !== urlType) {
      const drawerData = buildDrawerDataFromUrl(urlType, id);
      dispatch(openDrawer({ type: urlType, data: drawerData }));
    }
  }, [urlType, id, loading, data, actions, current, dispatch, setSearchParams]);
}

function buildDrawerDataFromUrl(type: string, id: string): Record<string, unknown> {
  const base = { transactionRefId: id, transactionId: id };
  switch (type) {
    case 'product': {
      const [dasmid, terminalId] = id.split('___');
      return { ...base, dasmid: dasmid ?? '', terminalId: terminalId ?? '' };
    }
    case 'acquirer-mid':
      return { ...base, acquirerMid: id };
    case 'merchant':
      return { ...base, merchantId: id };
    default:
      return base;
  }
}
