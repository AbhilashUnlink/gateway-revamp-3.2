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
      .addCase(createColumnPreferenceList.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createColumnPreferenceList.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(createColumnPreferenceList.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Failed to create column preference';
      })
      .addCase(updateColumnPreferenceList.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateColumnPreferenceList.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(updateColumnPreferenceList.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Failed to update column preference';
      })
      .addCase(deleteColumnPreferenceList.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteColumnPreferenceList.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(deleteColumnPreferenceList.rejected, (state, action) => {
        state.saving = false;
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
