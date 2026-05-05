import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

const ANCHOR_GAP = 8;
const VIEWPORT_LEFT_MARGIN = 8;

interface AnchoredPopoverPosition {
  top: number;
  left: number;
  /** Computed only when the `height` option is provided. */
  height?: number;
}

interface AnchoredPopoverHeight {
  min: number;
  bottomMargin: number;
}

interface UseAnchoredPopoverOptions {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  width: number;
  /** When provided, the hook fits a height into the viewport: `max(min, viewportH - top - bottomMargin)`. */
  height?: AnchoredPopoverHeight;
  /**
   * CSS selector whose `closest()` match should NOT trigger an outside-click close.
   * Used by popovers that render their own portaled sub-popovers/modals.
   */
  outsideClickIgnoreSelector?: string;
}

interface UseAnchoredPopoverReturn {
  popRef: RefObject<HTMLDivElement | null>;
  position: AnchoredPopoverPosition | null;
}

/**
 * Anchored fixed-position popover plumbing — viewport-fit positioning under
 * an external anchor, with outside-click + Escape-to-close. Consumers render
 * their own portal/markup and apply `popRef` + `style` from the returned
 * `position`.
 */
export function useAnchoredPopover({
  open,
  onClose,
  anchorRef,
  width,
  height,
  outsideClickIgnoreSelector,
}: UseAnchoredPopoverOptions): UseAnchoredPopoverReturn {
  const popRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<AnchoredPopoverPosition | null>(null);

  // Latest-callback ref so the outside-click effect doesn't re-bind every
  // render when consumers pass an inline `onClose` closure.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const heightMin = height?.min;
  const heightBottomMargin = height?.bottomMargin;

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const top = rect.bottom + ANCHOR_GAP;
      const left = Math.max(VIEWPORT_LEFT_MARGIN, rect.right - width);
      const next: AnchoredPopoverPosition = { top, left };
      if (heightMin !== undefined && heightBottomMargin !== undefined) {
        next.height = Math.max(heightMin, window.innerHeight - top - heightBottomMargin);
      }
      setPosition(next);
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef, width, heightMin, heightBottomMargin]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      if (
        outsideClickIgnoreSelector &&
        target instanceof Element &&
        target.closest(outsideClickIgnoreSelector)
      ) {
        return;
      }
      onCloseRef.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, anchorRef, outsideClickIgnoreSelector]);

  return { popRef, position };
}
