import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { TransactionRow, TableFilter } from '@/types/transactions/transaction.types';
import { RefreshButtonIcon } from '@/assets/icons/action-buttons';
import { DataTable } from '@/components/table';
import { useTableDataAdapter } from '@/components/table/hooks/useTableDataAdapter';
import { PageBar } from '@/components/page-bar';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAppliedRules } from '@/store/slices/filterSlice';
import { FilterPopover, buildFilterFields, serializeForTransactions } from '@/components/filter';
import { DownloadPopover } from '@/components/transactions/download-popover';
import { useColumnPreferences } from '@/hooks/transactions/useColumnPreferences';
import {
  buildTransactionColumns,
  transactionColumnIdToDisplayName,
} from './transactionTableSchema';
import { ColumnPreferencePopover } from '@/components/transactions/column-preference-popover';
import {
  selectActiveColumnPreferenceList,
  setColumnPreference,
  resetColumnPreference,
} from '@/store/slices/columnPreferencesSlice';
import { selectUserCurrencyType } from '@/store/slices/gatewayConfigSlice';
import {
  filterHiddenColumns,
  getColumnsConfigFromColumnsJson,
} from '@/utils/transactionColumnsConfig';

const SCREEN = 'transactions' as const;

function TransactionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userEmail = useAppSelector((s) => s.auth.signInData.email);

  const appliedRules = useAppSelector(selectAppliedRules(SCREEN));

  const filters: TableFilter[] = useMemo(
    () => serializeForTransactions(appliedRules) as unknown as TableFilter[],
    [appliedRules]
  );

  const userCurrency = useAppSelector(selectUserCurrencyType);
  const refreshCount = useAppSelector((s) => s.transactions.refreshCount);
  const { rows, loading, hasMore, stats, loadMore, refresh } = useTableDataAdapter(
    filters,
    userCurrency ?? undefined
  );
  const { open } = useDrawerControl();

  // Whole-row click â†’ open the details drawer.
  // The Transaction Ref ID link inside the row navigates to the full page.
  const handleRowClick = (row: TransactionRow) => {
    open({
      type: 'details',
      data: {
        transactionRefId: row.transactionRefId,
        transactionId: row.transactionId,
        originalAmount: row.amount,
        remainingAmount: row.amount,
        currency: row.currency,
      },
    });
  };

  // SINGLE source of truth for the fetch trigger: the serialized filter payload.
  // Keying on JSON.stringify(filters) ensures we re-fetch only when filter
  // values actually change â€” not on every render or callback identity churn.
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    // Wait for the user's stats currency preference to hydrate before firing
    // the list request. This avoids a duplicate call: one with a hardcoded
    // fallback, then another once the preference loads.
    if (!userCurrency) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, userCurrency, refreshCount]);

  // Full schema â€” picker-hidden columns are kept here so they always render.
  // The popover's column list filters them out separately.
  const columnConfigs = useMemo(
    () =>
      buildTransactionColumns({
        onRefIdClick: (row) => navigate(`/transactions/${row.transactionRefId}`),
      }),
    [navigate]
  );

  const filterFields = useMemo(() => buildFilterFields(columnConfigs), [columnConfigs]);

  // Sync the active backend list's `columns_json` into the local visibility /
  // order slice so the table reflects it on load and whenever the
  // backend-confirmed selection changes.
  const activeColumnPreferenceList = useAppSelector(selectActiveColumnPreferenceList);
  const fallbackColumnIds = useMemo(() => columnConfigs.map((c) => c.id), [columnConfigs]);
  useEffect(() => {
    if (!activeColumnPreferenceList) {
      dispatch(resetColumnPreference(SCREEN));
      return;
    }
    const { orderedColumns, hiddenColumns } = getColumnsConfigFromColumnsJson(
      activeColumnPreferenceList.columns_json,
      fallbackColumnIds
    );
    dispatch(
      setColumnPreference({
        screen: SCREEN,
        preference: { order: orderedColumns, hidden: hiddenColumns },
      })
    );
  }, [dispatch, activeColumnPreferenceList, fallbackColumnIds]);

  // Apply user's saved column-preference (visibility + order) on top of defaults.
  const visibleColumnConfigs = useColumnPreferences(SCREEN, columnConfigs);

  // Drawer items: id + backend display name + i18n label key.
  // Picker-hidden columns (HIDDEN_FIELDS) are stripped here so they don't
  // surface as toggleable rows in the column-preference popover.
  const columnPreferenceItems = useMemo(
    () =>
      filterHiddenColumns(columnConfigs).map((c) => ({
        id: c.id,
        displayName: transactionColumnIdToDisplayName(c.id),
        labelKey: c.headerPrimaryKey,
      })),
    [columnConfigs]
  );

  return (
    <div className="px-6 pb-6 h-[calc(100vh-80px)] flex flex-col">
      <PageBar>
        <PageBar.Title>{t('transactions_page.title')}</PageBar.Title>

        <PageBar.Actions>
          <PageBar.StatsPill>
            <PageBar.StatItem
              label={t('transactions_page.total_count')}
              value={stats.totalCount || 'â€”'}
            />
            <div className="h-6 w-0.5 bg-gray-200" />
            {/* <PageBar.StatItem
              label={t('transactions_page.total_amount')}
              value={stats.totalAmount || 'â€”'}
              currencyPrefix={stats.currency || undefined}
            />  <div className="h-6 w-0.5 bg-gray-200" /> */}
            <PageBar.StatItem
              label={t('transactions_page.total_sales')}
              value={stats.totalSales || 'â€”'}
              currencyPrefix={stats.currency || undefined}
            />
            <div className="h-6 w-0.5 bg-gray-200" />
            <PageBar.StatItem
              label={t('transactions_page.total_refund')}
              value={stats.totalRefund || 'â€”'}
              currencyPrefix={stats.currency || undefined}
            />
            <div className="h-6 w-0.5 bg-gray-200" />
            <PageBar.StatItem
              label={t('transactions_page.approval_ratio')}
              value={stats.approvalRatio ? `${stats.approvalRatio} %` : 'â€”'}
            />
          </PageBar.StatsPill>
          <FilterPopover screen={SCREEN} fields={filterFields} />
        </PageBar.Actions>

        <PageBar.Actions gap="md">
          <PageBar.ActionButton
            className={loading ? 'disabled' : ''}
            aria-label="Refresh"
            onClick={refresh}
          >
            <RefreshButtonIcon className={loading ? 'disabled animate-spin' : ''} />
          </PageBar.ActionButton>
          <DownloadPopover
            filters={filters}
            defaultEmail={userEmail}
            totalCount={stats.totalCount}
            appliedRules={appliedRules}
            fields={filterFields}
          />
          <ColumnPreferencePopover screen={SCREEN} columns={columnPreferenceItems} />
        </PageBar.Actions>
      </PageBar>

      <DataTable
        columnConfigs={visibleColumnConfigs}
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
