import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { apiService } from '@/utils/apiService';

export interface PresetFilter {
  uuid: string;
  name: string;
  filter_json: string;
  raw_transformed_filter: string;
  user_id?: string;
  CreatedAt?: string;
}

interface PresetFiltersState {
  list: PresetFilter[];
  loading: boolean;
  saving: boolean;
  /** True after the first successful fetch — gates re-fetches. */
  loaded: boolean;
  error: string | null;
}

const initialState: PresetFiltersState = {
  list: [],
  loading: false,
  saving: false,
  loaded: false,
  error: null,
};

export const fetchPresetFilters = createAsyncThunk<
  PresetFilter[],
  void | { force?: boolean },
  { rejectValue: string; state: RootState }
>(
  'presetFilters/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = (await apiService.transactions.getAllTransactionPresetFilters()) as {
        data: { data?: PresetFilter[] };
      };
      return res.data?.data ?? [];
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message || 'Failed to load preset filters');
    }
  },
  {
    // Skip the network call if we already have data AND aren't being asked to
    // force a refresh. Also skip if a fetch is already in flight.
    condition: (arg, { getState }) => {
      const { loading, loaded } = getState().presetFilters;
      if (loading) return false;
      if (loaded && !(arg && typeof arg === 'object' && arg.force)) return false;
      return true;
    },
  }
);

export interface SavePresetPayload {
  name: string;
  filter_json: string;
  raw_transformed_filter: string;
}

export const savePresetFilter = createAsyncThunk<
  PresetFilter | null,
  SavePresetPayload,
  { rejectValue: string }
>('presetFilters/save', async (payload, thunkAPI) => {
  try {
    const res = (await apiService.transactions.postTransactionPresetFilterCreate(payload)) as {
      data: { data?: PresetFilter | PresetFilter[] };
    };
    const raw = res.data?.data;
    const created = Array.isArray(raw) ? raw[0] : raw;
    // Optimistic placeholder when the API doesn't echo the created row back.
    return created ?? { ...payload, uuid: `tmp_${Date.now()}` };
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message || 'Failed to save preset filter');
  }
});

export const deletePresetFilter = createAsyncThunk<string, string, { rejectValue: string }>(
  'presetFilters/delete',
  async (uuid, thunkAPI) => {
    try {
      await apiService.transactions.deleteTransactionPresetFilter({ uuid });
      return uuid;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message || 'Failed to delete preset filter');
    }
  }
);

const presetFiltersSlice = createSlice({
  name: 'presetFilters',
  initialState,
  reducers: {
    resetPresetFilters: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresetFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPresetFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.list = action.payload;
      })
      .addCase(fetchPresetFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load preset filters';
      })
      .addCase(savePresetFilter.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(savePresetFilter.fulfilled, (state, action) => {
        state.saving = false;
        // Append the created preset (or echo of payload) — no GET round-trip.
        if (action.payload) state.list.push(action.payload);
      })
      .addCase(savePresetFilter.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Failed to save preset filter';
      })
      .addCase(deletePresetFilter.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.uuid !== action.payload);
      })
      .addCase(deletePresetFilter.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to delete preset filter';
      });
  },
});

export const { resetPresetFilters } = presetFiltersSlice.actions;
export default presetFiltersSlice.reducer;

export const selectPresetFilters = (state: RootState) => state.presetFilters.list;
export const selectPresetFiltersLoading = (state: RootState) => state.presetFilters.loading;
export const selectPresetFiltersSaving = (state: RootState) => state.presetFilters.saving;
export const selectPresetFiltersLoaded = (state: RootState) => state.presetFilters.loaded;
