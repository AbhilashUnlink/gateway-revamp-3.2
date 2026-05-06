import type { ColumnConfig } from '@/types/transactions/transaction.types';
import type { MerchantProduct } from '@/types/merchant/merchantDetails.types';

const PRODUCT_TYPE_DISPLAY: Record<string, string> = {
  ECOM: 'ECOMMERCE',
  ECOMMERCE: 'ECOMMERCE',
  SUBSCRIPTION: 'SUBSCRIPTION',
  QR: 'QR',
  SCHEDULER: 'SCHEDULER',
  PBL: 'PAY BY LINK',
  PAYBYLINK: 'PAY BY LINK',
  'PAY BY LINK': 'PAY BY LINK',
  MOTO: 'MOTO',
  SOFTPOS: 'SOFTPOS',
};

function toProductTypeLabel(type: string): string {
  if (!type) return '';
  return PRODUCT_TYPE_DISPLAY[type.toUpperCase()] ?? type.toUpperCase();
}

const MCC_DESCRIPTIONS: Record<string, string> = {
  '5999': 'Miscellaneous and Specialty Retail Shop',
  '7112': 'Miscellaneous and Specialty Retail Shop',
};

function mccDescription(mcc: string): string {
  return MCC_DESCRIPTIONS[mcc] ?? '';
}

export interface ProductSchemaContext {
  onProductClick?: (row: MerchantProduct) => void;
}

export function buildMerchantProductColumns({
  onProductClick,
}: ProductSchemaContext = {}): ColumnConfig<MerchantProduct>[] {
  return [
    {
      id: 'productName',
      headerPrimaryKey: 'merchant_product_table.product_name',
      cellType: 'link-copy',
      width: 280,
      sticky: true,
      accessorFn: (row) => ({ primary: row.Name }),
      onPrimaryClick: onProductClick,
    },
    {
      id: 'productType',
      headerPrimaryKey: 'merchant_product_table.product_type',
      cellType: 'tag',
      width: 200,
      accessorFn: (row) => ({ primary: toProductTypeLabel(row.Type) }),
    },
    {
      id: 'dasMid',
      headerPrimaryKey: 'merchant_product_table.das_mid',
      cellType: 'text',
      width: 180,
      accessorFn: (row) => ({ primary: row.DASMID }),
    },
    {
      id: 'midStatus',
      headerPrimaryKey: 'merchant_product_table.mid_status',
      cellType: 'status',
      width: 160,
      accessorFn: (row) => ({ primary: row.Status, status: row.Status }),
    },
    {
      id: 'merchantCategoryCode',
      headerPrimaryKey: 'merchant_product_table.merchant_category_code',
      cellType: 'multi',
      width: 280,
      accessorFn: (row) => ({
        primary: row.MCC,
        secondary: mccDescription(row.MCC),
      }),
    },
    {
      id: 'acquirer',
      headerPrimaryKey: 'merchant_product_table.acquirer',
      cellType: 'text',
      width: 180,
      accessorFn: (row) => ({ primary: row.AcquirerCode }),
    },
  ];
}
