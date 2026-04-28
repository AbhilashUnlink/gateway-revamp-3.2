import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { TabGroup, TabPanel, TabPanels } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { useTransactionDetails } from '@/hooks/useTransactionDetails';
import { useChargebackHistory } from '@/hooks/useChargebackHistory';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';
import { DetailsHeader } from './components/DetailsHeader';
import { LifecycleTimeline } from './components/LifecycleTimeline';
import { PageTabsList } from './components/PageTabs';
import { PAGE_TABS } from './components/PageTabs.config';
import { ChargebackHistory } from './components/ChargebackHistory';
import { SubscriptionHistory } from './components/SubscriptionHistory';
import { TokenizationHistory } from './components/TokenizationHistory';
import { AuditLog } from './components/AuditLog';
import { InfoFilterPills, type InfoFilter } from './components/InfoFilterPills';
import { InfoSection } from './components/InfoSection';
import {
  buildLifecycleSummary,
  buildSections,
  type InfoSectionConfig,
} from './utils/buildSections';

const CAPTURABLE_EVENTS = ['AUTHORIZED'];
const REFUNDABLE_EVENTS = ['CAPTURED', 'PURCHASE', 'PURCHASED'];
const EDIT_STATUS_ELIGIBLE = [
  'PENDING',
  'INPROGRESS',
  'IN_PROGRESS',
  'REVIEW',
  'ERROR',
  'INCOMPLETE',
  'NOTSUCCESSFUL',
  'UNKNOWN',
  '',
];

interface ActionVisibility {
  showRefund: boolean;
  showCapture: boolean;
  showDispute: boolean;
  showEditStatus: boolean;
}

function parseStartingCycle(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

function deriveVisibility(data: TransactionDetailsData | null): ActionVisibility {
  if (!data)
    return { showRefund: false, showCapture: false, showDispute: false, showEditStatus: false };
  const event = (data.Event ?? '').toUpperCase();
  const status = (data.Status ?? '').toUpperCase();
  return {
    showRefund: REFUNDABLE_EVENTS.includes(event) && !data.IsBlockRefund,
    showCapture: CAPTURABLE_EVENTS.includes(event),
    showDispute: true,
    showEditStatus: EDIT_STATUS_ELIGIBLE.includes(status),
  };
}

function TransactionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { open } = useDrawerControl();
  const { data, loading, error } = useTransactionDetails(id ?? null);
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
    () => (data ? buildLifecycleSummary(data, t) : { lifecycleLabel: '—', balanceLabel: null }),
    [data, t]
  );

  const visibility = useMemo(() => deriveVisibility(data), [data]);

  if (loading) {
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

  const onAction = (type: 'refund' | 'capture' | 'dispute' | 'edit-status') =>
    open({ type, data: drawerData });

  const visibleSections = filter === 'all' ? sections : sections.filter((s) => s.id === filter);
  const layout = filter === 'all' ? 'column' : 'grid';

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col overflow-y-auto px-6 pb-6">
      <DetailsHeader
        transactionRefId={data.TransactionRefID}
        lifecycleLabel={lifecycle.lifecycleLabel}
        balanceLabel={lifecycle.balanceLabel}
        showEditStatus={visibility.showEditStatus}
        onEditStatus={() => onAction('edit-status')}
        onTransactionXray={() => navigate('/transaction-xray')}
      />

      <TabGroup
        as="div"
        className="mt-4 rounded-2xl border border-white bg-gradient-to-b from-[#ffeabe] from-[40%] to-white to-[41%] drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#ddcfb2] px-6 pt-3">
          <PageTabsList />
          <div className="flex items-center gap-3 pb-3">
            {visibility.showRefund && (
              <Button
                type="button"
                variant="ghost"
                className="h-12 px-4"
                onClick={() => onAction('refund')}
              >
                {t('drawer.refund')}
              </Button>
            )}
            {visibility.showCapture && (
              <Button
                type="button"
                variant="ghost"
                className="h-12 px-4"
                onClick={() => onAction('capture')}
              >
                {t('drawer.capture')}
              </Button>
            )}
            {visibility.showDispute && (
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
                <LifecycleTimeline items={data.TransactionHistory ?? []} />
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
                <TokenizationHistory items={data.TokenizedTransactionHistory ?? []} />
              )}
              {tab.id === 'audit-log' && <AuditLog items={data.TransactionLog ?? []} />}
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>

      <div className="mt-4 overflow-hidden rounded-2xl drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]">
        <InfoFilterPills active={filter} onChange={setFilter} />
        <div className="bg-white p-6">
          {filter === 'all' ? (
            <div className="flex items-start gap-6">
              {visibleSections.map((section) => (
                <InfoSection key={section.id} section={section} layout="column" />
              ))}
            </div>
          ) : (
            visibleSections.map((section) => (
              <InfoSection key={section.id} section={section} layout={layout} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailsPage;
