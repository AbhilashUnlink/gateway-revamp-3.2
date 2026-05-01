import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useChargebackHistory } from '@/hooks/useChargebackHistory';
import { useTransactionActions } from '@/hooks/useTransactionActions';
import { useAppDispatch } from '@/store/hooks';
import { fetchTransactionDetails } from '@/store/thunks/transactionDetailsThunks';
import { buildLifecycleSummary, buildSections } from '../utils/buildSections';
import type { InfoSectionConfig, LifecycleSummary } from '../types';

const EMPTY_LIFECYCLE: LifecycleSummary = { lifecycleLabel: '—', balanceLabel: null };

export function useTransactionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const txActions = useTransactionActions();
  const { data, loading, error } = txActions;

  useEffect(() => {
    if (!id) return;
    void dispatch(fetchTransactionDetails({ id }));
  }, [id, dispatch]);

  const chargeback = useChargebackHistory(id ?? null);

  const sections = useMemo<InfoSectionConfig[]>(
    () => (data ? buildSections(data, t) : []),
    [data, t]
  );

  const lifecycle = useMemo<LifecycleSummary>(
    () => (data ? buildLifecycleSummary(data, t) : EMPTY_LIFECYCLE),
    [data, t]
  );

  return {
    id,
    data,
    loading,
    error,
    actions: txActions,
    sections,
    lifecycle,
    chargeback,
  };
}
