import { useEffect, useCallback, useState, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { DrawerEntry } from '@/store/slices/drawerSlice';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { useTransactionDetailsFetcher } from '@/hooks/useTransactionDetailsFetcher';
import { useDrawerUrlSync } from '@/hooks/useDrawerUrlSync';
import { cn } from '@/utils/cn';
import { DRAWER_REGISTRY } from './drawerRegistry';

const EXIT_ANIMATION_MS = 300;

interface RenderedDrawer extends DrawerEntry {
  isExiting: boolean;
}

export function DrawerManager() {
  const drawers = useAppSelector((s) => s.drawers.drawers);
  const { close } = useDrawerControl();
  useDrawerUrlSync();
  useTransactionDetailsFetcher();

  const [rendered, setRendered] = useState<RenderedDrawer[]>([]);
  const exitTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    setRendered((prev) => {
      const next: RenderedDrawer[] = prev.map((r) => ({ ...r }));

      drawers.forEach((entry) => {
        const existing = next.find((r) => r.type === entry.type);
        if (existing) {
          existing.data = entry.data;
          existing.isExiting = false;
          const timer = exitTimers.current.get(entry.type);
          if (timer) {
            clearTimeout(timer);
            exitTimers.current.delete(entry.type);
          }
        } else {
          next.push({ ...entry, isExiting: false });
        }
      });

      next.forEach((r) => {
        const stillOpen = drawers.some((d) => d.type === r.type);
        if (!stillOpen && !r.isExiting) {
          r.isExiting = true;
          const timer = setTimeout(() => {
            setRendered((curr) => curr.filter((c) => c.type !== r.type));
            exitTimers.current.delete(r.type);
          }, EXIT_ANIMATION_MS);
          exitTimers.current.set(r.type, timer);
        }
      });

      return next;
    });
  }, [drawers]);

  useEffect(() => {
    const timers = exitTimers.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const closeTop = useCallback(() => {
    const hasOpenDrawer = rendered.some((r) => !r.isExiting);
    if (!hasOpenDrawer) return;
    close();
  }, [rendered, close]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTop();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeTop]);

  if (rendered.length === 0) return null;

  const allExiting = rendered.every((r) => r.isExiting);

  return (
    <div
      className={cn('fixed inset-0', allExiting && 'pointer-events-none')}
      style={{ zIndex: 50 }}
    >
      <div
        className={cn(
          'absolute inset-0 bg-black/30 transition-opacity duration-300 ease-out',
          allExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
        onClick={allExiting ? undefined : closeTop}
      />
      {rendered.map((drawer, index) => {
        const entry = DRAWER_REGISTRY.find((r) => r.type === drawer.type);
        if (!entry) return null;
        const { component: Component } = entry;
        if (!Component) return null;
        return (
          <div
            key={drawer.type}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: index + 1 }}
          >
            <Component
              type={drawer.type}
              data={drawer.data}
              width={entry.width}
              topOffset={entry.topOffset}
              isExiting={drawer.isExiting}
            />
          </div>
        );
      })}
    </div>
  );
}
