import type { ColumnConfig } from '@/types/transactions/transaction.types';
import type { MerchantRow } from '@/types/merchant/merchantList.types';

const COUNTRY_LABELS: Record<string, string> = {
  JP: 'Japan',
  SG: 'Singapore',
  HK: 'Hong Kong',
  US: 'United States',
  GB: 'United Kingdom',
  IN: 'India',
};

export function formatMerchantCountry(code: string): string {
  if (!code) return '';
  return COUNTRY_LABELS[code] ?? code;
}

export const MERCHANT_STATUS_OPTIONS = [
  { label: 'APPROVED', value: 'APPROVED' },
  { label: 'SUBMITTED', value: 'SUBMITTED' },
  { label: 'COMPLETED', value: 'COMPLETED' },
  { label: 'CLOSED', value: 'CLOSED' },
  { label: 'TERMINATED', value: 'TERMINATED' },
];

export interface MerchantSchemaContext {
  onMerchantAccountClick?: (row: MerchantRow) => void;
}

/**
 * Merchant list columns. Mirrors the transactions schema convention:
 * - `accessorFn` returns the cell payload
 * - `filterAttributes[].id` is the BACKEND query field (used directly in the
 *   query string by `serializeForMerchants`)
 */
export function buildMerchantColumns({
  onMerchantAccountClick,
}: MerchantSchemaContext = {}): ColumnConfig<MerchantRow>[] {
  return [
    {
      id: 'legalName',
      headerPrimaryKey: 'merchants_table.merchant_account',
      cellType: 'link-copy',
      width: 280,
      sticky: true,
      accessorFn: (row) => ({ primary: row.legalName }),
      onPrimaryClick: onMerchantAccountClick,
      filterAttributes: [
        { id: 'LegalName', labelKey: 'merchants_table.merchant_account', type: 'text' },
      ],
    },
    {
      id: 'status',
      headerPrimaryKey: 'merchants_table.status',
      cellType: 'status',
      width: 160,
      accessorFn: (row) => ({ primary: row.status, status: row.status }),
      filterAttributes: [
        {
          id: 'Status',
          labelKey: 'merchants_table.status',
          type: 'multiSelect',
          options: MERCHANT_STATUS_OPTIONS,
        },
      ],
    },
    {
      id: 'productsCount',
      headerPrimaryKey: 'merchants_table.products',
      cellType: 'count',
      width: 130,
      accessorFn: (row) => ({ primary: String(row.productsCount) }),
    },
    {
      id: 'legalNameInEnglish',
      headerPrimaryKey: 'merchants_table.merchant_account_en',
      cellType: 'copy',
      width: 280,
      accessorFn: (row) => ({ primary: row.legalNameInEnglish }),
      filterAttributes: [
        {
          id: 'LegalNameInEnglish',
          labelKey: 'merchants_table.merchant_account_en',
          type: 'text',
        },
      ],
    },
    {
      id: 'country',
      headerPrimaryKey: 'merchants_table.country',
      cellType: 'text',
      width: 160,
      accessorFn: (row) => ({ primary: formatMerchantCountry(row.country) }),
      filterAttributes: [{ id: 'Country', labelKey: 'merchants_table.country', type: 'text' }],
    },
    {
      id: 'createdAt',
      headerPrimaryKey: 'merchants_table.created_date',
      cellType: 'date',
      width: 220,
      accessorFn: (row) => ({ primary: row.createdAt }),
      filterAttributes: [
        { id: 'CreatedAt', labelKey: 'merchants_table.created_date', type: 'dateRange' },
      ],
    },
    {
      id: 'partnerName',
      headerPrimaryKey: 'merchants_table.partner_name',
      cellType: 'text',
      width: 180,
      accessorFn: (row) => ({ primary: row.partnerName }),
      filterAttributes: [
        { id: 'PartnerName', labelKey: 'merchants_table.partner_name', type: 'text' },
      ],
    },
  ];
}
