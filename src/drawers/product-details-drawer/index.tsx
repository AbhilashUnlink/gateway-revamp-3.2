import { useCallback, useMemo, type ReactNode } from 'react';
import DasDrawer from '@/components/ui/das-drawer';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { useProductDetails } from '@/hooks/transactions/useProductDetails';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { SCHEME_ICON_MAP } from '@/assets/icons/payment/schemeIconMap';
import { DrawerEntityHeader } from '../shared/DrawerEntityHeader';
import { DrawerFieldGrid, DrawerSection, type DrawerFieldConfig } from '../shared/DrawerFieldGrid';
import { DrawerStateView } from '../shared/DrawerStateView';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';
import type {
  ProductConnectionMethodFlags,
  ProductDetailsData,
  ProductSchemeFlags,
  ProductTransactionTypeFlags,
} from '@/types/product/productDetails.types';

interface ChipConfig {
  key: string;
  label: string;
  active: boolean;
}

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  ECOM: 'e-Commerce (ECOM)',
  RETAIL: 'Retail',
  MOTO: 'MOTO',
  QR: 'QR',
};

const SCHEME_KEYS: Record<keyof ProductSchemeFlags, string> = {
  hasVISA: 'visa',
  hasMastercard: 'mastercard',
  hasJCB: 'jcb',
  hasAmex: 'amex',
  hasUnionPay: 'unionpay',
  hasAlipay: 'alipay',
  hasApplePay: 'applepay',
  hasGooglePay: 'googlepay',
  hasDinersClub: 'diners',
  hasGCash: 'gcash',
  hasPayPay: 'paypay',
  hasKonbini: 'konbini',
  hasPayEasy: 'payeasy',
};

function getEnabledSchemes(flags: ProductSchemeFlags): string[] {
  return (Object.keys(flags) as (keyof ProductSchemeFlags)[])
    .filter((k) => flags[k])
    .map((k) => SCHEME_KEYS[k]);
}

function buildIntegrationChips(conn: ProductConnectionMethodFlags): ChipConfig[] {
  return [
    { key: 'hasShopPlugin', label: 'Hosted Payment Page', active: !!conn?.hasShopPlugin },
    { key: 'hasMobileApp', label: 'Server to Server', active: !!conn?.hasMobileApp },
  ];
}

function buildTransactionChips(tx: ProductTransactionTypeFlags): ChipConfig[] {
  return [
    { key: '3ds', label: '3D Secure', active: tx.has3DS },
    { key: 'non3ds', label: 'Non 3D Secure', active: !tx.has3DS },
    { key: 'cvc', label: 'CVV/CVC2', active: tx.hasCVC },
    { key: 'noncvc', label: 'Non CVV2/CVC2', active: !tx.hasCVC },
    { key: 'recurring', label: 'Recurring', active: tx.hasRecurring },
    { key: 'mcc', label: 'Dynamic MCC', active: tx.hasDynamicMCC },
  ];
}

function SchemeBadge({ scheme }: { scheme: string }) {
  const Icon = SCHEME_ICON_MAP[scheme];
  return (
    <span className="inline-flex h-5 items-center justify-center rounded border border-[#e5e5e5] px-1">
      {Icon ? (
        <Icon className="h-3 w-auto" />
      ) : (
        <span className="text-xs uppercase text-[#1a1a1a]">{scheme}</span>
      )}
    </span>
  );
}

function Chip({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center justify-center rounded border px-1 text-sm leading-5',
        active ? 'border-[#808080] text-[#1a1a1a]' : 'border-[#cccccc] text-[#cccccc]'
      )}
    >
      {label}
    </span>
  );
}

interface AcquirerMidLinkProps {
  acquirerMid: string;
  onClick: (acquirerMid: string) => void;
}

function AcquirerMidLink({ acquirerMid, onClick }: AcquirerMidLinkProps) {
  return (
    <Button
      type="button"
      variant="field-link"
      size="inline"
      onClick={() => onClick(acquirerMid)}
      className="truncate"
    >
      {acquirerMid}
    </Button>
  );
}

