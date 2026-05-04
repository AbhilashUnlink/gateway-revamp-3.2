import { useEffect, useCallback, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector } from '@/store/hooks';
import DasDrawer from '@/components/ui/DasDrawer';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { useTransactionDetailsFetcher } from '@/hooks/transactions/useTransactionDetailsFetcher';
import { useDrawerUrlSync } from '@/hooks/useDrawerUrlSync';
import { DRAWER_REGISTRY } from './drawerRegistry';

export default function DrawerManager() {
  const current = useAppSelector((s) => s.drawers.current);
  const { close } = useDrawerControl();

  useDrawerUrlSync();
  useTransactionDetailsFetcher();

  const handleClose = useCallback(() => close(), [close]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  if (!current) return null;

  const entry = DRAWER_REGISTRY.find((r) => r.type === current.type);
  if (!entry) return null;

  const Content = entry.component;

  return createPortal(
    <div className="fixed inset-0" style={{ zIndex: 50 }}>
      <div
        className="absolute inset-0 bg-black/30 transition-opacity duration-300 ease-out"
        onClick={handleClose}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <DasDrawer width={entry.width} topOffset={entry.topOffset}>
          <DasDrawer.Content>
            <Suspense fallback={null}>
              <Content type={current.type} data={current.data} />
            </Suspense>
          </DasDrawer.Content>
        </DasDrawer>
      </div>
    </div>,
    document.body
  );
}
