import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { apiService } from '@/utils/apiService';

export interface ColumnPreferenceList {
  uuid: string;
  name: string;
  columns_json: string[];
  isSelected?: boolean;
  user_id?: string;
  CreatedAt?: string;
}

interface ColumnPreferenceListsState {
  list: ColumnPreferenceList[];
  loading: boolean;
  saving: boolean;
  loaded: boolean;
  error: string | null;
}

const initialState: ColumnPreferenceListsState = {
  list: [],
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
  'columnPreferenceLists/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = (await apiService.transactions.getAllTransactionColumnPreferences()) as {
        data: { data?: ColumnPreferenceList[] };
      };
      return res.data?.data ?? [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        (err as Error).message || 'Failed to load column preferences'
      );
    }
  },
  {
    condition: (arg, { getState }) => {
      const { loading, loaded } = getState().columnPreferenceLists;
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
>('columnPreferenceLists/create', async (payload, thunkAPI) => {
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
>('columnPreferenceLists/update', async (payload, thunkAPI) => {
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
  'columnPreferenceLists/delete',
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
  name: 'columnPreferenceLists',
  initialState,
  reducers: {
    resetColumnPreferenceLists: () => initialState,
    /** Mark a single list as selected locally (mirrors `isSelected` flag). */
    setSelectedListUuid(state, action: { payload: string | null }) {
      for (const item of state.list) {
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
        state.list = action.payload;
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
        if (action.payload) {
          // New entry becomes selected — clear isSelected on others.
          for (const item of state.list) item.isSelected = false;
          state.list.push(action.payload);
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
        if (!action.payload) return;
        const updated = action.payload;
        const idx = state.list.findIndex((p) => p.uuid === updated.uuid);
        if (idx >= 0) state.list[idx] = updated;
        if (updated.isSelected) {
          for (const item of state.list) item.isSelected = item.uuid === updated.uuid;
        }
      })
      .addCase(updateColumnPreferenceList.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Failed to update column preference';
      })
      .addCase(deleteColumnPreferenceList.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.uuid !== action.payload);
      })
      .addCase(deleteColumnPreferenceList.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to delete column preference';
      });
  },
});

export const { resetColumnPreferenceLists, setSelectedListUuid } = slice.actions;
export default slice.reducer;

export const selectColumnPreferenceLists = (state: RootState) => state.columnPreferenceLists.list;
export const selectColumnPreferenceListsLoading = (state: RootState) =>
  state.columnPreferenceLists.loading;
export const selectColumnPreferenceListsSaving = (state: RootState) =>
  state.columnPreferenceLists.saving;
export const selectActiveColumnPreferenceList = (state: RootState) =>
  state.columnPreferenceLists.list.find((p) => p.isSelected) ?? null;
