import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  downloadReportByJobId,
  requestDownload,
  selectDownloadingByJobId,
  selectDownloads,
  selectDownloadsLoading,
  selectDownloadsRequesting,
} from '@/store/slices/downloadsSlice';
import type { TableFilter } from '@/types/transactions/transaction.types';
import { useFormatSelection } from './useFormatSelection';

interface UseDownloadPopoverStateInput {
  filters: TableFilter[];
  defaultEmail?: string;
}

/**
 * Owns the format selection, submit handler, and the per-job download
 * dispatch. Returns a flat object the popover root destructures and
 * prop-drills to subcomponents.
 *
 * The hook assumes it is mounted only while the popover is open — the
 * panel itself is unmounted by `DasPopover` on close — so it doesn't gate
 * its effects on an external `open` flag.
 */
export function useDownloadPopoverState({ filters, defaultEmail }: UseDownloadPopoverStateInput) {
  const dispatch = useAppDispatch();
  const list = useAppSelector(selectDownloads);
  const loading = useAppSelector(selectDownloadsLoading);
  const requesting = useAppSelector(selectDownloadsRequesting);
  const downloadingByJobId = useAppSelector(selectDownloadingByJobId);

  const { format, setFormat } = useFormatSelection();
  const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', []);

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

  const downloadByJobId = (jobID: string) => dispatch(downloadReportByJobId(jobID));

  return {
    list,
    loading,
    requesting,
    downloadingByJobId,
    format,
    setFormat,
    submit,
    downloadByJobId,
  };
}

export type DownloadPopoverState = ReturnType<typeof useDownloadPopoverState>;
