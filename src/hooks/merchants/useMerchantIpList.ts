import { useCallback, useEffect, useRef, useState } from 'react';
import { apiService } from '@/utils/apiService';
import type {
  MerchantIpApiRecord,
  MerchantIpListApiResponse,
  MerchantIpRow,
} from '@/types/merchant/merchantIpList.types';

const PAGE_SIZE = 10;
const TIME_ZONE = 'Asia/Calcutta';

interface UseMerchantIpListResult {
  rows: MerchantIpRow[];
  loading: boolean;
  hasMore: boolean;
  totalCount: number;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
}

function mapRecord(record: MerchantIpApiRecord): MerchantIpRow {
  return {
    id: String(record.ID),
    rawId: record.ID,
    merchantId: record.MerchantID,
    ipAddress: record.MerchantIP ?? '',
    status: record.Status ?? '',
    createdBy: record.CreatedBy ?? '',
    createdAt: record.CreatedAt ?? '',
    updatedBy: record.UpdatedBy ?? '',
    updatedAt: record.UpdatedAt ?? '',
    comments: record.Comments ?? '',
  };
}

export function useMerchantIpList(merchantId: string | null): UseMerchantIpListResult {
  const [rows, setRows] = useState<MerchantIpRow[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  const load = useCallback(
    async (pageNumber: number, replace: boolean) => {
      if (!merchantId) return;
      const myRequestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);
      try {
        const skip = (pageNumber - 1) * PAGE_SIZE;
        const res = await apiService.entities.getMerchantIpList({
          merchantId,
          take: PAGE_SIZE,
          skip,
          TimeZone: TIME_ZONE,
        });
        if (myRequestId !== requestIdRef.current) return;

        const body = res.data as MerchantIpListApiResponse;
        const records = body?.data?.records ?? [];
        const total = body?.data?.total_count ?? 0;
        const mapped = records.map(mapRecord);

        setRows((prev) => (replace ? mapped : [...prev, ...mapped]));
        setTotalCount(total);
        setHasMore(skip + records.length < total && records.length > 0);
        setPage(pageNumber + 1);
      } catch (e) {
        if (myRequestId !== requestIdRef.current) return;
        setError((e as Error).message ?? 'Failed to load merchant IPs');
        setHasMore(false);
      } finally {
        if (myRequestId === requestIdRef.current) setLoading(false);
      }
    },
    [merchantId]
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

  useEffect(() => {
    if (!merchantId) return;
    // Standard data-fetch-on-mount pattern; cascading setStates are intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId]);

  return { rows, loading, hasMore, totalCount, error, loadMore, refresh };
}
