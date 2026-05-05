import { useRef, useState, type DragEvent } from 'react';

interface UseListReorderOptions<T> {
  items: T[];
  setItems: (updater: (prev: T[]) => T[]) => void;
  /** When true, no item is draggable and drops are ignored. */
  disabled?: boolean;
  /** Items returning true cannot be dragged, nor accept drops. */
  isItemLocked?: (item: T, index: number) => boolean;
}

export interface RowDragHandleProps {
  draggable: boolean;
  onDragStart: (e: DragEvent<HTMLElement>) => void;
  onDragOver: (e: DragEvent<HTMLElement>) => void;
  onDrop: (e: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
  onDragLeave: () => void;
}

interface UseListReorderReturn {
  dragOverIdx: number | null;
  getRowProps: (idx: number) => RowDragHandleProps;
}

/**
 * Native HTML5 drag-and-drop reorder for a list. The owning component holds
 * the list state and passes `setItems`; the hook returns `getRowProps(idx)`
 * to spread on each row, plus the live `dragOverIdx` for hover styling.
 */
export function useListReorder<T>({
  items,
  setItems,
  disabled = false,
  isItemLocked,
}: UseListReorderOptions<T>): UseListReorderReturn {
  const dragFromRef = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const isRowLocked = (idx: number): boolean => {
    if (disabled) return true;
    const item = items[idx];
    if (item === undefined) return true;
    return isItemLocked ? isItemLocked(item, idx) : false;
  };

  const getRowProps = (idx: number): RowDragHandleProps => ({
    draggable: !isRowLocked(idx),
    onDragStart: (e) => {
      if (isRowLocked(idx)) {
        e.preventDefault();
        return;
      }
      dragFromRef.current = idx;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(idx));
    },
    onDragOver: (e) => {
      if (disabled || dragFromRef.current === null) return;
      if (isRowLocked(idx)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (dragOverIdx !== idx) setDragOverIdx(idx);
    },
    onDrop: (e) => {
      if (disabled) return;
      e.preventDefault();
      const from = dragFromRef.current;
      dragFromRef.current = null;
      setDragOverIdx(null);
      if (from === null || from === idx) return;
      setItems((prev) => {
        const fromItem = prev[from];
        const toItem = prev[idx];
        if (!fromItem || !toItem) return prev;
        if (isItemLocked?.(fromItem, from) || isItemLocked?.(toItem, idx)) return prev;
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        if (!moved) return prev;
        next.splice(idx, 0, moved);
        return next;
      });
    },
    onDragEnd: () => {
      dragFromRef.current = null;
      setDragOverIdx(null);
    },
    onDragLeave: () => {
      if (dragOverIdx === idx) setDragOverIdx(null);
    },
  });

  return { dragOverIdx, getRowProps };
}
