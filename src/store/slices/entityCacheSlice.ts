import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ProductDetailsData } from '@/types/product/productDetails.types';
import type { AcquirerDetailsData } from '@/types/acquirer/acquirerDetails.types';
import type { MerchantDetailsData } from '@/types/merchant/merchantDetails.types';

export type EntityCacheKind = 'product' | 'acquirer' | 'merchant';

export interface EntityCacheEntry<TData> {
  data: TData | null;
  loading: boolean;
  error: string | null;
}

interface EntityCacheState {
  product: Record<string, EntityCacheEntry<ProductDetailsData>>;
  acquirer: Record<string, EntityCacheEntry<AcquirerDetailsData>>;
  merchant: Record<string, EntityCacheEntry<MerchantDetailsData>>;
}

const initialState: EntityCacheState = {
  product: {},
  acquirer: {},
  merchant: {},
};

interface PendingPayload {
  kind: EntityCacheKind;
  id: string;
}

interface SuccessPayload<T> {
  kind: EntityCacheKind;
  id: string;
  data: T;
}

interface FailurePayload {
  kind: EntityCacheKind;
  id: string;
  error: string;
}

const entityCacheSlice = createSlice({
  name: 'entityCache',
  initialState,
  reducers: {
    entityFetchPending(state, action: PayloadAction<PendingPayload>) {
      const { kind, id } = action.payload;
      const bucket = state[kind] as Record<string, EntityCacheEntry<unknown>>;
      const existing = bucket[id];
      bucket[id] = {
        data: existing?.data ?? null,
        loading: true,
        error: null,
      };
    },
    entityFetchSuccess(state, action: PayloadAction<SuccessPayload<unknown>>) {
      const { kind, id, data } = action.payload;
      const bucket = state[kind] as Record<string, EntityCacheEntry<unknown>>;
      bucket[id] = { data, loading: false, error: null };
    },
    entityFetchFailure(state, action: PayloadAction<FailurePayload>) {
      const { kind, id, error } = action.payload;
      const bucket = state[kind] as Record<string, EntityCacheEntry<unknown>>;
      bucket[id] = { data: bucket[id]?.data ?? null, loading: false, error };
    },
  },
});

export const { entityFetchPending, entityFetchSuccess, entityFetchFailure } =
  entityCacheSlice.actions;

export default entityCacheSlice.reducer;

import type { RootState } from '@/store';

const EMPTY_PRODUCT: EntityCacheEntry<ProductDetailsData> = {
  data: null,
  loading: false,
  error: null,
};
const EMPTY_ACQUIRER: EntityCacheEntry<AcquirerDetailsData> = {
  data: null,
  loading: false,
  error: null,
};
const EMPTY_MERCHANT: EntityCacheEntry<MerchantDetailsData> = {
  data: null,
  loading: false,
  error: null,
};

export const selectProductEntry = (id: string | null) => (state: RootState) =>
  id ? (state.entityCache.product[id] ?? EMPTY_PRODUCT) : EMPTY_PRODUCT;

export const selectAcquirerEntry = (id: string | null) => (state: RootState) =>
  id ? (state.entityCache.acquirer[id] ?? EMPTY_ACQUIRER) : EMPTY_ACQUIRER;

export const selectMerchantEntry = (id: string | null) => (state: RootState) =>
  id ? (state.entityCache.merchant[id] ?? EMPTY_MERCHANT) : EMPTY_MERCHANT;
