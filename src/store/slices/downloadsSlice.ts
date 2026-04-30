import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { apiService } from '@/utils/apiService';
import type { TableFilter } from '@/types/transactions/transaction.types';

/** Shape of one row in `data.records[]`. */
export interface DownloadEntry {
  ID?: number;
  JobID?: string;
  ReportStatus?: string;
  selectedFormatType?: string;
  CreatedAt?: string;
  ReportEndTime?: string;
  ReportURL?: string;
  FileName?: string | null;
  NoOfRecords?: number;
  includeSensitiveColumns?: boolean;
  includeWhiteListedColumns?: boolean;
  FilterList?: Record<string, unknown>;
  UserID?: string;
  MerchantID?: string | null;
  [key: string]: unknown;
}

interface DownloadsState {
  list: DownloadEntry[];
  totalCount: number;
  loading: boolean;
  requesting: boolean;
  /** JobIDs currently fetching their signed download URL. */
  fetchingByJobId: Record<string, boolean>;
  error: string | null;
}

const initialState: DownloadsState = {
  list: [],
  totalCount: 0,
  loading: false,
  requesting: false,
  fetchingByJobId: {},
  error: null,
};

interface ListPayload {
  records: DownloadEntry[];
  total_count: number;
}

/**
 * Defensively unwrap the GET response. The API double-envelopes the payload:
 *   { statusCode, data: { records: [...], total_count: N } }
 * Falls back to several alternate shapes so a backend change doesn't crash UI.
 */
function extractList(payload: unknown): ListPayload {
  if (!payload || typeof payload !== 'object') return { records: [], total_count: 0 };
  const obj = payload as Record<string, unknown>;

  // Real shape: { records, total_count }
  if (Array.isArray(obj.records)) {
    return {
      records: obj.records as DownloadEntry[],
      total_count: typeof obj.total_count === 'number' ? obj.total_count : obj.records.length,
    };
  }

  // Fallback shapes
  if (Array.isArray(obj.data))
    return { records: obj.data as DownloadEntry[], total_count: obj.data.length };
  if (Array.isArray(obj.rows))
    return { records: obj.rows as DownloadEntry[], total_count: obj.rows.length };
  if (Array.isArray(obj.list))
    return { records: obj.list as DownloadEntry[], total_count: obj.list.length };

  // Recurse one level into `.data` for nested envelopes
  if (obj.data && typeof obj.data === 'object') return extractList(obj.data);

  return { records: [], total_count: 0 };
}

export const fetchDownloadList = createAsyncThunk<ListPayload, void, { rejectValue: string }>(
  'downloads/fetchList',
  async (_, thunkAPI) => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const res = (await apiService.transactions.getTransactionReportDownloadList({
        take: 10,
        skip: 0,
        TimeZone: tz,
      })) as { data: unknown };
      return extractList(res.data);
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message || 'Failed to load download list');
    }
  }
);

export interface RequestDownloadPayload {
  filter: TableFilter[];
  selectedFormatType: string;
  notifyEmail: string;
  includeSensitiveColumns: boolean;
  includeWhiteListedColumns: boolean;
  selectedLanguage: string;
  DisplayTimeZone: string;
}

/**
 * Walk the GET-by-jobID response shapes and pull out the signed/public URL.
 * Backends typically return one of:
 *   { data: { data: "https://…" } }
 *   { data: { url: "https://…" } }
 *   { data: { signedUrl: "https://…" } }
 *   { data: { data: { url } } } / { data: { data: { signedUrl } } }
 */
function extractDownloadUrl(payload: unknown): string | null {
  if (typeof payload === 'string') return payload;
  if (!payload || typeof payload !== 'object') return null;
  const obj = payload as Record<string, unknown>;
  for (const key of ['url', 'signedUrl', 'downloadUrl', 'preSignedUrl', 'presignedUrl']) {
    const v = obj[key];
    if (typeof v === 'string' && v) return v;
  }
  if (obj.data) return extractDownloadUrl(obj.data);
  return null;
}

export const downloadReportByJobId = createAsyncThunk<
  { jobID: string; url: string },
  string,
  { rejectValue: string }
>('downloads/downloadByJobId', async (jobID, thunkAPI) => {
  try {
    const res = (await apiService.transactions.getTransactionReportDownloadByJobId({
      jobID,
    })) as { data: unknown };
    const url = extractDownloadUrl(res.data);
    if (!url) {
      return thunkAPI.rejectWithValue('Download URL not returned by server');
    }
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    return { jobID, url };
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message || 'Failed to fetch download URL');
  }
});

export const requestDownload = createAsyncThunk<
  void,
  RequestDownloadPayload,
  { rejectValue: string }
>('downloads/request', async (payload, thunkAPI) => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    await apiService.transactions.postTransactionReportDownload({
      take: 10,
      skip: 0,
      TimeZone: tz,
      ...payload,
    });
    void thunkAPI.dispatch(fetchDownloadList());
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message || 'Failed to request download');
  }
});

const downloadsSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    resetDownloads: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDownloadList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDownloadList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.records;
        state.totalCount = action.payload.total_count;
      })
      .addCase(fetchDownloadList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load download list';
      })
      .addCase(requestDownload.pending, (state) => {
        state.requesting = true;
        state.error = null;
      })
      .addCase(requestDownload.fulfilled, (state) => {
        state.requesting = false;
      })
      .addCase(requestDownload.rejected, (state, action) => {
        state.requesting = false;
        state.error = action.payload ?? 'Failed to request download';
      })
      .addCase(downloadReportByJobId.pending, (state, action) => {
        state.fetchingByJobId[action.meta.arg] = true;
      })
      .addCase(downloadReportByJobId.fulfilled, (state, action) => {
        delete state.fetchingByJobId[action.payload.jobID];
      })
      .addCase(downloadReportByJobId.rejected, (state, action) => {
        delete state.fetchingByJobId[action.meta.arg];
        state.error = action.payload ?? 'Failed to fetch download URL';
      });
  },
});

export const { resetDownloads } = downloadsSlice.actions;
export default downloadsSlice.reducer;

export const selectDownloads = (state: RootState) => state.downloads.list;
export const selectDownloadsTotalCount = (state: RootState) => state.downloads.totalCount;
export const selectDownloadsLoading = (state: RootState) => state.downloads.loading;
export const selectDownloadsRequesting = (state: RootState) => state.downloads.requesting;
export const selectDownloadsError = (state: RootState) => state.downloads.error;
export const selectDownloadingByJobId = (state: RootState) => state.downloads.fetchingByJobId;
export const selectHasProcessingDownloads = (state: RootState) =>
  state.downloads.list.some((item) => {
    const s = String(item.ReportStatus ?? '').toUpperCase();
    return s === 'PROCESSING' || s === 'PENDING' || s === 'IN_PROGRESS';
  });
