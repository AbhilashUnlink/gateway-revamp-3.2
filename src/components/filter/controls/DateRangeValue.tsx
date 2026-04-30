import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar } from 'lucide-react';
import { useUserDateFormat } from '@/hooks/useUserDateFormat';

interface Value {
  from?: string;
  to?: string;
}

interface Props {
  value: Value;
  onChange: (v: Value) => void;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
}

const POPOVER_WIDTH = 540;
const MENU_GAP = 4;
const MENU_MAX_HEIGHT = 460;

type Tab = 'absolute' | 'relative';

// Relative quick options grouped by unit (mirrors old UI's Days/Hours/Minutes grid).
const REL_DAYS = [1, 2, 3, 4, 5, 6, 7];
const REL_HOURS = [1, 2, 3, 4, 6, 8, 12, 18, 23];
const REL_MINUTES = [5, 10, 15, 20, 30, 45];

// ── Helpers ──────────────────────────────────────────────────────────────

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** Local-timezone "YYYY-MM-DD" from a Date. */
function toDateInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Local-timezone "HH:mm:ss" from a Date. */
function toTimeInput(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Combine "YYYY-MM-DD" + "HH:mm[:ss]" into an ISO string in local TZ. */
function combine(date: string, time: string): string | undefined {
  if (!date) return undefined;
  const t = time || '00:00:00';
  const [y, mo, d] = date.split('-').map(Number);
  const [h, mi, s = 0] = t.split(':').map(Number);
  if (!y || !mo || !d) return undefined;
  return new Date(y, mo - 1, d, h, mi, s).toISOString();
}

/** Split an ISO datetime back into date + time parts for the inputs. */
function split(iso: string | undefined): { date: string; time: string } {
  if (!iso) return { date: '', time: '' };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: '', time: '' };
  return { date: toDateInput(d), time: toTimeInput(d) };
}

function relativeRange(unit: 'minutes' | 'hours' | 'days', amount: number): Value {
  const to = new Date();
  const from = new Date(to);
  if (unit === 'minutes') from.setMinutes(from.getMinutes() - amount);
  if (unit === 'hours') from.setHours(from.getHours() - amount);
  if (unit === 'days') from.setDate(from.getDate() - amount);
  return { from: from.toISOString(), to: to.toISOString() };
}

// ── Component ────────────────────────────────────────────────────────────

