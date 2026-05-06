import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import { DasSpinner } from '@/components/ui/das-spinner';
import DasDialog from '@/components/ui/das-dialog';
import { DataTable } from '@/components/table';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { useMerchantIpList } from '@/hooks/merchants/useMerchantIpList';
import { useMerchantIpMutation } from '@/hooks/merchants/useMerchantIpMutation';
import type { MerchantIpRow } from '@/types/merchant/merchantIpList.types';
import { buildMerchantIpColumns } from './ipWhitelistTableSchema';
import { IpRowActions } from './IpRowActions';

interface IpWhitelistSettingProps {
  merchantId: string;
}

export function IpWhitelistSetting({ merchantId }: IpWhitelistSettingProps) {
  const { t } = useTranslation();
  const { open: openDrawer } = useDrawerControl();
  const list = useMerchantIpList(merchantId || null);
  const { deleteIp, loading: deleting } = useMerchantIpMutation(list.refresh);

  const [pendingDelete, setPendingDelete] = useState<MerchantIpRow | null>(null);

  const handleEdit = (row: MerchantIpRow) => {
    openDrawer({
      type: 'merchant-ip-form',
      data: {
        transactionRefId: String(row.rawId),
        mode: 'edit',
        merchantId,
        ip: {
          id: row.rawId,
          ipAddress: row.ipAddress,
          status: row.status,
          comments: row.comments,
        },
        onMutationSuccess: list.refresh,
      },
    });
  };

  const handleDelete = (row: MerchantIpRow) => setPendingDelete(row);

  const cancelDelete = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteIp(pendingDelete.rawId);
      setPendingDelete(null);
    } catch {
      // Error surfaced via the mutation hook; keep the dialog open so the
      // user can retry without re-selecting the row.
    }
  };

  const handleAdd = () => {
    openDrawer({
      type: 'merchant-ip-form',
      data: {
        transactionRefId: `add@@@${merchantId}`,
        mode: 'add',
        merchantId,
        onMutationSuccess: list.refresh,
      },
    });
  };

  const columnConfigs = useMemo(
    () =>
      buildMerchantIpColumns({
        renderActions: (row) => (
          <IpRowActions row={row} onEdit={handleEdit} onDelete={handleDelete} />
        ),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [merchantId]
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <h2 className="text-base font-semibold leading-5 text-[#1a1a1a]">
          {t('merchant_settings.ip_whitelist_title')}
        </h2>
        <Button
          type="button"
          variant="ghost"
          onClick={handleAdd}
          className="h-10 gap-2 rounded-2xl px-4 text-xs font-semibold uppercase tracking-wide drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]"
        >
          <DasIcon name="plus" size={16} />
          {t('merchant_settings.add_ip_address')}
        </Button>
      </div>

      <div className="bg-white px-6 pt-2 pb-6">
        {list.error ? (
          <div className="flex min-h-[120px] items-center justify-center text-sm text-[#ff4343]">
            {list.error}
          </div>
        ) : (
          <DataTable<MerchantIpRow>
            columnConfigs={columnConfigs}
            data={list.rows}
            loading={list.loading}
            hasMore={list.hasMore}
            onLoadMore={list.loadMore}
            className="rounded-2xl"
          />
        )}
      </div>

      <DasDialog open={!!pendingDelete} onClose={cancelDelete}>
        <DasDialog.Title>{t('merchant_settings.delete_ip_title')}</DasDialog.Title>
        <DasDialog.Body>
          {t('merchant_settings.delete_ip_confirm', { ip: pendingDelete?.ipAddress ?? '' })}
        </DasDialog.Body>
        <DasDialog.Actions>
          <Button type="button" variant="ghost" onClick={cancelDelete} disabled={deleting}>
            {t('merchant_settings.cancel')}
          </Button>
          <Button type="button" variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting && <DasSpinner size={14} className="mr-1.5" />}
            {t('merchant_settings.delete')}
          </Button>
        </DasDialog.Actions>
      </DasDialog>
    </div>
  );
}
