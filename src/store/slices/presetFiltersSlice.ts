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
  error: string | null;
}

const initialState: PresetFiltersState = {
  list: [],
  loading: false,
  saving: false,
  error: null,
};

export const fetchPresetFilters = createAsyncThunk<PresetFilter[], void, { rejectValue: string }>(
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
    // Re-fetch so the list is in sync regardless of the create response shape.
    void thunkAPI.dispatch(fetchPresetFilters());
    return created ?? null;
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
      .addCase(savePresetFilter.fulfilled, (state) => {
        state.saving = false;
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
