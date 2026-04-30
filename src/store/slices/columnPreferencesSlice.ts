import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { apiService } from '@/utils/apiService';

// ─────────────────────────── Local view state ───────────────────────────
// Per-screen applied order/visibility that drives what the table actually
// renders. Persisted to localStorage so the view survives reloads.

export interface ScreenColumnPreference {
  /** Column ids in the order they should appear. Empty = use default order. */
  order: string[];
  /** Column ids hidden from the table. */
  hidden: string[];
}

// ─────────────────────────── Server profiles ───────────────────────────
// Named column-preference lists fetched from the backend. Not persisted —
// always re-fetched on mount.

export interface ColumnPreferenceList {
  uuid: string;
  name: string;
  columns_json: string[];
  isSelected?: boolean;
  user_id?: string;
  CreatedAt?: string;
}

interface ColumnPreferencesState {
  byScreen: Record<string, ScreenColumnPreference>;
  lists: ColumnPreferenceList[];
  loading: boolean;
  saving: boolean;
  loaded: boolean;
  error: string | null;
}

const initialState: ColumnPreferencesState = {
  byScreen: {},
  lists: [],
  loading: false,
  saving: false,
  loaded: false,
  error: null,
};

/** Backend wraps the create/update payload as `[{count}, <preference>]`. */
function pickPreferenceFromCreate(raw: unknown): ColumnPreferenceList | null {
  if (!Array.isArray(raw)) return raw as ColumnPreferenceList | null;
  for (const entry of raw) {
    if (entry && typeof entry === 'object' && 'uuid' in (entry as object)) {
      return entry as ColumnPreferenceList;
    }
  }
  return null;
}

export const fetchColumnPreferenceLists = createAsyncThunk<
  ColumnPreferenceList[],
  void | { force?: boolean },
  { rejectValue: string; state: RootState }
>(
  'columnPreferences/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = (await apiService.transactions.getAllTransactionColumnPreferences()) as {
        data: { data?: { records?: ColumnPreferenceList[] } | ColumnPreferenceList[] };
      };
      const data = res.data?.data;
      if (Array.isArray(data)) return data;
      return data?.records ?? [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        (err as Error).message || 'Failed to load column preferences'
      );
    }
  },
  {
    condition: (arg, { getState }) => {
      const { loading, loaded } = getState().columnPreferences;
      if (loading) return false;
      if (loaded && !(arg && typeof arg === 'object' && arg.force)) return false;
      return true;
    },
  }
);

export interface CreateColumnPreferencePayload {
  name: string;
  columns_json: string[];
  currentSelectedList?: boolean;
}

export const createColumnPreferenceList = createAsyncThunk<
  ColumnPreferenceList | null,
  CreateColumnPreferencePayload,
  { rejectValue: string }
>('columnPreferences/create', async (payload, thunkAPI) => {
  try {
    const res = (await apiService.transactions.postTransactionColumnPreferenceCreate({
      currentSelectedList: true,
      ...payload,
    })) as { data: { data?: unknown } };
    return pickPreferenceFromCreate(res.data?.data);
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message || 'Failed to create column preference');
  }
});

export interface UpdateColumnPreferencePayload {
  uuid: string;
  name: string;
  columns_json: string[];
  currentSelectedList?: boolean;
}

export const updateColumnPreferenceList = createAsyncThunk<
  ColumnPreferenceList | null,
  UpdateColumnPreferencePayload,
  { rejectValue: string }
>('columnPreferences/update', async (payload, thunkAPI) => {
  try {
    const { uuid, ...rest } = payload;
    const res = (await apiService.transactions.postTransactionColumnPreferenceUpdate(
      { uuid },
      { currentSelectedList: true, ...rest }
    )) as { data: { data?: unknown } };
    return pickPreferenceFromCreate(res.data?.data);
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message || 'Failed to update column preference');
  }
});

export const deleteColumnPreferenceList = createAsyncThunk<string, string, { rejectValue: string }>(
  'columnPreferences/delete',
  async (uuid, thunkAPI) => {
    try {
      await apiService.transactions.postTransactionColumnPreferenceDelete({ uuid });
      return uuid;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        (err as Error).message || 'Failed to delete column preference'
      );
    }
  }
);

const slice = createSlice({
  name: 'columnPreferences',
  initialState,
  reducers: {
    setColumnPreference(
      state,
      action: PayloadAction<{ screen: string; preference: ScreenColumnPreference }>
    ) {
      state.byScreen[action.payload.screen] = action.payload.preference;
    },
    resetColumnPreference(state, action: PayloadAction<string>) {
      delete state.byScreen[action.payload];
    },
    resetColumnPreferenceLists(state) {
      state.lists = [];
      state.loading = false;
      state.saving = false;
      state.loaded = false;
      state.error = null;
    },
    /** Mark a single list as selected locally (mirrors `isSelected` flag). */
    setSelectedListUuid(state, action: PayloadAction<string | null>) {
      for (const item of state.lists) {
        item.isSelected = item.uuid === action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumnPreferenceLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColumnPreferenceLists.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.lists = action.payload;
      })
      .addCase(fetchColumnPreferenceLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load column preferences';
      })
      .addCase(createColumnPreferenceList.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createColumnPreferenceList.fulfilled, (state, action) => {
        state.saving = false;
        const created = action.payload;
        if (created) {
          if (created.isSelected) {
            for (const item of state.lists) item.isSelected = false;
          }
          state.lists.push(created);
        }
      })
      .addCase(createColumnPreferenceList.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Failed to create column preference';
      })
      .addCase(updateColumnPreferenceList.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateColumnPreferenceList.fulfilled, (state, action) => {
        state.saving = false;
        const updated = action.payload;
        if (!updated) return;
        if (updated.isSelected) {
          for (const item of state.lists) item.isSelected = false;
        }
        const idx = state.lists.findIndex((p) => p.uuid === updated.uuid);
        if (idx >= 0) state.lists[idx] = updated;
        else state.lists.push(updated);
      })
      .addCase(updateColumnPreferenceList.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Failed to update column preference';
      })
      .addCase(deleteColumnPreferenceList.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteColumnPreferenceList.fulfilled, (state, action) => {
        state.saving = false;
        state.lists = state.lists.filter((p) => p.uuid !== action.payload);
      })
      .addCase(deleteColumnPreferenceList.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Failed to delete column preference';
      });
  },
});

export const {
  setColumnPreference,
  resetColumnPreference,
  resetColumnPreferenceLists,
  setSelectedListUuid,
} = slice.actions;
export default slice.reducer;

// ─────────────────────────── Selectors ───────────────────────────
const EMPTY: ScreenColumnPreference = { order: [], hidden: [] };

export const selectColumnPreference = (screen: string) => (state: RootState) =>
  state.columnPreferences.byScreen[screen] ?? EMPTY;

export const selectColumnPreferenceLists = (state: RootState) => state.columnPreferences.lists;
export const selectColumnPreferenceListsLoading = (state: RootState) =>
  state.columnPreferences.loading;
export const selectColumnPreferenceListsSaving = (state: RootState) =>
  state.columnPreferences.saving;
export const selectActiveColumnPreferenceList = (state: RootState) =>
  state.columnPreferences.lists.find((p) => p.isSelected) ?? null;