export function DateRangeValue({ value, onChange }: Props) {
  const formatUserDate = useUserDateFormat();
  const formatRange = (from?: string, to?: string): string => {
    if (!from && !to) return '';
    const fmt = (iso?: string) => (iso ? formatUserDate(iso) : '—');
    return `${fmt(from)}  →  ${fmt(to)}`;
  };
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('absolute');
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Local draft for absolute tab — only commits on Apply.
  const fromParts = useMemo(() => split(value?.from), [value?.from]);
  const toParts = useMemo(() => split(value?.to), [value?.to]);

  const [fromDate, setFromDate] = useState(fromParts.date);
  const [fromTime, setFromTime] = useState(fromParts.time || '00:00:00');
  const [toDate, setToDate] = useState(toParts.date);
  const [toTime, setToTime] = useState(toParts.time || '23:59:59');

  const openPopover = () => {
    // Sync drafts from upstream value at the moment of opening — done
    // imperatively (in the click handler) rather than via useEffect so we
    // don't trip set-state-in-effect lints.
    setFromDate(fromParts.date);
    setFromTime(fromParts.time || '00:00:00');
    setToDate(toParts.date);
    setToTime(toParts.time || '23:59:59');
    setOpen(true);
  };

  // Position the portaled popover relative to the trigger.
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const t = triggerRef.current?.getBoundingClientRect();
      if (!t) return;
      const spaceBelow = window.innerHeight - t.bottom - MENU_GAP;
      const flip = spaceBelow < 320 && t.top > spaceBelow;
      const top = flip
        ? Math.max(8, t.top - MENU_GAP - Math.min(MENU_MAX_HEIGHT, t.top - 16))
        : t.bottom + MENU_GAP;
      const left = Math.max(8, t.left + t.width - POPOVER_WIDTH);
      setMenuPos({ top, left, width: POPOVER_WIDTH });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const display = formatRange(value?.from, value?.to);

  const applyAbsolute = () => {
    const from = combine(fromDate, fromTime);
    const to = combine(toDate, toTime);
    onChange({ from, to });
    setOpen(false);
  };

  const applyRelative = (v: Value) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        title={
          display
            ? `From: ${value?.from ? formatUserDate(value.from) : '—'}\nTo: ${value?.to ? formatUserDate(value.to) : '—'}`
            : undefined
        }
        onClick={() => (open ? setOpen(false) : openPopover())}
        className="flex h-10 w-full items-center gap-2 overflow-hidden rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
      >
        <Calendar size={14} className="shrink-0 text-[#808080]" />
        <span className={`min-w-0 flex-1 truncate text-left ${display ? '' : 'text-[#808080]'}`}>
          {display || 'Select date range…'}
        </span>
      </button>

      {open &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            data-filter-portal="true"
            className="fixed flex flex-col rounded-lg border border-[#e5e5e5] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
            style={{
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              maxHeight: MENU_MAX_HEIGHT,
              zIndex: 1500,
            }}
          >
            {/* Tab bar */}
            <div className="flex border-b border-[#f0f0f0]">
              {(['absolute', 'relative'] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={[
                    'flex-1 px-4 py-2.5 text-sm font-medium uppercase tracking-wide',
                    tab === t
                      ? 'border-b-2 border-[#1a1a1a] text-[#1a1a1a]'
                      : 'text-[#808080] hover:text-[#1a1a1a]',
                  ].join(' ')}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Selected range preview — reflects the current draft (absolute)
                or the applied value (relative). */}
            {(() => {
              const draftFrom = tab === 'absolute' ? combine(fromDate, fromTime) : value?.from;
              const draftTo = tab === 'absolute' ? combine(toDate, toTime) : value?.to;
              const fromLabel = draftFrom ? formatUserDate(draftFrom) : '—';
              const toLabel = draftTo ? formatUserDate(draftTo) : '—';
              const titleText =
                draftFrom && draftTo ? `${fromLabel}  →  ${toLabel}` : 'No range selected';
              return (
                <div
                  className="border-b border-[#f0f0f0] bg-[#fafafa] px-4 py-2.5"
                  title={titleText}
                >
                  <div className="text-[10px] font-medium uppercase tracking-wide text-[#808080]">
                    Selected
                  </div>
                  <div className="mt-0.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs text-[#1a1a1a]">
                    <span className="font-medium text-[#808080]">From</span>
                    <span className="truncate">{fromLabel}</span>
                    <span className="font-medium text-[#808080]">To</span>
                    <span className="truncate">{toLabel}</span>
                  </div>
                </div>
              );
            })()}

            {/* Body */}
            <div className="overflow-auto p-4">
              {tab === 'absolute' ? (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="mb-1 text-xs font-medium text-[#808080]">Start date</div>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
                      />
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-medium text-[#808080]">End date</div>
                      <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        min={fromDate || undefined}
                        className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
                      />
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-medium text-[#808080]">Start time</div>
                      <input
                        type="time"
                        step={1}
                        value={fromTime}
                        onChange={(e) => setFromTime(e.target.value)}
                        className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
                      />
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-medium text-[#808080]">End time</div>
                      <input
                        type="time"
                        step={1}
                        value={toTime}
                        onChange={(e) => setToTime(e.target.value)}
                        className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 border-t border-[#f0f0f0] pt-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-1.5 text-sm text-[#1a1a1a] hover:bg-[#fafafa]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={applyAbsolute}
                      disabled={!fromDate || !toDate}
                      className="rounded-lg bg-[#1a1a1a] px-4 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <RelativeGroup
                    label="Days"
                    items={REL_DAYS}
                    onPick={(n) => applyRelative(relativeRange('days', n))}
                    suffix=" d"
                  />
                  <RelativeGroup
                    label="Hours"
                    items={REL_HOURS}
                    onPick={(n) => applyRelative(relativeRange('hours', n))}
                    suffix=" h"
                  />
                  <RelativeGroup
                    label="Minutes"
                    items={REL_MINUTES}
                    onPick={(n) => applyRelative(relativeRange('minutes', n))}
                    suffix=" min"
                  />
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function RelativeGroup({
  label,
  items,
  onPick,
  suffix,
}: {
  label: string;
  items: number[];
  onPick: (n: number) => void;
  suffix: string;
}) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[#808080]">
        Last {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPick(n)}
            className="h-8 rounded-full border border-[#e5e5e5] bg-white px-3 text-xs font-medium text-[#1a1a1a] hover:border-[#1a1a1a] hover:bg-[#fafafa]"
          >
            {n}
            {suffix}
          </button>
        ))}
      </div>
    </div>
  );
}
