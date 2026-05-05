import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { DasSpinner } from '@/components/ui/das-spinner';
import { DasIcon } from '@/components/ui/das-icon';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  downloadReportByJobId,
  fetchDownloadList,
  requestDownload,
  selectDownloadingByJobId,
  selectDownloads,
  selectDownloadsLoading,
  selectDownloadsRequesting,
  selectHasProcessingDownloads,
  type DownloadEntry,
} from '@/store/slices/downloadsSlice';
import { selectUserFormatType } from '@/store/slices/gatewayConfigSlice';
import { cn } from '@/utils/cn';
import type { TableFilter } from '@/types/transactions/transaction.types';
import type { FilterField, FilterRule } from '@/components/filter/types';

interface Props {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  /** Currently applied table filters — included in the download request payload. */
  filters: TableFilter[];
  /** Pre-fill notifyEmail from the signed-in user. */
  defaultEmail?: string;
  /** Total record count from the active table query. */
  totalCount?: number | string;
  /** Applied filter rules from redux — used for the Applied Filters tooltip. */
  appliedRules?: FilterRule[];
  /** Filter field metadata for resolving rule labels. */
  fields?: FilterField[];
}

const POPOVER_WIDTH = 640;
const POPOVER_MIN_HEIGHT = 420;
const POPOVER_VIEWPORT_PADDING = 16;

type FormatValue = 'csv' | 'excel';

function normalizeFormat(value: unknown): FormatValue {
  return String(value ?? '').toLowerCase() === 'csv' ? 'csv' : 'excel';
}

