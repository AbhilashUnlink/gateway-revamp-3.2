import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { apiService } from '@/utils/apiService';

export type UserPreference = Record<string, unknown> | null;
export type GatewayConfig = Record<string, unknown> | null;

interface GatewayConfigState {
  userPreference: UserPreference;
  config: GatewayConfig;
  loading: boolean;
  error: string | null;
  alreadyFetched: boolean;
}

const initialState: GatewayConfigState = {
  userPreference: null,
  config: null,
  loading: false,
  error: null,
  alreadyFetched: false,
};

/**
 * Keys on the userPreference payload that we deliberately do not store —
 * column-preference profiles for transactions and statements are owned by
 * dedicated endpoints (`/transaction-column-preference/getAll` etc).
 */
const STRIPPED_USER_PREFERENCE_KEYS = ['transactionList', 'statementList'] as const;

function stripStaleUserPreferenceKeys(raw: Record<string, unknown> | null): UserPreference {
  if (!raw) return null;
  const out: Record<string, unknown> = { ...raw };
  for (const key of STRIPPED_USER_PREFERENCE_KEYS) delete out[key];
  return out;
}

export const fetchUserPreferences = createAsyncThunk<UserPreference, void, { rejectValue: string }>(
  'gatewayConfig/fetchUserPreferences',
  async (_, thunkAPI) => {
    try {
      const res = (await apiService.dasconfig.userPreferences()) as {
        data: { data?: Array<{ configuration?: Record<string, unknown> }> };
      };
      const configuration = res.data?.data?.[0]?.configuration ?? null;
      return stripStaleUserPreferenceKeys(configuration);
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message || 'Failed to load user preferences');
    }
  }
);

export const fetchGatewayConfig = createAsyncThunk<GatewayConfig, void, { rejectValue: string }>(
  'gatewayConfig/fetchGatewayConfig',
  async (_, thunkAPI) => {
    try {
      const res = (await apiService.dasconfig.gatewayConfiguration()) as {
        data: { data?: Record<string, unknown> };
      };
      return res.data?.data ?? null;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        (err as Error).message || 'Failed to load gateway configuration'
      );
    }
  }
);

const gatewayConfigSlice = createSlice({
  name: 'gatewayConfig',
  initialState,
  reducers: {
    resetGatewayConfig: () => initialState,
    markGatewayConfigFetched: (state) => {
      state.alreadyFetched = true;
    },
    resetGatewayConfigFetched: (state) => {
      state.alreadyFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.userPreference = action.payload;
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load user preferences';
      })
      .addCase(fetchGatewayConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGatewayConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
      })
      .addCase(fetchGatewayConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load gateway configuration';
      });
  },
});

export const { resetGatewayConfig, markGatewayConfigFetched, resetGatewayConfigFetched } =
  gatewayConfigSlice.actions;
export default gatewayConfigSlice.reducer;

export const selectGatewayConfigAlreadyFetched = (state: RootState) =>
  state.gatewayConfig.alreadyFetched;

// ── Base selectors ────────────────────────────────────────────────────────

export const selectUserPreference = (state: RootState) => state.gatewayConfig.userPreference;
export const selectGatewayConfig = (state: RootState) => state.gatewayConfig.config;
export const selectGatewayConfigLoading = (state: RootState) => state.gatewayConfig.loading;
export const selectGatewayConfigError = (state: RootState) => state.gatewayConfig.error;

const readStringPref = (pref: UserPreference, key: string): string | null => {
  if (!pref) return null;
  const v = pref[key];
  return typeof v === 'string' && v ? v : null;
};

/** User-preferred date pattern (date-fns subset, see `utils/formatDate.ts`). */
export const selectUserDateFormat = (state: RootState) =>
  readStringPref(state.gatewayConfig.userPreference, 'dateFormatType');

/** User-preferred report download format (e.g. "excel", "csv", "pdf"). */
export const selectUserFormatType = (state: RootState) =>
  readStringPref(state.gatewayConfig.userPreference, 'formatType');

/** User-preferred stats currency (e.g. "HKD", "PHP"). */
export const selectUserCurrencyType = (state: RootState) =>
  readStringPref(state.gatewayConfig.userPreference, 'currencyType');

// ── Typed option selectors ────────────────────────────────────────────────
//
// All return `{ label, value }[]`. Memoized so consumers can use them in
// useSelector without forcing rerenders.

export interface FilterOption {
  label: string;
  value: string;
}

const toStringOptions = (raw: unknown): FilterOption[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((v) => (typeof v === 'string' || typeof v === 'number' ? String(v) : null))
    .filter((v): v is string => v !== null && v !== '')
    .map((v) => ({ label: v, value: v }));
};

const pickKey = (config: GatewayConfig, key: string): unknown => {
  if (!config) return null;
  return (config as Record<string, unknown>)[key] ?? null;
};

