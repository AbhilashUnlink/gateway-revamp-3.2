import type { ColumnConfig } from '@/types/transactions/transaction.types';
import type { MerchantUserRow } from '@/types/merchant/merchantUserList.types';

export interface UserSchemaContext {
  onUserClick?: (row: MerchantUserRow) => void;
}

export function buildMerchantUserColumns({
  onUserClick,
}: UserSchemaContext = {}): ColumnConfig<MerchantUserRow>[] {
  return [
    {
      id: 'firstName',
      headerPrimaryKey: 'merchant_user_table.first_name',
      cellType: 'link-copy',
      width: 180,
      sticky: true,
      accessorFn: (row) => ({ primary: row.firstName }),
      onPrimaryClick: onUserClick,
    },
    {
      id: 'lastName',
      headerPrimaryKey: 'merchant_user_table.last_name',
      cellType: 'text',
      width: 180,
      accessorFn: (row) => ({ primary: row.lastName }),
    },
    {
      id: 'status',
      headerPrimaryKey: 'merchant_user_table.status',
      cellType: 'status',
      width: 140,
      accessorFn: (row) => ({ primary: row.status, status: row.status }),
    },
    {
      id: 'productsCount',
      headerPrimaryKey: 'merchant_user_table.products',
      cellType: 'count',
      width: 130,
      accessorFn: (row) => ({ primary: String(row.productsCount) }),
    },
    {
      id: 'email',
      headerPrimaryKey: 'merchant_user_table.email_address',
      cellType: 'copy',
      width: 280,
      accessorFn: (row) => ({ primary: row.email }),
    },
    {
      id: 'role',
      headerPrimaryKey: 'merchant_user_table.role',
      cellType: 'text',
      width: 140,
      accessorFn: (row) => ({ primary: row.role }),
    },
    {
      id: 'joiningDate',
      headerPrimaryKey: 'merchant_user_table.joining_date',
      cellType: 'date',
      width: 220,
      accessorFn: (row) => ({ primary: row.joiningDate }),
    },
  ];
}
