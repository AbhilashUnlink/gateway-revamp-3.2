import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/DasIcon';
import { CopyButton } from '@/components/ui/CopyButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDrawerTransaction } from '@/hooks/transactions/useDrawerTransaction';
import { useTransactionActions } from '@/hooks/transactions/useTransactionActions';
import { useNavigate } from 'react-router-dom';
import { EditButtonIcon } from '@/assets/icons/action-buttons';

export type DrawerTab = 'details' | 'refund' | 'capture' | 'void' | 'dispute' | 'edit-status';

const TAB_TO_DRAWER_TYPE: Record<DrawerTab, string> = {
  details: 'details',
  refund: 'refund',
  capture: 'capture',
  void: 'void',
  dispute: 'dispute',
  'edit-status': 'edit-status',
};

interface DrawerTransactionHeaderProps {
  activeTab: DrawerTab;
  type: string;
  data?: Record<string, unknown>;
  showRefund?: boolean;
  showCapture?: boolean;
  showVoid?: boolean;
  showDispute?: boolean;
}

export function DrawerTransactionHeader({
  activeTab,
  type,
  data,
  showRefund: showRefundOverride,
  showCapture: showCaptureOverride,
  showVoid: showVoidOverride,
  showDispute: showDisputeOverride,
}: DrawerTransactionHeaderProps) {
  const { t } = useTranslation();
  const { transactionRefId, handleClose, navigateTo } = useDrawerTransaction({
    type,
    data,
  });
  const {
    data: storeData,
    loading: actionsLoading,
    showRefund: apiShowRefund,
    showCapture: apiShowCapture,
    showVoid: apiShowVoid,
    showDispute: apiShowDispute,
    showEditStatus: apiShowEditStatus,
  } = useTransactionActions();

  const isStale = !storeData || storeData.TransactionRefID !== transactionRefId;
  const actionsLoadingForTx = actionsLoading || isStale;

  const showRefund = showRefundOverride ?? apiShowRefund;
  const showCapture = showCaptureOverride ?? apiShowCapture;
  const showVoid = showVoidOverride ?? apiShowVoid;
  const showDispute = showDisputeOverride ?? apiShowDispute;
  const showEditStatus = apiShowEditStatus;

  const goTo = (tab: DrawerTab) => navigateTo(TAB_TO_DRAWER_TYPE[tab]);
  const navigate = useNavigate();
  const handleOpenTransactionDetailsWithDrawer = () => {
    // ?drawer=${activeTab}&id=${transactionRefId}
    navigate(`/transactions/${transactionRefId}`);
  };

  return (
    <>
      <div className="flex h-18 items-center border-l border-r border-t border-white bg-white px-6 py-1.5 rounded-tl-2xl rounded-tr-2xl">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-normal text-[#1a1a1a]">
              {t('drawer.transaction_ref_id')}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold underline text-[#1a1a1a]">
                {transactionRefId}
              </span>
              <CopyButton
                value={transactionRefId}
                size={16}
                ariaLabel={t('drawer.copy')}
                className="flex h-8 w-8 items-center justify-center"
              />
              <Button variant="icon" size="icon" type="button" aria-label={t('drawer.share')}>
                <DasIcon name="share-2" size={16} />
              </Button>
              <Button
                variant="icon"
                size="icon"
                type="button"
                aria-label={t('drawer.open_new_window')}
                onClick={handleOpenTransactionDetailsWithDrawer}
              >
                <DasIcon name="external-link" size={16} />
              </Button>
            </div>
          </div>
          <Button
            variant="icon"
            size="icon"
            type="button"
            onClick={handleClose}
            aria-label={t('drawer.close')}
          >
            <DasIcon name="x-circle" size={24} />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between px-6">
        <div className="flex gap-3">
          <Button
            type="button"
            variant={activeTab === 'details' ? 'outline' : 'ghost'}
            className="w-22.5"
            onClick={activeTab !== 'details' ? () => goTo('details') : undefined}
          >
            {t('drawer.details')}
          </Button>

          {actionsLoadingForTx ? (
            <div className="flex mt-2 gap-3">
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          ) : (
            <>
              {showRefund && (
                <Button
                  type="button"
                  variant={activeTab === 'refund' ? 'outline' : 'ghost'}
                  className="w-22.5"
                  onClick={activeTab !== 'refund' ? () => goTo('refund') : undefined}
                >
                  {t('drawer.refund')}
                </Button>
              )}

              {showVoid && (
                <Button
                  type="button"
                  variant={activeTab === 'void' ? 'outline' : 'ghost'}
                  className="w-22.5"
                  onClick={activeTab !== 'void' ? () => goTo('void') : undefined}
                >
                  {t('drawer.void')}
                </Button>
              )}

              {showCapture && (
                <Button
                  type="button"
                  variant={activeTab === 'capture' ? 'outline' : 'ghost'}
                  className="w-22.5"
                  onClick={activeTab !== 'capture' ? () => goTo('capture') : undefined}
                >
                  {t('drawer.capture')}
                </Button>
              )}

              {showDispute && (
                <Button
                  type="button"
                  variant={activeTab === 'dispute' ? 'outline' : 'ghost'}
                  className="w-22.5"
                  onClick={activeTab !== 'dispute' ? () => goTo('dispute') : undefined}
                >
                  {t('drawer.dispute')}
                </Button>
              )}
            </>
          )}
        </div>

        {actionsLoadingForTx ? (
          <Skeleton className="h-9 w-32 rounded-md" />
        ) : (
          showEditStatus && (
            <Button
              type="button"
              variant={activeTab === 'edit-status' ? 'outline' : 'ghost'}
              onClick={activeTab !== 'edit-status' ? () => navigateTo('edit-status') : undefined}
              className="gap-2 shadow-none drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.1)]"
            >
              <EditButtonIcon
                className={activeTab === 'edit-status' ? 'text-(var(--brand-color))' : ''}
              />
              {t('drawer.edit_status')}
            </Button>
          )
        )}
      </div>
    </>
  );
}
