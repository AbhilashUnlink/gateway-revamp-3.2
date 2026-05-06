import { useCallback, useEffect, useRef, useState } from 'react';
import { apiService } from '@/utils/apiService';
import type {
  MerchantApiRecord,
  MerchantListApiResponse,
  MerchantRow,
} from '@/types/merchant/merchantList.types';

const PAGE_SIZE = 10;
const TIME_ZONE = 'Asia/Calcutta';

interface UseMerchantListResult {
  rows: MerchantRow[];
  loading: boolean;
  hasMore: boolean;
  totalCount: number;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
}

function mapRecord(record: MerchantApiRecord): MerchantRow {
  return {
    id: record.MerchantID,
    merchantId: record.MerchantID,
    legalName: record.LegalName ?? '',
    legalNameInEnglish: record.LegalNameInEnglish ?? '',
    contactEmail: record.ContactEmail ?? '',
    createdAt: record.CreatedAt ?? '',
    country: record.Country ?? '',
    subsidiaryId: record.SubsidiaryID ?? '',
    productsCount: typeof record._count === 'number' ? record._count : 0,
    productNames: Array.isArray(record.Products)
      ? record.Products.map((p) => p.Name).filter(Boolean)
      : [],
    status: record.Status ?? '',
    partnerName: record.PartnerName ?? '',
    referredCode: record.ReferredCode ?? '',
  };
}

/**
 * Self-contained merchant list fetcher. Pages of size 10, append-on-loadMore.
 * The `filterQs` is the query string produced by `serializeForMerchants(rules)`
 * (e.g. `?Country=HK&Status=APPROVED`); it's keyed via JSON-stringify upstream
 * so re-fetches happen only when the filter values actually change.
 */
export function useMerchantList(filterQs: string): UseMerchantListResult {
  const [rows, setRows] = useState<MerchantRow[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Used to ignore stale responses when filters change mid-flight.
  const requestIdRef = useRef(0);

  const load = useCallback(
    async (pageNumber: number, replace: boolean) => {
      const myRequestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        const skip = (pageNumber - 1) * PAGE_SIZE;
        const res = await apiService.entities.getMerchantList({
          take: PAGE_SIZE,
          skip,
          TimeZone: TIME_ZONE,
          filterQs,
        });
        if (myRequestId !== requestIdRef.current) return;

        const body = res.data as MerchantListApiResponse;
        const records = body?.data?.records ?? [];
        const total = body?.data?.total_count ?? 0;
        const mapped = records.map(mapRecord);

        setRows((prev) => (replace ? mapped : [...prev, ...mapped]));
        setTotalCount(total);
        setHasMore(skip + records.length < total && records.length > 0);
        setPage(pageNumber + 1);
      } catch (e) {
        if (myRequestId !== requestIdRef.current) return;
        setError((e as Error).message ?? 'Failed to load merchants');
        setHasMore(false);
      } finally {
        if (myRequestId === requestIdRef.current) setLoading(false);
      }
    },
    [filterQs]
  );

  const refresh = useCallback(() => {
    setRows([]);
    setPage(1);
    setHasMore(true);
    void load(1, true);
  }, [load]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    void load(page, false);
  }, [loading, hasMore, page, load]);

  // Re-fetch from page 1 whenever the filter query string changes.
  useEffect(() => {
    // Standard data-fetch pattern; cascading setStates are intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterQs]);

  return { rows, loading, hasMore, totalCount, error, loadMore, refresh };
}
