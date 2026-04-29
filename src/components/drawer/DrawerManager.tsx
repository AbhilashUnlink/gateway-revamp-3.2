import { useEffect, useCallback } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { useTransactionDetailsFetcher } from '@/hooks/useTransactionDetailsFetcher';
import { useDrawerUrlSync } from '@/hooks/useDrawerUrlSync';
import { DRAWER_REGISTRY } from './drawerRegistry';

export function DrawerManager() {
  const current = useAppSelector((s) => s.drawers.current);
  const { close } = useDrawerControl();

  useDrawerUrlSync();
  useTransactionDetailsFetcher();

  const handleClose = useCallback(() => {
    if (!current) return;
    close();
  }, [current, close]);

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

  const Component = entry.component;
  if (!Component) return null;

  return (
    <div className="fixed inset-0" style={{ zIndex: 50 }}>
      <div
        className="absolute inset-0 bg-black/30 transition-opacity duration-300 ease-out"
        onClick={handleClose}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <Component
          type={current.type}
          data={current.data}
          width={entry.width}
          topOffset={entry.topOffset}
        />
      </div>
    </div>
  );
}
