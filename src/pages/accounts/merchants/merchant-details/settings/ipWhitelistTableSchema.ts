import type { ReactNode } from 'react';
import type { ColumnConfig } from '@/types/transactions/transaction.types';
import type { MerchantIpRow } from '@/types/merchant/merchantIpList.types';

export interface IpWhitelistSchemaContext {
  onIpClick?: (row: MerchantIpRow) => void;
  /** Trailing actions cell (Edit / Delete buttons) per row. */
  renderActions?: (row: MerchantIpRow) => ReactNode;
}

export function buildMerchantIpColumns({
  onIpClick,
  renderActions,
}: IpWhitelistSchemaContext = {}): ColumnConfig<MerchantIpRow>[] {
  return [
    {
      id: 'ipAddress',
      headerPrimaryKey: 'merchant_ip_table.ip_address',
      cellType: 'link-copy',
      width: 200,
      sticky: true,
      accessorFn: (row) => ({ primary: row.ipAddress }),
      onPrimaryClick: onIpClick,
    },
    {
      id: 'status',
      headerPrimaryKey: 'merchant_ip_table.status',
      cellType: 'status',
      width: 160,
      accessorFn: (row) => ({ primary: row.status, status: row.status }),
    },
    {
      id: 'createdBy',
      headerPrimaryKey: 'merchant_ip_table.created_by',
      cellType: 'text',
      width: 180,
      accessorFn: (row) => ({ primary: row.createdBy }),
    },
    {
      id: 'createdAt',
      headerPrimaryKey: 'merchant_ip_table.created_date',
      cellType: 'date',
      width: 200,
      accessorFn: (row) => ({ primary: row.createdAt }),
    },
    {
      id: 'updatedBy',
      headerPrimaryKey: 'merchant_ip_table.updated_by',
      cellType: 'text',
      width: 180,
      accessorFn: (row) => ({ primary: row.updatedBy }),
    },
    {
      id: 'updatedAt',
      headerPrimaryKey: 'merchant_ip_table.updated_date',
      cellType: 'date',
      width: 200,
      accessorFn: (row) => ({ primary: row.updatedAt }),
    },
    {
      id: 'comments',
      headerPrimaryKey: 'merchant_ip_table.comments',
      cellType: 'text',
      width: 240,
      accessorFn: (row) => ({ primary: row.comments }),
    },
    ...(renderActions
      ? [
          {
            id: 'actions',
            headerPrimaryKey: '',
            cellType: 'text' as const,
            width: 140,
            accessorFn: () => ({}),
            renderCell: renderActions,
          },
        ]
      : []),
  ];
}
