import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DownloadButtonIcon } from '@/assets/icons/action-buttons';
import { PageBar } from '@/components/page-bar';
import DasPopover from '@/components/ui/das-popover';
import { DasPopoverHeader } from '@/components/ui/das-popover-header';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDownloadList, selectHasProcessingDownloads } from '@/store/slices/downloadsSlice';
import type { TableFilter } from '@/types/transactions/transaction.types';
import type { FilterField, FilterRule } from '@/components/filter/types';
import { rulesToEntries } from './filterEntries';
import { useDownloadPopoverState } from './useDownloadPopoverState';
import { TotalRecordsRow, FormatSelector, HistoryList } from './components';

interface Props {
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
  ariaLabel?: string;
}

export function DownloadPopover({
  filters,
  defaultEmail,
  totalCount,
  appliedRules = [],
  fields = [],
  ariaLabel = 'Download',
}: Props) {
  const hasProcessingDownloads = useAppSelector(selectHasProcessingDownloads);
  return (
    <DasPopover>
      <DasPopover.Trigger as={PageBar.ActionButton} aria-label={ariaLabel}>
        <span className="relative inline-flex">
          <DownloadButtonIcon />
          {hasProcessingDownloads && (
            <span
              aria-label="Download in progress"
              className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-[#f7941d] ring-2 ring-white"
            />
          )}
        </span>
      </DasPopover.Trigger>
      <DasPopover.Content
        align="right"
        className="z-[60] mt-2 flex h-[calc(100vh-180px)] max-h-[calc(100vh-180px)] w-[640px] min-h-[420px] flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
      >
        {({ close }) => (
          <PopoverPanelBody
            onClose={close}
            filters={filters}
            defaultEmail={defaultEmail}
            totalCount={totalCount}
            appliedRules={appliedRules}
            fields={fields}
          />
        )}
      </DasPopover.Content>
    </DasPopover>
  );
}

interface PopoverPanelBodyProps {
  onClose: () => void;
  filters: TableFilter[];
  defaultEmail?: string;
  totalCount?: number | string;
  appliedRules: FilterRule[];
  fields: FilterField[];
}

function PopoverPanelBody({
  onClose,
  filters,
  defaultEmail,
  totalCount,
  appliedRules,
  fields,
}: PopoverPanelBodyProps) {
  const { t } = useTranslation() as { t: (key: string, defaultValue?: string) => string };
  const dispatch = useAppDispatch();
  const state = useDownloadPopoverState({ filters, defaultEmail });

  // The panel is unmounted by DasPopover on close, so this effect runs once
  // per "open" — no `open` flag needed.
  useEffect(() => {
    void dispatch(fetchDownloadList());
  }, [dispatch]);

  const appliedFilterEntries = useMemo(
    () => rulesToEntries(appliedRules, fields, t),
    [appliedRules, fields, t]
  );
  const totalRecords =
    totalCount !== undefined && totalCount !== null && totalCount !== '' ? totalCount : '—';

  return (
    <>
      <DasPopoverHeader
        icon="download"
        title={t('download.title')}
        onClose={onClose}
        closeAriaLabel={t('download.close')}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-9 p-4">
        {/* Request row */}
        <div className="flex shrink-0 flex-col gap-4">
          <TotalRecordsRow
            totalRecords={totalRecords}
            appliedFilterEntries={appliedFilterEntries}
            hasAppliedFilters={appliedRules.length > 0}
          />
          <FormatSelector
            format={state.format}
            setFormat={state.setFormat}
            requesting={state.requesting}
            onSubmit={state.submit}
          />
        </div>

        {/* History */}
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <h4 className="shrink-0 text-sm font-semibold text-[#4d4d4d]">
            {t('download.previous_requests')}
          </h4>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <HistoryList
              list={state.list}
              loading={state.loading}
              fields={fields}
              downloadingByJobId={state.downloadingByJobId}
              onDownload={state.downloadByJobId}
            />
          </div>
        </div>
      </div>
    </>
  );
}
