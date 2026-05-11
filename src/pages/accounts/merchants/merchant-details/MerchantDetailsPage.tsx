import { useCallback, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DasSpinner } from '@/components/ui/das-spinner';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import { useMerchantDetails } from '@/hooks/transactions/useMerchantDetails';
import { useMerchantUserList } from '@/hooks/merchants/useMerchantUserList';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { MerchantDetailsHeader } from './components/MerchantDetailsHeader';
import { MerchantTabsList } from './components/MerchantTabsList';
import { MerchantInfoFilterPills } from './components/MerchantInfoFilterPills';
import { BusinessDetailsSection, ContactDetailsSection } from './components/MerchantInfoSections';
import { ProductInformationTab } from './components/ProductInformationTab';
import { UserManagementTab } from './components/UserManagementTab';
import {
  MERCHANT_DETAIL_TABS,
  type MerchantInfoFilter,
  type MerchantTabId,
} from './merchantDetailsConfig';
import { MERCHANT_SETTINGS, DEFAULT_SETTING_ID } from './settings/merchantSettingsConfig';

const TAB_QUERY_KEY = 'tab';
const DEFAULT_TAB_ID: MerchantTabId = 'merchant-information';
const VALID_TAB_IDS = new Set<MerchantTabId>(MERCHANT_DETAIL_TABS.map((t) => t.id));

function isMerchantTabId(value: string | null): value is MerchantTabId {
  return !!value && VALID_TAB_IDS.has(value as MerchantTabId);
}

function MerchantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data, loading, error } = useMerchantDetails(id ?? null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [infoFilter, setInfoFilter] = useState<MerchantInfoFilter>('all');
  const [activeSettingId, setActiveSettingId] = useState<string>(DEFAULT_SETTING_ID ?? '');
  const { open: openDrawer } = useDrawerControl();

  const urlTab = searchParams.get(TAB_QUERY_KEY);
  const activeTabId: MerchantTabId = isMerchantTabId(urlTab) ? urlTab : DEFAULT_TAB_ID;

  const setActiveTabId = useCallback(
    (next: MerchantTabId) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next === DEFAULT_TAB_ID) params.delete(TAB_QUERY_KEY);
          else params.set(TAB_QUERY_KEY, next);
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const merchantId = data?.MerchantID || id || '';
  const userList = useMerchantUserList(merchantId || null);

  const dasmidOptions = useMemo(() => {
    const products = data?.Products ?? [];
    const seen = new Set<string>();
    const opts: { value: string; label: string }[] = [];
    for (const p of products) {
      if (!p.DASMID || seen.has(p.DASMID)) continue;
      seen.add(p.DASMID);
      opts.push({
        value: p.DASMID,
        label: p.Name ? `${p.DASMID} — ${p.Name}` : p.DASMID,
      });
    }
    return opts;
  }, [data?.Products]);

  if (loading && !data) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center gap-2 text-sm text-[#808080]">
        <DasSpinner />
        {t('merchant_details_page.loading')}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center text-sm text-[#ff4343]">
        {error ?? t('merchant_details_page.error')}
      </div>
    );
  }

  const showBusiness = infoFilter === 'all' || infoFilter === 'business-details';
  const showContact = infoFilter === 'all' || infoFilter === 'contact-details';
  const sectionLayout = infoFilter === 'all' ? 'split' : 'single';
  const onUserManagementTab = activeTabId === 'user-management';

  const openAddUser = () =>
    openDrawer({
      type: 'merchant-user-form',
      data: {
        transactionRefId: `add@@@${merchantId}`,
        mode: 'add',
        merchantId,
        dasmidOptions,
        onMutationSuccess: userList.refresh,
      },
    });

  const ActiveSettingComponent =
    MERCHANT_SETTINGS.find((s) => s.id === activeSettingId)?.component ?? null;

  let pill: { label: string; value: number | string } | null = null;
  if (activeTabId === 'product-information') {
    pill = {
      label: t('merchant_details_page.total_products'),
      value: (data.Products ?? []).length,
    };
  } else if (activeTabId === 'user-management') {
    pill = {
      label: t('merchant_details_page.total_users'),
      value: userList.totalCount || 0,
    };
  } else if (activeTabId === 'merchant-settings') {
    pill = {
      label: t('merchant_settings.summary'),
      value: '',
    };
  }

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col overflow-hidden px-6 pb-6">
      <MerchantDetailsHeader
        legalName={data.LegalName || data.LegalNameInEnglish || ''}
        merchantId={merchantId}
        liveKey={data.SecretKey}
        testKey={data.SecretKeyTest}
        pill={pill}
      />

      <div className="mt-4 rounded-2xl border border-white bg-gradient-to-b from-[#ffeabe] from-[40%] to-white to-[41%] drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-4 border-b border-[#ddcfb2] px-6 pt-3">
          <MerchantTabsList
            activeTabId={activeTabId}
            onTabChange={setActiveTabId}
            activeSettingId={activeSettingId}
            onSettingChange={setActiveSettingId}
          />
          <div className="flex items-center gap-3 pb-3">
            {onUserManagementTab && (
              <Button
                type="button"
                variant="ghost"
                onClick={openAddUser}
                className="h-10 gap-2 rounded-2xl px-4 text-xs font-semibold uppercase tracking-wide drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]"
              >
                <DasIcon name="plus" size={16} />
                {t('merchant_user_table.add_new_user')}
              </Button>
            )}
          </div>
        </div>

        <div className="px-0 py-0">
          {activeTabId === 'merchant-information' && (
            <div className="flex min-h-0 flex-col">
              <MerchantInfoFilterPills active={infoFilter} onChange={setInfoFilter} />
              {sectionLayout === 'split' ? (
                <div className="grid grid-cols-1 gap-8 bg-white px-6 py-6 lg:grid-cols-2">
                  {showBusiness && <BusinessDetailsSection data={data} layout="split" />}
                  {showContact && <ContactDetailsSection data={data} layout="split" />}
                </div>
              ) : (
                <div className="flex flex-col gap-6 bg-white px-6 py-6">
                  {showBusiness && <BusinessDetailsSection data={data} layout="single" />}
                  {showContact && <ContactDetailsSection data={data} layout="single" />}
                </div>
              )}
            </div>
          )}
          {activeTabId === 'product-information' && (
            <ProductInformationTab products={data.Products ?? []} />
          )}
          {activeTabId === 'user-management' && (
            <UserManagementTab
              merchantId={merchantId}
              dasmidOptions={dasmidOptions}
              rows={userList.rows}
              loading={userList.loading}
              hasMore={userList.hasMore}
              loadMore={userList.loadMore}
              refresh={userList.refresh}
              errorText={userList.error}
            />
          )}
          {activeTabId === 'merchant-settings' && ActiveSettingComponent && (
            <ActiveSettingComponent merchantId={merchantId} />
          )}
          {activeTabId === 'merchant-settings' && !ActiveSettingComponent && (
            <div className="flex min-h-[200px] items-center justify-center bg-white px-6 py-6 text-sm text-[#808080]">
              {t('merchant_settings.empty')}
            </div>
          )}
          {activeTabId === 'merchant-catalogue' && (
            <div className="flex min-h-[200px] items-center justify-center bg-white px-6 py-6 text-sm text-[#808080]">
              {t('merchant_details_page.tab_coming_soon')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MerchantDetailsPage;
