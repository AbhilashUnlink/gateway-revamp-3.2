import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Download, Loader2, X, FileText, RotateCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  downloadReportByJobId,
  fetchDownloadList,
  requestDownload,
  selectDownloadingByJobId,
  selectDownloads,
  selectDownloadsLoading,
  selectDownloadsRequesting,
  type DownloadEntry,
} from '@/store/slices/downloadsSlice';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { SearchableSelect } from '@/components/filter/controls/SearchableSelect';
import type { TableFilter } from '@/types/transactions/transaction.types';

interface Props {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  /** Currently applied table filters — included in the download request payload. */
  filters: TableFilter[];
  /** Pre-fill notifyEmail from the signed-in user. */
  defaultEmail?: string;
}

const POPOVER_WIDTH = 560;

const FORMAT_OPTIONS = [
  { label: 'Excel (.xlsx)', value: 'excel' },
  { label: 'CSV', value: 'csv' },
  { label: 'PDF', value: 'pdf' },
];

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'EN' },
  { label: '日本語', value: 'JP' },
];

type Tab = 'request' | 'history';

function detectTimeZone(): { iana: string; display: string } {
  const iana = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const offsetMin = -new Date().getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMin);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  const display = `${iana.replace(/_/g, ' ')} (UTC${sign}${hh}:${mm})`;
  return { iana, display };
}

