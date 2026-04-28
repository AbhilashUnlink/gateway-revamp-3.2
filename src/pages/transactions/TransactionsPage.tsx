import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Download, Columns } from 'lucide-react';
import type { ColumnConfig } from '@/types/transactions/transaction.types';
import { DataTable } from '@/components/table';
import { useTableDataAdapter } from '@/components/table/hooks/useTableDataAdapter';
import { PageBar } from '@/components/page-bar';
import { useDrawerControl } from '@/hooks/useDrawerControl';

function TransactionsPage() {
  const { t } = useTranslation();
  const { rows, loading, hasMore, stats, loadMore, refresh } = useTableDataAdapter();
  const { open } = useDrawerControl();
  useEffect(() => {
    refresh();
  }, []);

  const columnConfigs: ColumnConfig[] = useMemo(
    () => [
      {
        id: 'transactionRefId',
        headerPrimaryKey: 'table.transaction_ref_id',
        headerSecondaryKey: 'table.transaction_id',
        cellType: 'link-copy',
        width: 256,
        accessorFn: (row) => ({ primary: row.transactionRefId, secondary: row.transactionId }),
        onPrimaryClick: (row) =>
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
      },
      {
        id: 'typeStatus',
        headerPrimaryKey: 'table.transaction_type',
        headerSecondaryKey: 'table.status',
        cellType: 'status',
        width: 190,
        accessorFn: (row) => ({
          primary: row.transactionType,
          status: row.status,
          secondary: row.status,
        }),
      },
      {
        id: 'amountFee',
        headerPrimaryKey: 'table.amount',
        headerSecondaryKey: 'table.fee',
        cellType: 'multi',
        width: 160,
        accessorFn: (row) => ({
          primary: row.currency ? `${row.currency} ${row.amount}` : row.amount,
          secondary: row.currency ? `${row.currency} ${row.fee}` : row.fee,
        }),
      },
      {
        id: 'dates',
        headerPrimaryKey: 'table.transaction_date',
        headerSecondaryKey: 'table.update_date',
        cellType: 'date',
        width: 240,
        accessorFn: (row) => ({ primary: row.transactionDate, secondary: row.updateDate }),
      },
      {
        id: 'paymentMethod',
        headerPrimaryKey: 'table.payment_type',
        headerSecondaryKey: 'table.scheme_card_number',
        cellType: 'payment',
        width: 200,
        accessorFn: (row) => ({
          scheme: row.paymentScheme,
          secondary: row.paymentType,
          primary: row.cardNumber,
        }),
      },
      {
        id: 'trackId',
        headerPrimaryKey: 'table.track_id',
        cellType: 'copy',
        width: 202,
        accessorFn: (row) => ({ primary: row.trackId }),
      },
      {
        id: 'statementId',
        headerPrimaryKey: 'table.statement_id',
        cellType: 'action',
        width: 208,
        accessorFn: (row) => ({ primary: row.statementId, downloadable: true }),
      },
      {
        id: 'acquirer',
        headerPrimaryKey: 'table.acquirer',
        cellType: 'text',
        width: 180,
        accessorFn: (row) => ({ primary: row.acquirer }),
      },
      {
        id: 'acquirerMid',
        headerPrimaryKey: 'table.acquirer_mid',
        cellType: 'copy',
        width: 188,
        accessorFn: (row) => ({ primary: row.acquirerMid }),
      },
      {
        id: 'dasMid',
        headerPrimaryKey: 'table.das_mid',
        cellType: 'text',
        width: 140,
        accessorFn: (row) => ({ primary: row.dasMid }),
      },
      {
        id: 'authCode',
        headerPrimaryKey: 'table.auth_code',
        cellType: 'text',
        width: 148,
        accessorFn: (row) => ({ primary: row.authCode }),
      },
      {
        id: 'productType',
        headerPrimaryKey: 'table.product_type',
        cellType: 'text',
        width: 152,
        accessorFn: (row) => ({ primary: row.productType }),
      },
      {
        id: 'integrationMethod',
        headerPrimaryKey: 'table.integration_method',
        cellType: 'text',
        width: 200,
        accessorFn: (row) => ({ primary: row.integrationMethod }),
      },
      {
        id: 'integrationType',
        headerPrimaryKey: 'table.integration_type',
        cellType: 'text',
        width: 200,
        accessorFn: (row) => ({ primary: row.integrationType }),
      },
      {
        id: 'merchantAccount',
        headerPrimaryKey: 'table.merchant_account',
        cellType: 'text',
        width: 195,
        accessorFn: (row) => ({ primary: row.merchantAccount }),
      },
      {
        id: 'merchantAccountEn',
        headerPrimaryKey: 'table.merchant_account_en',
        cellType: 'text',
        width: 265,
        accessorFn: (row) => ({ primary: row.merchantAccountEn }),
      },
      {
        id: 'merchantRefId',
        headerPrimaryKey: 'table.merchant_ref_id',
        cellType: 'copy',
        width: 172,
        accessorFn: (row) => ({ primary: row.merchantRefId }),
      },
      {
        id: 'subscriptionId',
        headerPrimaryKey: 'table.subscription_id',
        cellType: 'text',
        width: 208,
        accessorFn: (row) => ({ primary: row.subscriptionId }),
      },
      {
        id: 'terminalId',
        headerPrimaryKey: 'table.terminal_id',
        cellType: 'copy',
        width: 160,
        accessorFn: (row) => ({ primary: row.terminalId }),
      },
      {
        id: 'terminalName',
        headerPrimaryKey: 'table.terminal_name',
        cellType: 'text',
        width: 165,
        accessorFn: (row) => ({ primary: row.terminalName }),
      },
      {
        id: 'linkName',
        headerPrimaryKey: 'table.link_name',
        cellType: 'text',
        width: 160,
        accessorFn: (row) => ({ primary: row.linkName }),
      },
    ],
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
        className="flex-1 mt-4"
      />
    </div>
  );
}

export default TransactionsPage;