function formatTimestamp(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function deriveFileName(item: DownloadEntry): string {
  if (item.FileName) return String(item.FileName);
  const ts = formatTimestamp(item.CreatedAt);
  return ts ? `Transaction Details ${ts}` : (item.JobID ?? '—');
}

export function DownloadPopover({
  open,
  onClose,
  anchorRef,
  filters,
  defaultEmail,
  totalCount,
  appliedRules = [],
  fields = [],
}: Props) {
  const { t } = useTranslation() as { t: (key: string, defaultValue?: string) => string };
  const dispatch = useAppDispatch();
  const list = useAppSelector(selectDownloads);
  const loading = useAppSelector(selectDownloadsLoading);
  const requesting = useAppSelector(selectDownloadsRequesting);
  const downloadingByJobId = useAppSelector(selectDownloadingByJobId);
  const hasProcessing = useAppSelector(selectHasProcessingDownloads);
  const userFormatType = useAppSelector(selectUserFormatType);
  const popRef = useRef<HTMLDivElement>(null);
  const filtersTriggerRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; height: number } | null>(
    null
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [format, setFormat] = useState<FormatValue>(() => normalizeFormat(userFormatType));
  const formatTouchedRef = useRef(false);
  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', []);

  useEffect(() => {
    if (formatTouchedRef.current) return;
    if (!userFormatType) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormat(normalizeFormat(userFormatType));
  }, [userFormatType]);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const top = rect.bottom + 8;
      const height = Math.max(
        POPOVER_MIN_HEIGHT,
        window.innerHeight - top - POPOVER_VIEWPORT_PADDING - 40
      );
      setPosition({
        top,
        left: Math.max(8, rect.right - POPOVER_WIDTH),
        height,
      });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef]);

  // Re-fetch the list each time the popover opens, but only if a previous
  // request is still processing — otherwise the cached state is reused.
  useEffect(() => {
    if (!open) return;
    if (!hasProcessing) return;
    void dispatch(fetchDownloadList());
  }, [open, hasProcessing, dispatch]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest('[data-filter-portal="true"]')) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, anchorRef, onClose]);

  if (!open || !position) return null;

  const submit = async () => {
    if (requesting) return;
    await dispatch(
      requestDownload({
        filter: filters,
        selectedFormatType: format,
        notifyEmail: defaultEmail ?? '',
        includeSensitiveColumns: false,
        includeWhiteListedColumns: false,
        selectedLanguage: 'EN',
        DisplayTimeZone: tz,
      })
    );
  };

  const totalRecords =
    totalCount !== undefined && totalCount !== null && totalCount !== '' ? totalCount : '—';
  const hasAppliedFilters = appliedRules.length > 0;

  return createPortal(
    <div
      ref={popRef}
      role="dialog"
      aria-modal="false"
      className="fixed z-[60] flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
      style={{
        top: position.top,
        left: position.left,
        width: POPOVER_WIDTH,
        height: position.height,
      }}
    >
      {/* Header — soft orange tint */}
      <div className="flex h-[66px] shrink-0 items-center gap-2 rounded-t-2xl bg-[#fff6e6] px-4 py-1.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
          <DasIcon name="download" size={16} className="text-[#1a1a1a]" />
        </div>
        <h3 className="flex-1 text-base font-semibold leading-5 text-[#1a1a1a]">
          {t('download.title')}
        </h3>
        <Button
          type="button"
          variant="icon"
          size="icon"
          onClick={onClose}
          aria-label={t('download.close')}
        >
          <DasIcon name="circle-x" size={24} strokeWidth={1.5} />
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-9 p-4">
        {/* Request row */}
        <div className="flex shrink-0 flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#4d4d4d]">
              <span className="font-normal">{t('download.total_records')} </span>
              <span className="font-semibold text-[#1a1a1a]">{totalRecords}</span>
            </div>
            <Button
              ref={filtersTriggerRef}
              type="button"
              variant="link"
              size="inline"
              onClick={() => hasAppliedFilters && setFiltersOpen((o) => !o)}
              disabled={!hasAppliedFilters}
              className="text-xs text-[#1a1a1a] underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('download.view_applied_filters')}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#e5e5e5] bg-[#fff6e6] p-3">
            <div className="flex-1 text-sm font-semibold text-[#1a1a1a]">
              {t('download.report_format')}
            </div>
            <Radio
              label={t('download.format_csv')}
              checked={format === 'csv'}
              onChange={() => {
                formatTouchedRef.current = true;
                setFormat('csv');
              }}
            />
            <Radio
              label={t('download.format_excel')}
              checked={format === 'excel'}
              onChange={() => {
                formatTouchedRef.current = true;
                setFormat('excel');
              }}
            />
            <Button
              type="button"
              variant="primary"
              onClick={submit}
              disabled={requesting}
              className="w-auto gap-2 shadow-[0_4px_9px_rgba(0,0,0,0.1)]"
            >
              {requesting && <DasSpinner size={14} />}
              {t('download.request_download')}
            </Button>
          </div>
        </div>

        {/* History */}
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <h4 className="shrink-0 text-sm font-semibold text-[#4d4d4d]">
            {t('download.previous_requests')}
          </h4>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <HistoryList
              list={list}
              loading={loading}
              fields={fields}
              downloadingByJobId={downloadingByJobId}
              onDownload={(jobID) => dispatch(downloadReportByJobId(jobID))}
            />
          </div>
        </div>
      </div>

      {filtersOpen && (
        <AppliedFiltersPopover
          anchorRef={filtersTriggerRef}
          entries={rulesToEntries(appliedRules, fields, t)}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>,
    document.body
  );
}

// ── Subcomponents ────────────────────────────────────────────────────────

function Radio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <span
        className={cn(
          'relative h-5 w-5 rounded-full border bg-white',
          checked ? 'border-[#f7941d]' : 'border-[#e5e5e5]'
        )}
      >
        {checked && (
          <span className="absolute inset-1 rounded-full bg-[#f7941d]" aria-hidden="true" />
        )}
      </span>
      <span className="text-sm text-[#1a1a1a]">{label}</span>
      <input
        type="radio"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
    </label>
  );
}

