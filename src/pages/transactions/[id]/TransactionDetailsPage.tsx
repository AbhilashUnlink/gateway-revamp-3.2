import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { TabGroup, TabPanel, TabPanels } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { useChargebackHistory } from '@/hooks/transactions/useChargebackHistory';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { useTransactionActions } from '@/hooks/transactions/useTransactionActions';
import { useAppDispatch } from '@/store/hooks';
import { fetchTransactionDetails } from '@/store/thunks/transactionDetailsThunks';
import { DetailsHeader } from './components/DetailsHeader';
import { TransactionLifecycle } from '@/components/transactions/TransactionLifecycle';
import { PageTabsList } from './components/PageTabs';
import { PAGE_TABS } from './components/PageTabs.config';
import { ChargebackHistory } from './components/history/ChargebackHistory';
import { SubscriptionHistory } from './components/history/SubscriptionHistory';
import { TokenizationHistory } from './components/history/TokenizationHistory';
import { AuditLog } from './components/history/AuditLog';
import { InfoFilterPills } from './components/InfoFilterPills';
import { InfoSection, InfoSectionBody, InfoSectionHeader } from './components/InfoSection';
import { buildLifecycleSummary, buildSections } from './utils/buildSections';
import type { InfoFilter, InfoSectionConfig } from './types';
import { parseStartingCycle } from './utils/parseStartingCycle';

function TransactionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { open } = useDrawerControl();
  const dispatch = useAppDispatch();
  const { data, loading, error, showRefund, showCapture, showVoid, showDispute, showEditStatus } =
    useTransactionActions();

  useEffect(() => {
    if (!id) return;
    void dispatch(fetchTransactionDetails({ id }));
  }, [id, dispatch]);

  const {
    cases: chargebackCases,
    loading: chargebackLoading,
    error: chargebackError,
  } = useChargebackHistory(id ?? null);
  const [filter, setFilter] = useState<InfoFilter>('all');

  const sections = useMemo<InfoSectionConfig[]>(
    () => (data ? buildSections(data, t) : []),
    [data, t]
  );

  const lifecycle = useMemo(
    () => (data ? buildLifecycleSummary(data, t) : { lifecycleLabel: 'â€”', balanceLabel: null }),
    [data, t]
  );

  if (loading && !data) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center gap-2 text-sm text-[#808080]">
        <Loader2 size={16} className="animate-spin" />
        {t('transaction_details.loading')}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center text-sm text-[#ff4343]">
        {error ?? t('transaction_details.error')}
      </div>
    );
  }

  const drawerData = {
    transactionRefId: data.TransactionRefID,
    transactionId: String(data.TransactionID),
    originalAmount: data.Amount,
    remainingAmount: data.Amount,
    currency: data.CurrencyCode,
  };

  const onAction = (type: 'refund' | 'capture' | 'void' | 'dispute' | 'edit-status') =>
    open({ type, data: drawerData });

  const visibleSections = filter === 'all' ? sections : sections.filter((s) => s.id === filter);
  const layout = filter === 'all' ? 'column' : 'grid';

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col overflow-hidden px-6 pb-6">
      <DetailsHeader
        transactionRefId={data.TransactionRefID}
        lifecycleLabel={lifecycle.lifecycleLabel}
        balanceLabel={lifecycle.balanceLabel}
        showEditStatus={showEditStatus}
        onEditStatus={() => onAction('edit-status')}
      />

      <TabGroup
        as="div"
        className="mt-4 rounded-2xl border border-white bg-gradient-to-b from-[#ffeabe] from-[40%] to-white to-[41%] drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#ddcfb2] px-6 pt-3">
          <PageTabsList />
          <div className="flex items-center gap-3 pb-3">
            {showRefund && (
              <Button
                type="button"
                variant="ghost"
                className="h-12 px-4"
                onClick={() => onAction('refund')}
              >
                {t('drawer.refund')}
              </Button>
            )}
            {showVoid && (
              <Button
                type="button"
                variant="ghost"
                className="h-12 px-4"
                onClick={() => onAction('void')}
              >
                {t('drawer.void')}
              </Button>
            )}
            {showCapture && (
              <Button
                type="button"
                variant="ghost"
                className="h-12 px-4"
                onClick={() => onAction('capture')}
              >
                {t('drawer.capture')}
              </Button>
            )}
            {showDispute && (
              <Button
                type="button"
                variant="ghost"
                className="h-12 px-4"
                onClick={() => onAction('dispute')}
              >
                {t('drawer.dispute')}
              </Button>
            )}
          </div>
        </div>

        <TabPanels>
          {PAGE_TABS.map((tab) => (
            <TabPanel key={tab.id} className="px-6 py-6">
              {tab.id === 'transaction-history' && (
                <TransactionLifecycle
                  orientation="horizontal"
                  items={data.TransactionHistory ?? []}
                  activeUuid={id ?? ''}
                  loading={loading}
                />
              )}
              {tab.id === 'chargeback-history' && (
                <ChargebackHistory
                  cases={chargebackCases}
                  loading={chargebackLoading}
                  error={chargebackError}
                />
              )}
              {tab.id === 'subscription-history' && (
                <SubscriptionHistory
                  items={data.TransactionHistory ?? []}
                  startingCycle={parseStartingCycle(data.SubscriptionDetails?.CycleBilled)}
                />
              )}
              {tab.id === 'tokenization-history' && (
                <TokenizationHistory
                  items={data.TokenizedTransactionHistory ?? []}
                  activeUuid={id ?? ''}
                />
              )}
              {tab.id === 'audit-log' && <AuditLog items={data.TransactionLog ?? []} />}
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>

      <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]">
        <InfoFilterPills active={filter} onChange={setFilter} />
        <div className="min-h-0 flex-1 overflow-y-auto bg-white px-6 pb-6">
          {filter === 'all' ? (
            <>
              <div className="sticky top-0 z-10 flex items-end gap-6 bg-white pt-6">
                {visibleSections.map((section) => (
                  <InfoSectionHeader key={`h-${section.id}`} section={section} />
                ))}
              </div>
              <div className="mt-4 flex items-start gap-6">
                {visibleSections.map((section) => (
                  <InfoSectionBody
                    key={`b-${section.id}`}
                    section={section}
                    layout="column"
                    loading={loading}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="pt-6">
              {visibleSections.map((section) => (
                <InfoSection key={section.id} section={section} layout={layout} loading={loading} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailsPage;
