import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Download, Columns } from 'lucide-react';
import type { TransactionRow } from '@/types/transactions/transaction.types';
import { DataTable } from '@/components/table';
import { useTableDataAdapter } from '@/components/table/hooks/useTableDataAdapter';
import { PageBar } from '@/components/page-bar';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { buildTransactionColumns } from './transactionTableSchema';

function TransactionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { rows, loading, hasMore, stats, loadMore, refresh } = useTableDataAdapter();
  const { open } = useDrawerControl();

  const handleRowClick = (row: TransactionRow) => {
    navigate(`/transactions/${row.transactionRefId}`);
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  const columnConfigs = useMemo(
    () =>
      buildTransactionColumns({
        onRefIdClick: (row) =>
          open({
            type: 'details',
            data: {
              transactionRefId: row.transactionRefId,
              transactionId: row.transactionId,
              originalAmount: row.amount,
              remainingAmount: row.amount,
              currency: row.currency,
            },
          }),
      }),
    [open]
  );

  return (
    <div className="px-6 pb-6 h-[calc(100vh-80px)] flex flex-col">
      <PageBar>
        <PageBar.Title>{t('transactions_page.title')}</PageBar.Title>

        <PageBar.Actions>
          <PageBar.StatsPill>
            <PageBar.StatItem
              label={t('transactions_page.total_sales')}
              value={stats.totalSales || '—'}
              currencyPrefix={stats.currency || undefined}
            />
            <div className="h-6 w-0.5 bg-gray-200" />
            <PageBar.StatItem
              label={t('transactions_page.total_refund')}
              value={stats.totalRefund || '—'}
              currencyPrefix={stats.currency || undefined}
            />
            <div className="h-6 w-0.5 bg-gray-200" />
            <PageBar.StatItem
              label={t('transactions_page.approval_ratio')}
              value={stats.approvalRatio || '—'}
            />
          </PageBar.StatsPill>
          <PageBar.FilterButton
            label={t('transactions_page.filters')}
            count={0}
            onClick={() => {}}
          />
        </PageBar.Actions>

        <PageBar.Actions gap="md">
          <PageBar.ActionButton
            className={loading ? 'disabled' : ''}
            aria-label="Refresh"
            onClick={refresh}
          >
            <RotateCcw className={loading ? 'disabled animate-spin' : ''} size={18} />
          </PageBar.ActionButton>
          <PageBar.ActionButton aria-label="Download" onClick={() => {}}>
            <Download size={20} />
          </PageBar.ActionButton>
          <PageBar.ActionButton aria-label="Column preferences" onClick={() => {}}>
            <Columns size={20} />
          </PageBar.ActionButton>
        </PageBar.Actions>
      </PageBar>

      <DataTable
        columnConfigs={columnConfigs}
        data={rows}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onRowClick={handleRowClick}
        className="flex-1 mt-4"
      />
    </div>
  );
}

export default TransactionsPage;
