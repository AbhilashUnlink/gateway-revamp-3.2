import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import { CopyButton } from '@/components/ui/copy-button';
import DasDrawer from '@/components/ui/das-drawer';
import { useMerchantDetails } from '@/hooks/transactions/useMerchantDetails';
import { DrawerEntityHeader } from '../shared/DrawerEntityHeader';
import { DrawerFieldGrid, DrawerSection, type DrawerFieldConfig } from '../shared/DrawerFieldGrid';
import { DrawerStateView } from '../shared/DrawerStateView';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';
import type { MerchantDetailsData } from '@/types/merchant/merchantDetails.types';

const COUNTRY_LABELS: Record<string, string> = {
  JP: 'Japan',
  SG: 'Singapore',
  HK: 'Hong Kong',
  US: 'United States',
  GB: 'United Kingdom',
  IN: 'India',
};

function buildMerchantFields(data: MerchantDetailsData): DrawerFieldConfig[] {
  const country = COUNTRY_LABELS[data.Country] ?? data.Country;
  return [
    {
      key: 'merchant_account_en',
      label: 'Merchant Account (English)',
      value: data.LegalNameInEnglish || data.LegalName || null,
      copyable: true,
    },
    {
      key: 'merchant_ref_id',
      label: 'Merchant Ref ID',
      value: data.MerchantID || null,
      copyable: true,
      align: 'end',
    },
    { key: 'po_entity', label: 'PO Entity', value: data.SubsidiaryID || null },
    {
      key: 'registration_number',
      label: 'Registration Number',
      value: data.RegistrationNumber || null,
      align: 'end',
    },
    { key: 'city', label: 'City', value: data.City || null },
    {
      key: 'company_address',
      label: 'Company Address Information',
      value: data.Address || null,
      align: 'end',
    },
    { key: 'country', label: 'Country', value: country || null },
    {
      key: 'partner_name',
      label: 'Partner Name',
      value: data.Reseller?.legalName || null,
      align: 'end',
    },
    { key: 'postal_code', label: 'Postal Code', value: data.PostalCode || null },
  ];
}

interface ApiKeyRowProps {
  label: string;
  value: string;
}

function ApiKeyRow({ label, value }: ApiKeyRowProps) {
  const [revealed, setRevealed] = useState(false);
  const toggle = useCallback(() => setRevealed((v) => !v), []);
  const masked = value ? '*'.repeat(Math.max(value.length, 20)) : 'N/A';

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-sm font-medium uppercase leading-5 text-[#1a1a1a]">{label}</span>
      <span className="flex-1 truncate font-mono text-sm leading-5 text-[#231f20]">
        {value ? (revealed ? value : masked) : 'N/A'}
      </span>
      <Button
        type="button"
        variant="icon"
        size="icon"
        onClick={toggle}
        aria-label={revealed ? 'Hide' : 'Reveal'}
        disabled={!value}
      >
        {revealed ? <DasIcon name="eye-off" size={18} /> : <DasIcon name="eye" size={18} />}
      </Button>
      <CopyButton value={value} ariaLabel="Copy API key" />
    </div>
  );
}

export default function MerchantDetailsDrawer({ data }: DrawerComponentProps) {
  const merchantId = (data?.merchantId as string) ?? '';
  const { data: merchant, loading, error } = useMerchantDetails(merchantId || null);

  const fields = useMemo(() => (merchant ? buildMerchantFields(merchant) : []), [merchant]);
  const headerValue = merchant?.LegalName || merchant?.LegalNameInEnglish || merchantId;

  return (
    <>
      <DasDrawer.Header>
        <DrawerEntityHeader label="Merchant Account" value={headerValue} />
      </DasDrawer.Header>

      <DasDrawer.Body>
        <div className="flex flex-col gap-6 p-6">
          <DrawerStateView
            loading={loading}
            error={!loading ? error : null}
            loadingLabel="Loading merchant details"
          />

          {!loading && !error && merchant && (
            <>
              <DrawerSection>
                <DrawerFieldGrid fields={fields} />
              </DrawerSection>

              <DrawerSection title="API Keys" bordered={false}>
                <ApiKeyRow label="Live API Key" value={merchant.SecretKey} />
                {merchant.SecretKeyTest && (
                  <ApiKeyRow label="Test API Key" value={merchant.SecretKeyTest} />
                )}
              </DrawerSection>
            </>
          )}
        </div>
      </DasDrawer.Body>
    </>
  );
}
