import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import DasDrawer from '@/components/ui/DasDrawer';
import { Button } from '@/components/ui/button';
import { DrawerTransactionHeader } from '@/drawers/shared/DrawerTransactionHeader';
import { useDrawerTransaction } from '@/hooks/useDrawerTransaction';
import { useVoid } from '@/hooks/useVoid';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';

export default function VoidDrawer({ type, data }: DrawerComponentProps) {
  const { t } = useTranslation();
  const { handleClose } = useDrawerTransaction({ type, data });
  const { submitVoid, loading } = useVoid(handleClose);

  const handleSubmit = () =>
    submitVoid({
      id: (data?.transactionId as string) ?? '',
      merchant_id: (data?.dasMid as string) ?? '',
    });

  return (
    <>
      <DasDrawer.Header>
        <DrawerTransactionHeader activeTab="void" type={type} data={data} />
      </DasDrawer.Header>

      <DasDrawer.Body>
        <div className="flex flex-col gap-3 p-6">
          <h2 className="text-base font-semibold text-[#1a1a1a]">
            {t('drawer.void_authorization')}
          </h2>
          <p className="text-sm text-[#808080]">{t('drawer.void_confirm_text')}</p>
        </div>
      </DasDrawer.Body>

      <DasDrawer.Footer>
        <div className="flex gap-3">
          <Button
            type="button"
            disabled={loading}
            className="flex-1 shadow-[0px_4px_9px_0px_rgba(0,0,0,0.1)]"
            onClick={handleSubmit}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('drawer.submit')}
              </span>
            ) : (
              t('drawer.submit')
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            disabled={loading}
            onClick={handleClose}
          >
            {t('drawer.cancel')}
          </Button>
        </div>
      </DasDrawer.Footer>
    </>
  );
}