function buildProductFields(
  data: ProductDetailsData,
  onAcquirerMidClick: (acquirerMid: string) => void
): DrawerFieldConfig[] {
  const enabledSchemes = getEnabledSchemes(data.SchemeTypes);
  const merchantAccount = data.MerchantNameInEnglish || data.MerchantName;

  const acquirerMidNode: ReactNode = data.AcquirerMID ? (
    <AcquirerMidLink acquirerMid={data.AcquirerMID} onClick={onAcquirerMidClick} />
  ) : (
    <span className="text-sm leading-5 text-[#808080]">N/A</span>
  );

  return [
    {
      key: 'scheme',
      label: 'Scheme',
      custom: (
        <div className="flex flex-wrap items-center gap-1">
          {enabledSchemes.length > 0 ? (
            enabledSchemes.map((s) => <SchemeBadge key={s} scheme={s} />)
          ) : (
            <span className="text-sm leading-5 text-[#808080]">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: 'shop_processing_url',
      label: 'Shop Processing URL',
      value: data.ShopProcessingURL || null,
      align: 'end',
    },
    {
      key: 'merchant_account',
      label: 'Merchant Account',
      value: merchantAccount || null,
      copyable: true,
      underline: true,
    },
    {
      key: 'merchant_category_code',
      label: 'Merchant Category Code',
      value: data.MerchantCategoryCode || null,
      align: 'end',
    },
    {
      key: 'settlement_currency',
      label: 'Settlement Currency',
      value: data.SettlementCCY || null,
    },
    {
      key: 'processing_currency',
      label: 'Processing Currency',
      value: data.TransactionCCY?.length ? data.TransactionCCY.join(', ') : null,
      align: 'end',
    },
    {
      key: 'acquirer',
      label: 'Acquirer',
      value: data.AcquirerCode || null,
    },
    {
      key: 'acquirer_mid',
      label: 'Acquirer MID',
      align: 'end',
      copyable: !!data.AcquirerMID,
      value: data.AcquirerMID,
      custom: acquirerMidNode,
    },
    {
      key: 'billing_description',
      label: 'Billing Description',
      value: data.BillingDescriptor || null,
    },
  ];
}

export default function ProductDetailsDrawer({ data }: DrawerComponentProps) {
  const { open } = useDrawerControl();
  const dasmid = (data?.dasmid as string) ?? '';
  const terminalId = (data?.terminalId as string) ?? '';

  const {
    data: product,
    loading,
    error,
  } = useProductDetails({
    dasmid: dasmid || null,
    terminalId: terminalId || null,
  });

  const handleAcquirerMidClick = useCallback(
    (acquirerMid: string) => {
      open({
        type: 'acquirer-mid',
        data: {
          transactionRefId: acquirerMid,
          acquirerMid,
        },
      });
    },
    [open]
  );

  const productFields = useMemo(
    () => (product ? buildProductFields(product, handleAcquirerMidClick) : []),
    [product, handleAcquirerMidClick]
  );
  const integrationChips = useMemo(
    () => (product ? buildIntegrationChips(product.ConnectionMethods) : []),
    [product]
  );
  const transactionChips = useMemo(
    () => (product ? buildTransactionChips(product.TransactionType) : []),
    [product]
  );

  const headerDasmid = product?.DASMID || dasmid;
  const sectionTitle = product
    ? (PRODUCT_TYPE_LABELS[product.ProductType] ?? product.ProductType)
    : '';

  return (
    <>
      <DasDrawer.Header>
        <DrawerEntityHeader label="DASMID" value={headerDasmid} />
      </DasDrawer.Header>

      <DasDrawer.Body>
        <div className="flex flex-col gap-6 p-6">
          <DrawerStateView
            loading={loading}
            error={!loading ? error : null}
            loadingLabel="Loading product details"
          />

          {!loading && !error && product && (
            <>
              <DrawerSection title={sectionTitle}>
                <DrawerFieldGrid fields={productFields} />
              </DrawerSection>

              <DrawerSection title="Integration Type">
                <div className="flex flex-wrap items-center gap-3">
                  {integrationChips.map((chip) => (
                    <Chip key={chip.key} label={chip.label} active={chip.active} />
                  ))}
                </div>
              </DrawerSection>

              <DrawerSection title="Transaction Type" bordered={false}>
                <div className="flex flex-wrap items-center gap-3">
                  {transactionChips.map((chip) => (
                    <Chip key={chip.key} label={chip.label} active={chip.active} />
                  ))}
                </div>
              </DrawerSection>
            </>
          )}
        </div>
      </DasDrawer.Body>
    </>
  );
}
