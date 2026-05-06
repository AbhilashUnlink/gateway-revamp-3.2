import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import { DasSpinner } from '@/components/ui/das-spinner';
import DasDrawer from '@/components/ui/das-drawer';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { useMerchantIpMutation } from '@/hooks/merchants/useMerchantIpMutation';
import {
  MerchantIpForm,
  MERCHANT_IP_FORM_ID,
  type MerchantIpFormValues,
} from '@/components/forms/merchants/MerchantIpForm';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';

type Mode = 'add' | 'edit';

interface MerchantIpDrawerData {
  mode?: Mode;
  merchantId?: string;
  /** Editing an existing IP — prefilled values + record id. */
  ip?: Partial<MerchantIpFormValues> & { id?: number | string };
  onMutationSuccess?: () => void;
}

function HeaderBar({ title, onClose }: { title: string; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex h-18 items-center rounded-tl-2xl rounded-tr-2xl border-l border-r border-t border-white bg-gradient-to-r from-brand-light to-brand-soft px-6 py-1.5">
      <div className="flex flex-1 items-center justify-between">
        <span className="text-base font-semibold leading-5 text-[#1a1a1a]">{title}</span>
        <Button
          variant="icon"
          size="icon"
          type="button"
          onClick={onClose}
          aria-label={t('merchant_ip_form.close')}
        >
          <DasIcon name="x-circle" size={24} />
        </Button>
      </div>
    </div>
  );
}

export default function MerchantIpFormDrawer({ data }: DrawerComponentProps) {
  const { t } = useTranslation();
  const { close } = useDrawerControl();
  const drawerData = (data ?? {}) as MerchantIpDrawerData;
  const mode: Mode = drawerData.mode ?? 'add';
  const merchantId = drawerData.merchantId ?? '';

  const { createIp, updateIp, loading } = useMerchantIpMutation(() => {
    drawerData.onMutationSuccess?.();
    close();
  });

  const title = mode === 'add' ? t('merchant_ip_form.add_title') : t('merchant_ip_form.edit_title');

  const onSubmit = async (values: MerchantIpFormValues) => {
    if (mode === 'add') {
      await createIp({ ...values, merchantId });
    } else {
      await updateIp({ ...values, merchantId });
    }
  };

  return (
    <>
      <DasDrawer.Header>
        <HeaderBar title={title} onClose={close} />
      </DasDrawer.Header>

      <DasDrawer.Body>
        <MerchantIpForm
          key={mode === 'edit' ? String(drawerData.ip?.id ?? 'edit') : 'add'}
          defaultValues={
            drawerData.ip
              ? {
                  ipAddress: drawerData.ip.ipAddress ?? '',
                  status: drawerData.ip.status ?? 'NEW',
                  comments: drawerData.ip.comments ?? '',
                }
              : undefined
          }
          ipDisabled={mode === 'edit'}
          onSubmit={onSubmit}
        />

        {mode === 'edit' && (
          <details className="border-t border-[#e5e5e5] px-6 py-4" open>
            <summary className="flex cursor-pointer items-center justify-between text-base font-semibold leading-5 text-[#1a1a1a]">
              <span>{t('merchant_ip_form.previous_comments')}</span>
              <DasIcon name="chevron-down" size={20} />
            </summary>
            <div className="mt-3 flex flex-col gap-3 text-sm text-[#808080]">
              {/* TODO: wire to history endpoint when available. */}
              <div className="rounded-xl border border-dashed border-[#e5e5e5] px-4 py-3 text-center">
                {t('merchant_ip_form.previous_comments_empty')}
              </div>
            </div>
          </details>
        )}
      </DasDrawer.Body>

      <DasDrawer.Footer>
        <div className="flex gap-3">
          <Button type="submit" form={MERCHANT_IP_FORM_ID} disabled={loading} className="flex-1">
            {loading ? (
              <span className="flex items-center gap-2">
                <DasSpinner className="h-4 w-4" />
                {mode === 'add' ? t('merchant_ip_form.submit') : t('merchant_ip_form.save_changes')}
              </span>
            ) : mode === 'add' ? (
              t('merchant_ip_form.submit')
            ) : (
              t('merchant_ip_form.save_changes')
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            disabled={loading}
            onClick={close}
          >
            {t('merchant_ip_form.cancel')}
          </Button>
        </div>
      </DasDrawer.Footer>
    </>
  );
}
