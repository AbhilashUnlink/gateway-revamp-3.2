import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openDrawer, closeAllDrawers } from '@/store/slices/drawerSlice';
import { DRAWER_REGISTRY } from '@/components/drawer/drawerRegistry';
import {
  selectTransactionDetailsData,
  selectTransactionDetailsLoading,
  selectTransactionActions,
  type TransactionActionsVisibility,
} from '@/store/slices/transactionDetailsSlice';

const REGISTERED_TYPES = new Set(DRAWER_REGISTRY.map((entry) => entry.type));
const ALWAYS_ALLOWED = new Set(['details']);

function isAllowed(type: string, actions: TransactionActionsVisibility): boolean {
  switch (type) {
    case 'refund':
      return actions.showRefund;
    case 'capture':
      return actions.showCapture;
    case 'void':
      return actions.showVoid;
    case 'dispute':
      return actions.showDispute;
    case 'edit-status':
      return actions.showEditStatus;
    default:
      return ALWAYS_ALLOWED.has(type);
  }
}

export function useDrawerUrlSync() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const drawers = useAppSelector((s) => s.drawers.drawers);
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

    if (!urlType && !id) return;

    if (!urlType || !id || !REGISTERED_TYPES.has(urlType)) {
      clearUrl();
      if (drawers.length > 0) dispatch(closeAllDrawers());
      return;
    }

    if (!ALWAYS_ALLOWED.has(urlType)) {
      if (loading || !data) return;
      if (!isAllowed(urlType, actions)) {
        clearUrl();
        if (drawers.length > 0) dispatch(closeAllDrawers());
        return;
      }
    }

    const alreadyOpen = drawers.some((d) => d.type === urlType);
    if (!alreadyOpen) {
      dispatch(
        openDrawer({
          type: urlType,
          data: { transactionRefId: id, transactionId: id },
        })
      );
    }
  }, [urlType, id, loading, data, actions, drawers, dispatch, setSearchParams]);
}
