import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RefreshButtonIcon, DownloadButtonIcon } from '@/assets/icons/action-buttons';
import { DataTable } from '@/components/table';
import { PageBar } from '@/components/page-bar';
import DasPopover from '@/components/ui/das-popover';
import { DasPopoverHeader } from '@/components/ui/das-popover-header';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { useAppSelector } from '@/store/hooks';
import { selectAppliedRules } from '@/store/slices/filterSlice';
import { FilterPopover, buildFilterFields, serializeForMerchants } from '@/components/filter';
import { useMerchantList } from '@/hooks/merchants/useMerchantList';
import type { MerchantRow } from '@/types/merchant/merchantList.types';
import { buildMerchantColumns } from './merchantTableSchema';

const SCREEN = 'merchants' as const;

function MerchantListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const appliedRules = useAppSelector(selectAppliedRules(SCREEN));
  const filterQs = useMemo(() => serializeForMerchants(appliedRules), [appliedRules]);

  const { rows, loading, hasMore, totalCount, loadMore, refresh } = useMerchantList(filterQs);
  const { open } = useDrawerControl();

  const handleRowClick = (row: MerchantRow) => {
    open({
      type: 'merchant',
      data: { transactionRefId: row.merchantId, merchantId: row.merchantId },
    });
  };

  const columnConfigs = useMemo(
    () =>
      buildMerchantColumns({
        onMerchantAccountClick: (row) =>
          navigate(`/accounts/merchants/merchant-details/${row.merchantId}`),
      }),
    [navigate]
  );

  const filterFields = useMemo(() => buildFilterFields(columnConfigs), [columnConfigs]);

  return (
    <div className="px-6 pb-6 h-[calc(100vh-80px)] flex flex-col">
      <PageBar>
        <PageBar.Title>{t('merchants_page.title')}</PageBar.Title>

        <PageBar.Actions>
          <PageBar.StatsPill>
            <PageBar.StatItem
              label={t('merchants_page.total_merchants')}
              value={totalCount ? String(totalCount) : '—'}
            />
          </PageBar.StatsPill>
          <FilterPopover screen={SCREEN} fields={filterFields} />
        </PageBar.Actions>

        <PageBar.Actions gap="md">
          <PageBar.ActionButton
            className={loading ? 'disabled' : ''}
            aria-label={t('merchants_page.refresh')}
            onClick={refresh}
          >
            <RefreshButtonIcon className={loading ? 'disabled animate-spin' : ''} />
          </PageBar.ActionButton>

          <DasPopover>
            <DasPopover.Trigger as={PageBar.ActionButton} aria-label={t('merchants_page.download')}>
              <DownloadButtonIcon />
            </DasPopover.Trigger>
            <DasPopover.Content
              align="right"
              className="z-[60] mt-2 w-[420px] rounded-2xl border-0 bg-white drop-shadow-[0px_4px_10px_rgba(0,0,0,0.2)]"
            >
              {({ close }) => (
                <>
                  <DasPopoverHeader
                    icon="download"
                    title={t('download.title')}
                    onClose={close}
                    closeAriaLabel={t('download.close')}
                  />
                  <div className="p-6 text-sm text-[#808080]">
                    {t('merchants_page.download_coming_soon')}
                  </div>
                </>
              )}
            </DasPopover.Content>
          </DasPopover>
        </PageBar.Actions>
      </PageBar>

      <DataTable<MerchantRow>
        columnConfigs={columnConfigs}
        data={rows}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onRowClick={handleRowClick}
        className="flex-1 mt-4 pr-2"
      />
    </div>
  );
}

export default MerchantListPage;
