import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import DasDrawer from '@/components/ui/das-drawer';
import { useMerchantDetails } from '@/hooks/transactions/useMerchantDetails';
import { DrawerEntityHeader } from '../shared/DrawerEntityHeader';
import { DrawerFieldGrid, type DrawerFieldConfig } from '../shared/DrawerFieldGrid';
import { DrawerStateView } from '../shared/DrawerStateView';
import {
  formatCountry,
  formatSubsidiary,
} from '@/pages/accounts/merchants/merchant-details/merchantDetailsConfig';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';
import type { MerchantDetailsData, MerchantProduct } from '@/types/merchant/merchantDetails.types';
import { ApiKeysPanel } from './components/ApiKeysPanel';
import { ProductInformationSection } from './components/ProductInformationSection';

function buildBusinessFields(
  data: MerchantDetailsData,
  t: (k: string) => string
): DrawerFieldConfig[] {
  return [
    {
      key: 'merchant_account_en',
      label: t('merchant_drawer.field_merchant_account_en'),
      value: data.LegalNameInEnglish || data.LegalName || null,
      copyable: true,
    },
    {
      key: 'country',
      label: t('merchant_drawer.field_country'),
      value: formatCountry(data.Country) || null,
      align: 'end',
    },
    {
      key: 'registration_number',
      label: t('merchant_drawer.field_registration_number'),
      value: data.RegistrationNumber || null,
      copyable: true,
    },
    {
      key: 'po_entity',
      label: t('merchant_drawer.field_po_entity'),
      value: formatSubsidiary(data.SubsidiaryID) || null,
      align: 'end',
    },
    {
      key: 'company_address',
      label: t('merchant_drawer.field_company_address'),
      value: data.Address || null,
    },
    {
      key: 'city',
      label: t('merchant_drawer.field_city'),
      value: data.City || null,
      align: 'end',
    },
    {
      key: 'postal_code',
      label: t('merchant_drawer.field_postal_code'),
      value: data.PostalCode || null,
      copyable: true,
    },
    {
      key: 'merchant_id',
      label: t('merchant_drawer.field_merchant_id'),
      value: data.MerchantID || null,
      copyable: true,
      align: 'end',
    },
  ];
}

function buildContactFields(
  data: MerchantDetailsData,
  t: (k: string) => string
): DrawerFieldConfig[] {
  return [
    {
      key: 'first_name',
      label: t('merchant_drawer.field_first_name'),
      value: data.ContactFirstname || null,
    },
    {
      key: 'email_address',
      label: t('merchant_drawer.field_email_address'),
      value: data.ContactEmail || null,
      copyable: true,
      align: 'end',
    },
    {
      key: 'middle_name',
      label: t('merchant_drawer.field_middle_name'),
      value: data.ContactMiddleName || null,
    },
    {
      key: 'phone_number',
      label: t('merchant_drawer.field_phone_number'),
      value: data.ContactPhone || null,
      copyable: true,
      align: 'end',
    },
    {
      key: 'last_name',
      label: t('merchant_drawer.field_last_name'),
      value: data.ContactLastname || null,
    },
  ];
}

interface CollapsibleSectionProps {
  title: string;
  rightAdornment?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  rightAdornment,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="flex w-full flex-col gap-3 border-b border-[#e5e5e5] pb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold leading-5 text-[#1a1a1a]">{title}</h2>
          {rightAdornment}
        </div>
        <DasIcon
          name="chevron-down"
          size={20}
          className={open ? 'rotate-180 transition-transform' : 'transition-transform'}
        />
      </button>
      {open && <div className="flex flex-col gap-3">{children}</div>}
    </section>
  );
}

export default function MerchantDetailsDrawer({ data }: DrawerComponentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const merchantId = (data?.merchantId as string) ?? '';
  const { data: merchant, loading, error } = useMerchantDetails(merchantId || null);

  const [showApiKeys, setShowApiKeys] = useState(false);

  const businessFields = useMemo(
    () => (merchant ? buildBusinessFields(merchant, t) : []),
    [merchant, t]
  );
  const contactFields = useMemo(
    () => (merchant ? buildContactFields(merchant, t) : []),
    [merchant, t]
  );

  const products: MerchantProduct[] = merchant?.Products ?? [];
  const headerValue = merchant?.LegalName || merchant?.LegalNameInEnglish || merchantId;

  const handleOpenFullPage = useCallback(() => {
    if (!merchantId) return;
    navigate(`/accounts/merchants/merchant-details/${merchantId}`);
  }, [merchantId, navigate]);

  return (
    <>
      <DasDrawer.Header>
        <DrawerEntityHeader label={t('merchant_drawer.label')} value={headerValue} />
      </DasDrawer.Header>

      <DasDrawer.Body>
        <div className="flex flex-col gap-6 p-6">
          <DrawerStateView
            loading={loading}
            error={!loading ? error : null}
            loadingLabel={t('merchant_drawer.loading')}
          />

          {!loading && !error && merchant && (
            <>
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowApiKeys((v) => !v)}
                  className="h-8 rounded-2xl px-3 text-xs font-semibold uppercase tracking-wide drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]"
                >
                  {t('merchant_drawer.live_api_keys')}
                </Button>
                {showApiKeys && (
                  <div className="mt-3">
                    <ApiKeysPanel liveKey={merchant.SecretKey} testKey={merchant.SecretKeyTest} />
                  </div>
                )}
              </div>

              <CollapsibleSection title={t('merchant_drawer.section_business_details')}>
                <DrawerFieldGrid fields={businessFields} columns={2} />
              </CollapsibleSection>

              <CollapsibleSection title={t('merchant_drawer.section_contact_details')}>
                <DrawerFieldGrid fields={contactFields} columns={2} />
              </CollapsibleSection>

              <CollapsibleSection
                title={t('merchant_drawer.section_product_information')}
                rightAdornment={
                  <>
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#f7941d] px-1.5 text-xs font-semibold leading-none text-white">
                      {products.length}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenFullPage();
                      }}
                      aria-label={t('merchant_drawer.open_in_page')}
                      className="text-[#1a1a1a] hover:opacity-70"
                    >
                      <DasIcon name="external-link" size={16} />
                    </button>
                  </>
                }
              >
                <ProductInformationSection products={products} />
              </CollapsibleSection>
            </>
          )}
        </div>
      </DasDrawer.Body>
    </>
  );
}