export const selectDasmidOptions = createSelector([selectGatewayConfig], (config) => {
  // Old UI logic: derive from merchantData[].DASMID (can be nested), flatten,
  // dedupe, sort, then map to { label, value }.
  const merchantData = pickKey(config, 'merchantData');
  if (Array.isArray(merchantData) && merchantData.length > 0) {
    const flat = merchantData
      .map((m) => (m && typeof m === 'object' ? (m as Record<string, unknown>).DASMID : null))
      .flat()
      .filter((v): v is string => typeof v === 'string' && v.length > 0);
    const unique = Array.from(new Set(flat)).sort((a, b) => a.localeCompare(b));
    return unique.map((v) => ({ label: v, value: v }));
  }
  // Fallback: a flat dasmidOptions array on the config root.
  return toStringOptions(pickKey(config, 'dasmidOptions'));
});

export const selectAcquirerOptions = createSelector([selectGatewayConfig], (config) =>
  toStringOptions(pickKey(config, 'acquirers'))
);

export const selectAcquirerMidOptions = createSelector([selectGatewayConfig], (config) => {
  const raw = pickKey(config, 'acquirerMIDData');
  if (Array.isArray(raw)) return toStringOptions(raw);
  if (raw && typeof raw === 'object') {
    const flat = Object.values(raw as Record<string, unknown>).flat();
    return toStringOptions(flat);
  }
  return [];
});

export const selectBusinessLocationOptions = createSelector([selectGatewayConfig], (config) => {
  const raw = pickKey(config, 'businessLocations');
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === 'string') return { label: item, value: item };
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>;
        const label = (o.name ?? o.Country ?? o.label) as string | undefined;
        const value = (o.code ?? o.value ?? label) as string | undefined;
        if (label && value) return { label, value };
      }
      return null;
    })
    .filter((o): o is FilterOption => !!o);
});

export const selectMerchantOptions = createSelector([selectGatewayConfig], (config) => {
  const raw = pickKey(config, 'merchantData');
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: FilterOption[] = [];
  for (const m of raw) {
    if (!m || typeof m !== 'object') continue;
    const o = m as Record<string, unknown>;
    const id = (o.MerchantID ?? o.merchantId) as string | undefined;
    const label = (o.LegalName ?? o.legalName ?? id) as string | undefined;
    if (id && label && !seen.has(id)) {
      seen.add(id);
      out.push({ label, value: id });
    }
  }
  return out;
});

export const selectChargebackReasonCodeOptions = createSelector([selectGatewayConfig], (config) => {
  const raw = pickKey(config, 'chargebackReasonCode');
  if (!raw || typeof raw !== 'object') return [];
  const out: FilterOption[] = [];
  for (const list of Object.values(raw as Record<string, unknown>)) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (!item || typeof item !== 'object') continue;
      const o = item as Record<string, unknown>;
      const code = o.ReasonCode as string | undefined;
      const desc = o.ReasonCodeDescription as string | undefined;
      if (code) {
        const label = desc ? `${code} ${desc}` : code;
        out.push({ label, value: label });
      }
    }
  }
  return out;
});

export const selectTransactionTypeOptions = createSelector([selectGatewayConfig], (config) =>
  toStringOptions(pickKey(config, 'transactionTypes'))
);

export const selectStatusOptions = createSelector([selectGatewayConfig], (config) =>
  toStringOptions(pickKey(config, 'statuses'))
);

export const selectPaymentSchemeOptions = createSelector([selectGatewayConfig], (config) =>
  toStringOptions(pickKey(config, 'paymentSchemes'))
);

export const selectPaymentTypeOptions = createSelector([selectGatewayConfig], (config) =>
  toStringOptions(pickKey(config, 'paymentTypes'))
);

export const selectCurrencyOptions = createSelector([selectGatewayConfig], (config) =>
  toStringOptions(pickKey(config, 'currencies'))
);

// ── Generic resolver ──────────────────────────────────────────────────────

import type { GatewayConfigKey } from '@/components/filter/types';

// Stable empty array — using a fresh `[]` literal each call would make
// useSelector emit "returned a different result" warnings for every field
// that has no `optionsFromConfig`.
const EMPTY_OPTIONS: FilterOption[] = [];

export const selectOptionsByKey = (key: GatewayConfigKey | undefined) => (state: RootState) => {
  if (!key) return EMPTY_OPTIONS;
  switch (key) {
    case 'dasmidOptions':
      return selectDasmidOptions(state);
    case 'acquirers':
      return selectAcquirerOptions(state);
    case 'acquirerMIDData':
      return selectAcquirerMidOptions(state);
    case 'businessLocations':
      return selectBusinessLocationOptions(state);
    case 'merchantData':
      return selectMerchantOptions(state);
    case 'chargebackReasonCode':
      return selectChargebackReasonCodeOptions(state);
    case 'transactionTypes':
      return selectTransactionTypeOptions(state);
    case 'statuses':
      return selectStatusOptions(state);
    case 'paymentSchemes':
      return selectPaymentSchemeOptions(state);
    case 'paymentTypes':
      return selectPaymentTypeOptions(state);
    case 'currencies':
      return selectCurrencyOptions(state);
    default:
      return EMPTY_OPTIONS;
  }
};
