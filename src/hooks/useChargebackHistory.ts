import { useEffect, useState } from 'react';
import { apiService } from '@/utils';
import type {
  ChargebackCase,
  ChargebackHistoryResponse,
  ChargebackStageGroup,
  ChargebackStatusEntry,
} from '@/types/transactions/chargeback.types';

const CLOSED_STATUSES = new Set(['CASECLOSED', 'LOSTFUND', 'CLOSED', 'WONFUND']);

const STAGE_LABELS: Record<string, string> = {
  FirstChargeback: 'First Chargeback',
  SecondChargeback: 'Second Chargeback',
  AutoRepresentment: 'Auto Representment',
  PreArbitration: 'Pre-Arbitration',
  Arbitration: 'Arbitration',
};

function humanizeStage(key: string): string {
  if (STAGE_LABELS[key]) return STAGE_LABELS[key];
  return key.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function deriveStatusTone(status: string): 'open' | 'closed' {
  return CLOSED_STATUSES.has(status.toUpperCase()) ? 'closed' : 'open';
}

function flattenCases(group: ChargebackStageGroup): ChargebackCase[] {
  const cases: ChargebackCase[] = [];

  for (const [stageKey, entries] of Object.entries(group)) {
    if (!Array.isArray(entries) || entries.length === 0) continue;

    const sorted = [...entries].sort(
      (a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
    );
    const latest = sorted[0];
    const oldest = sorted[sorted.length - 1];
    const tone = deriveStatusTone(latest.Status);

    cases.push({
      stageKey,
      stageLabel: humanizeStage(stageKey),
      caseId: latest.ChargeBackId,
      amount: latest.Amount,
      currency: latest.Currency,
      issuedAt: oldest.CreatedAt,
      arn: null,
      reasonDescription: pickReason(sorted),
      statusTone: tone,
      statusLabel: tone === 'closed' ? 'Closed' : 'Open',
      rawLatestStatus: latest.Status,
    });
  }

  return cases;
}

function pickReason(entries: ChargebackStatusEntry[]): string | null {
  const withComment = entries.find((e) => e.Comment && e.Comment.trim().length > 0);
  return withComment?.Comment ?? null;
}

export function useChargebackHistory(transactionId: string | null) {
  const [cases, setCases] = useState<ChargebackCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transactionId) return;
    let cancelled = false;

    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await apiService.transactions.getChargebackByTransactionId({ transactionId });
        if (cancelled) return;
        const response = res as { data: ChargebackHistoryResponse };
        const groups = response.data?.data ?? [];
        const all = groups.flatMap(flattenCases);
        setCases(all);
      } catch {
        if (!cancelled) setError('Failed to load chargeback history');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [transactionId]);

  return { cases, loading, error };
}
