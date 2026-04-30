import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Download, Columns } from 'lucide-react';
import type { TransactionRow, TableFilter } from '@/types/transactions/transaction.types';
import { DataTable } from '@/components/table';
import { useTableDataAdapter } from '@/components/table/hooks/useTableDataAdapter';
import { PageBar } from '@/components/page-bar';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openFilter, selectAppliedRules, makeSelectAppliedCount } from '@/store/slices/filterSlice';
import { FilterPopover, buildFilterFields, serializeForTransactions } from '@/components/filter';
import { DownloadPopover } from '@/components/transactions/DownloadPopover';
import { useColumnPreferences } from '@/hooks/useColumnPreferences';
import {
  buildTransactionColumns,
  transactionColumnIdToDisplayName,
} from './transactionTableSchema';
import { ColumnPreferencePopover } from '@/components/transactions/ColumnPreferencePopover';
import {
  fetchColumnPreferenceLists,
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
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const downloadButtonRef = useRef<HTMLButtonElement>(null);
  const columnsButtonRef = useRef<HTMLButtonElement>(null);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const userEmail = useAppSelector((s) => s.auth.signInData.email);

  const appliedRules = useAppSelector(selectAppliedRules(SCREEN));
  const appliedCount = useAppSelector(useMemo(() => makeSelectAppliedCount(SCREEN), []));

  const filters: TableFilter[] = useMemo(
    () => serializeForTransactions(appliedRules) as unknown as TableFilter[],
    [appliedRules]
  );

  const userCurrency = useAppSelector(selectUserCurrencyType);
  const { rows, loading, hasMore, stats, loadMore, refresh } = useTableDataAdapter(
    filters,
    userCurrency ?? undefined
  );
  const { open } = useDrawerControl();

  const handleRowClick = (row: TransactionRow) => {
    navigate(`/transactions/${row.transactionRefId}`);
  };

  // SINGLE source of truth for the fetch trigger: the serialized filter payload.
  // Keying on JSON.stringify(filters) ensures we re-fetch only when filter
  // values actually change — not on every render or callback identity churn.
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, userCurrency]);

  const columnConfigs = useMemo(
    () =>
      filterHiddenColumns(
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
        })
      ),
    [open]
  );

  const filterFields = useMemo(() => buildFilterFields(columnConfigs), [columnConfigs]);

  // Hydrate the saved column-preference lists once on mount.
  useEffect(() => {
    dispatch(fetchColumnPreferenceLists());
  }, [dispatch]);

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
  const columnPreferenceItems = useMemo(
    () =>
      columnConfigs.map((c) => ({
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
            ref={filterButtonRef}
            label={t('transactions_page.filters')}
            count={appliedCount}
            onClick={() => dispatch(openFilter(SCREEN))}
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
          <PageBar.ActionButton
            ref={downloadButtonRef}
            aria-label="Download"
            onClick={() => setDownloadOpen((o) => !o)}
          >
            <Download size={20} />
          </PageBar.ActionButton>
          <PageBar.ActionButton
            ref={columnsButtonRef}
            aria-label="Column preferences"
            onClick={() => setColumnsOpen((o) => !o)}
          >
            <Columns size={20} />
          </PageBar.ActionButton>
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

      <FilterPopover screen={SCREEN} fields={filterFields} anchorRef={filterButtonRef} />
      <DownloadPopover
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        anchorRef={downloadButtonRef}
        filters={filters}
        defaultEmail={userEmail}
      />
      <ColumnPreferencePopover
        open={columnsOpen}
        onClose={() => setColumnsOpen(false)}
        anchorRef={columnsButtonRef}
        screen={SCREEN}
        columns={columnPreferenceItems}
      />
    </div>
  );
}

export default TransactionsPage;