function HistoryList({
  list,
  loading,
  fields,
  downloadingByJobId,
  onDownload,
}: {
  list: DownloadEntry[];
  loading: boolean;
  fields: FilterField[];
  downloadingByJobId: Record<string, boolean>;
  onDownload: (jobID: string) => void;
}) {
  const { t } = useTranslation();
  const safeList = Array.isArray(list) ? list : [];

  if (loading && safeList.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-[#808080]">
        <DasSpinner size={14} />
        {t('download.loading')}
      </div>
    );
  }

  if (safeList.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg bg-[#fafafa] px-4 py-10 text-center">
        <DasIcon name="file-text" size={28} className="text-[#bdbdbd]" />
        <span className="text-sm text-[#808080]">{t('download.empty')}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {safeList.map((item, idx) => (
        <HistoryRow
          key={item.JobID ?? item.ID ?? idx}
          item={item}
          fields={fields}
          downloading={!!(item.JobID && downloadingByJobId[item.JobID])}
          onDownload={() => item.JobID && onDownload(item.JobID)}
        />
      ))}
    </div>
  );
}

function HistoryRow({
  item,
  fields,
  downloading,
  onDownload,
}: {
  item: DownloadEntry;
  fields: FilterField[];
  downloading: boolean;
  onDownload: () => void;
}) {
  const { t } = useTranslation() as { t: (key: string, defaultValue?: string) => string };
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const status = String(item.ReportStatus ?? '').toUpperCase();
  const isReady = status === 'COMPLETED' || status === 'SUCCESS' || status === 'READY';
  const isProcessing = status === 'PROCESSING' || status === 'PENDING' || status === 'IN_PROGRESS';
  const isFailed = status === 'FAILED' || status === 'ERROR';
  const fileName = deriveFileName(item);
  const itemEntries = useMemo(() => itemFiltersToEntries(item, fields, t), [item, fields, t]);
  const hasItemFilters = itemEntries.length > 0;

  // Progress: ready → 100%, processing → 41% placeholder (no real % from API).
  const progressPct = isReady ? 100 : isProcessing ? 41 : 0;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 pt-0 pb-3">
      {/* Progress bar — sits flush at the top, no horizontal padding inside row's px-3 */}
      <div className="-mx-3 grid grid-cols-1">
        <div className="col-start-1 row-start-1 h-1 rounded-sm bg-[#e5e5e5]" />
        <div
          className={cn(
            'col-start-1 row-start-1 h-1 rounded-sm',
            isFailed ? 'bg-[#ff4343]' : 'bg-[#f7941d]'
          )}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <DasIcon name="timer" size={16} className="text-[#1a1a1a]" />
            <span className="text-xs text-[#1a1a1a]">{t('download.status_preparing')}</span>
          </div>
        ) : (
          <span
            className={cn(
              'inline-flex h-5 items-center rounded-sm px-1 py-1.5 text-xs font-medium uppercase',
              isReady
                ? 'bg-[#c6f3da] text-[#1e8f1f]'
                : isFailed
                  ? 'bg-[#ffe5e5] text-[#ff4343]'
                  : 'bg-[#f0f0f0] text-[#808080]'
            )}
          >
            {isReady
              ? t('download.status_ready')
              : isFailed
                ? t('download.status_failed')
                : status || '—'}
          </span>
        )}
        <Button
          ref={triggerRef}
          type="button"
          variant="link"
          size="inline"
          onClick={() => hasItemFilters && setFiltersOpen((o) => !o)}
          disabled={!hasItemFilters}
          className="text-xs text-[#1a1a1a] underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('download.view_applied_filters')}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <DasIcon name="file-text" size={20} className="shrink-0 text-[#1e8f1f]" />
        <div className="min-w-0 flex-1 truncate text-sm text-[#1a1a1a]" title={fileName}>
          {fileName}
        </div>
        <Button
          type="button"
          variant="primary"
          size="icon"
          onClick={onDownload}
          disabled={!isReady || downloading || !item.JobID}
          aria-label={t('download.download_action')}
          title={item.ReportURL ? String(item.ReportURL) : undefined}
          className={cn(
            'h-6 w-6 shrink-0 rounded-sm shadow-[0_4px_9px_rgba(0,0,0,0.04)] disabled:cursor-not-allowed',
            !isReady && 'opacity-30'
          )}
        >
          {downloading ? <DasSpinner size={14} /> : <DasIcon name="download" size={14} />}
        </Button>
      </div>

      {filtersOpen && (
        <AppliedFiltersPopover
          anchorRef={triggerRef}
          entries={itemEntries}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
}

interface AppliedFilterEntry {
  label: string;
  value: string;
}

function rulesToEntries(
  rules: FilterRule[],
  fields: FilterField[],
  t: (key: string, defaultValue?: string) => string
): AppliedFilterEntry[] {
  const fieldsById = new Map(fields.map((f) => [f.id, f]));
  return rules.map((rule) => {
    const field = fieldsById.get(rule.field);
    return {
      label: field ? t(field.labelKey, field.id) : rule.field,
      value: formatRuleValue(rule),
    };
  });
}

interface ApiFilterEntry {
  field?: string;
  value?: unknown;
  operator?: string;
  operand?: string;
}

function itemFiltersToEntries(
  item: DownloadEntry,
  fields: FilterField[],
  t: (key: string, defaultValue?: string) => string
): AppliedFilterEntry[] {
  const filterList = item.FilterList as { filter?: ApiFilterEntry[] } | undefined;
  const raw = Array.isArray(filterList?.filter) ? filterList!.filter : [];
  const fieldsById = new Map(fields.map((f) => [f.id.toLowerCase(), f]));
  return raw
    .filter((entry): entry is ApiFilterEntry & { field: string } => !!entry?.field)
    .map((entry) => {
      const field = fieldsById.get(entry.field.toLowerCase());
      const label = field ? t(field.labelKey, field.id) : entry.field;
      const v = entry.value;
      let value = '—';
      if (Array.isArray(v)) value = v.length > 0 ? v.join(', ') : '—';
      else if (v !== null && v !== undefined && String(v).length > 0) value = String(v);
      return { label, value };
    });
}

function formatRuleValue(rule: FilterRule): string {
  const v = rule.value;
  if (Array.isArray(v)) return v.length > 0 ? v.join(', ') : '—';
  if (v && typeof v === 'object') {
    const range = v as { from?: string; to?: string };
    if (range.from || range.to) return `${range.from ?? '—'} → ${range.to ?? '—'}`;
    return '—';
  }
  if (v === '' || v === null || v === undefined) return '—';
  return String(v);
}

function AppliedFiltersPopover({
  anchorRef,
  entries,
  onClose,
}: {
  anchorRef: RefObject<HTMLButtonElement | null>;
  entries: AppliedFilterEntry[];
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = 230;
      setPos({
        top: rect.bottom + 6,
        left: Math.max(8, rect.right - width),
      });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [anchorRef]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [anchorRef, onClose]);

  if (!pos) return null;

  return createPortal(
    <div
      ref={ref}
      role="tooltip"
      data-filter-portal="true"
      className="fixed z-[70] flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
      style={{ top: pos.top, left: pos.left, width: 230 }}
    >
      <div className="flex h-8 items-center gap-2 border-b border-[#e5e5e5] bg-white px-3">
        <span className="flex-1 text-sm font-semibold leading-5 text-[#1a1a1a]">
          {t('download.applied_filters_title')}
        </span>
        <Button
          type="button"
          variant="icon"
          size="icon"
          onClick={onClose}
          aria-label={t('download.close')}
          className="h-4 w-4"
        >
          <DasIcon name="x" size={12} />
        </Button>
      </div>
      <div className="flex max-h-[260px] flex-col gap-2 overflow-y-auto p-3">
        {entries.map((entry, idx) => (
          <div key={`${entry.label}-${idx}`} className="flex items-start gap-3">
            <span className="flex-1 text-xs leading-[15px] text-[#808080]">{entry.label}</span>
            <span className="text-right text-xs leading-[15px] text-[#1a1a1a] break-words">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
}
