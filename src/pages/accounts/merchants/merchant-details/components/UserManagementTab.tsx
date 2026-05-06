import { useMemo } from 'react';
import { DataTable } from '@/components/table';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import type { MerchantUserRow } from '@/types/merchant/merchantUserList.types';
import type { FilterFieldOption } from '@/components/filter/types';
import { buildMerchantUserColumns } from '../userTableSchema';

interface UserManagementTabProps {
  merchantId: string;
  /** DASMID options scoped to the current merchant's products. */
  dasmidOptions: FilterFieldOption[];
  rows: MerchantUserRow[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  errorText: string | null;
}

export function UserManagementTab({
  merchantId,
  dasmidOptions,
  rows,
  loading,
  hasMore,
  loadMore,
  refresh,
  errorText,
}: UserManagementTabProps) {
  const { open } = useDrawerControl();

  const handleRowClick = (row: MerchantUserRow) => {
    open({
      type: 'merchant-user-form',
      data: {
        transactionRefId: row.userId,
        mode: 'edit',
        merchantId,
        dasmidOptions,
        user: {
          userId: row.userId,
          fullName: `${row.firstName} ${row.lastName}`.trim(),
          firstName: row.firstName,
          lastName: row.lastName,
          email: row.email,
          status: (row.status as 'ACTIVE' | 'INACTIVE') || 'ACTIVE',
          accessLevel: row.role,
          dasmid: row.dasmids ?? [],
          isChargebackNoificationEnabled: row.isChargebackNoificationEnabled,
          isStatementNoificationEnabled: row.isStatementNoificationEnabled,
          isEmergencyHolidayNoificationEnabled: row.isEmergencyHolidayNoificationEnabled,
          isMonthlyHolidayNoificationEnabled: row.isMonthlyHolidayNoificationEnabled,
        },
        onMutationSuccess: refresh,
      },
    });
  };

  const columnConfigs = useMemo(
    () => buildMerchantUserColumns({ onUserClick: handleRowClick }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [merchantId]
  );

  if (errorText) {
    return (
      <div className="flex min-h-[120px] items-center justify-center bg-white px-6 py-6 text-sm text-[#ff4343]">
        {errorText}
      </div>
    );
  }

  return (
    <div className="bg-white px-6 pt-6 pb-6">
      <DataTable<MerchantUserRow>
        columnConfigs={columnConfigs}
        data={rows}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onRowClick={handleRowClick}
        className="rounded-2xl"
      />
    </div>
  );
}