export function DownloadPopover({ open, onClose, anchorRef, filters, defaultEmail }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const list = useAppSelector(selectDownloads);
  const loading = useAppSelector(selectDownloadsLoading);
  const requesting = useAppSelector(selectDownloadsRequesting);
  const downloadingByJobId = useAppSelector(selectDownloadingByJobId);
  const popRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [tab, setTab] = useState<Tab>('request');

  // Form state
  const [format, setFormat] = useState('excel');
  const [email, setEmail] = useState(defaultEmail ?? '');
  const [includeSensitive, setIncludeSensitive] = useState(false);
  const [includeWhitelisted, setIncludeWhitelisted] = useState(false);
  const [language, setLanguage] = useState('EN');
  const tz = useMemo(() => detectTimeZone(), []);

  // Sync email when the prop arrives later (auth slice may load after mount).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(8, rect.right - POPOVER_WIDTH),
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

  // Fetch list whenever popover opens or user switches to history tab.
  useEffect(() => {
    if (!open) return;
    void dispatch(fetchDownloadList());
  }, [open, dispatch]);

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

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = !!format && emailValid && !requesting;

  const submit = async () => {
    if (!canSubmit) return;
    await dispatch(
      requestDownload({
        filter: filters,
        selectedFormatType: format,
        notifyEmail: email,
        includeSensitiveColumns: includeSensitive,
        includeWhiteListedColumns: includeWhitelisted,
        selectedLanguage: language,
        DisplayTimeZone: tz.display,
      })
    );
    setTab('history');
  };

  return createPortal(
    <div
      ref={popRef}
      className={cn(
        'fixed z-[60] flex max-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]'
      )}
      style={{ top: position.top, left: position.left, width: POPOVER_WIDTH }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
        <h3 className="text-base font-semibold text-[#1a1a1a]">
          {t('download.title', 'Transaction Download')}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#fafafa]"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#f0f0f0]">
        {(['request', 'history'] as Tab[]).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              'flex-1 px-4 py-2.5 text-sm font-medium uppercase tracking-wide',
              tab === id
                ? 'border-b-2 border-[#1a1a1a] text-[#1a1a1a]'
                : 'text-[#808080] hover:text-[#1a1a1a]'
            )}
          >
            {id === 'request'
              ? t('download.tab_request', 'Request Download')
              : t('download.tab_history', 'Recent Downloads')}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
        {tab === 'request' ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t('download.format', 'File format')}</Label>
                <SearchableSelect value={format} onChange={setFormat} options={FORMAT_OPTIONS} />
              </div>
              <div>
                <Label>{t('download.language', 'Language')}</Label>
                <SearchableSelect
                  value={language}
                  onChange={setLanguage}
                  options={LANGUAGE_OPTIONS}
                />
              </div>
            </div>

            <div>
              <Label>{t('download.email', 'Notify email')}</Label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
              />
              {!emailValid && email.length > 0 && (
                <div className="mt-1 text-xs text-[#ff4343]">
                  {t('download.email_invalid', 'Enter a valid email')}
                </div>
              )}
            </div>

            <div>
              <Label>{t('download.timezone', 'Timezone')}</Label>
              <div className="flex h-10 items-center rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 text-sm text-[#1a1a1a]">
                {tz.display}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Toggle
                label={t('download.include_sensitive', 'Include sensitive columns')}
                checked={includeSensitive}
                onChange={setIncludeSensitive}
              />
              <Toggle
                label={t('download.include_whitelisted', 'Include whitelisted columns')}
                checked={includeWhitelisted}
                onChange={setIncludeWhitelisted}
              />
            </div>

            <div className="rounded-lg bg-[#fafafa] px-3 py-2 text-xs text-[#808080]">
              {filters.length > 0
                ? t('download.applied_filters', '{{count}} applied filter(s) will be included', {
                    count: filters.length,
                  })
                : t(
                    'download.no_filters',
                    'No filters applied — full result set will be requested'
                  )}
            </div>
          </div>
        ) : (
          <HistoryList
            list={list}
            loading={loading}
            downloadingByJobId={downloadingByJobId}
            onDownload={(jobID) => dispatch(downloadReportByJobId(jobID))}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-[#f0f0f0] px-5 py-3">
        {tab === 'history' ? (
          <>
            <button
              type="button"
              onClick={() => dispatch(fetchDownloadList())}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[#1a1a1a] hover:bg-[#fafafa] disabled:opacity-40"
            >
              <RotateCcw size={14} className={loading ? 'animate-spin' : ''} />
              {t('download.refresh', 'Refresh')}
            </button>
            <Button type="button" variant="ghost" onClick={onClose}>
              {t('download.close', 'Close')}
            </Button>
          </>
        ) : (
          <>
            <span className="text-xs text-[#808080]">
              {t('download.email_note', 'A link will be emailed when ready')}
            </span>
            <Button type="button" onClick={submit} disabled={!canSubmit}>
              {requesting && <Loader2 size={14} className="mr-1.5 animate-spin" />}
              {t('download.request', 'Request download')}
            </Button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// ── Subcomponents ────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 text-xs font-medium uppercase tracking-wide text-[#808080]">
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#e5e5e5] px-3 py-2 hover:bg-[#fafafa]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
      <span className="text-sm text-[#1a1a1a]">{label}</span>
    </label>
  );
}

const STATUS_TONE: Record<string, string> = {
  COMPLETED: 'bg-[#e6f7e6] text-[#1e8f1f]',
  SUCCESS: 'bg-[#e6f7e6] text-[#1e8f1f]',
  PROCESSING: 'bg-[#fff4d6] text-[#a96900]',
  PENDING: 'bg-[#fff4d6] text-[#a96900]',
  IN_PROGRESS: 'bg-[#fff4d6] text-[#a96900]',
  FAILED: 'bg-[#ffe5e5] text-[#ff4343]',
  ERROR: 'bg-[#ffe5e5] text-[#ff4343]',
};

/** Pull a sensible filename for display: prefer FileName → JobID → ReportURL basename. */
function deriveFileName(item: DownloadEntry): string {
  if (item.FileName) return String(item.FileName);
  if (item.JobID) {
    const ext = item.selectedFormatType ? `.${String(item.selectedFormatType).toLowerCase()}` : '';
    return `${item.JobID}${ext}`;
  }
  if (item.ReportURL) {
    const parts = String(item.ReportURL).split('/');
    return parts[parts.length - 1] || String(item.ReportURL);
  }
  return '—';
}

function HistoryList({
  list,
  loading,
  downloadingByJobId,
  onDownload,
}: {
  list: DownloadEntry[];
  loading: boolean;
  downloadingByJobId: Record<string, boolean>;
  onDownload: (jobID: string) => void;
}) {
  const { t } = useTranslation();
  const safeList = Array.isArray(list) ? list : [];

  if (loading && safeList.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-[#808080]">
        <Loader2 size={14} className="animate-spin" />
        {t('download.loading', 'Loading…')}
      </div>
    );
  }

  if (safeList.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg bg-[#fafafa] px-4 py-10 text-center">
        <FileText size={28} className="text-[#bdbdbd]" />
        <span className="text-sm text-[#808080]">
          {t('download.empty', 'No download requests yet')}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {safeList.map((item, idx) => {
        const status = String(item.ReportStatus ?? '').toUpperCase();
        const tone = STATUS_TONE[status] ?? 'bg-[#f0f0f0] text-[#808080]';
        const isCompleted = status === 'COMPLETED' || status === 'SUCCESS';
        const isProcessing =
          status === 'PROCESSING' || status === 'PENDING' || status === 'IN_PROGRESS';
        const fileName = deriveFileName(item);
        return (
          <div
            key={item.JobID ?? item.ID ?? idx}
            className="flex items-center gap-3 rounded-lg border border-[#e5e5e5] bg-white px-3 py-2"
          >
            <FileText size={16} className="shrink-0 text-[#808080]" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-[#1a1a1a]" title={fileName}>
                {fileName}
              </div>
              <div className="flex items-center gap-2 truncate text-xs text-[#808080]">
                {item.selectedFormatType && (
                  <span>{String(item.selectedFormatType).toUpperCase()}</span>
                )}
                {item.NoOfRecords !== undefined && (
                  <span>· {Number(item.NoOfRecords).toLocaleString()} rows</span>
                )}
                {item.CreatedAt && <span>· {new Date(item.CreatedAt).toLocaleString()}</span>}
              </div>
            </div>
            <span className={cn('shrink-0 rounded px-2 py-0.5 text-xs font-medium', tone)}>
              {isProcessing && <Loader2 size={10} className="mr-1 inline animate-spin" />}
              {status || '—'}
            </span>
            {isCompleted && item.JobID && (
              <button
                type="button"
                onClick={() => item.JobID && onDownload(item.JobID)}
                disabled={!!downloadingByJobId[item.JobID]}
                title={item.ReportURL ? String(item.ReportURL) : undefined}
                className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#1a1a1a] px-2.5 text-xs font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloadingByJobId[item.JobID] ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Download size={12} />
                )}
                {t('download.download', 'Download')}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
