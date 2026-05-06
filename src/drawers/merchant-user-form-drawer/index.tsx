import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import { DasSpinner } from '@/components/ui/das-spinner';
import DasDrawer from '@/components/ui/das-drawer';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { useMerchantUserMutation } from '@/hooks/merchants/useMerchantUserMutation';
import {
  MerchantUserForm,
  MERCHANT_USER_FORM_ID,
  type MerchantUserFormValues,
} from '@/components/forms/merchants/MerchantUserForm';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';
import type { FilterFieldOption } from '@/components/filter/types';
import { cn } from '@/utils/cn';

type Mode = 'add' | 'edit';

interface MerchantUserDrawerData {
  mode?: Mode;
  merchantId?: string;
  /** Editing an existing user — prefilled values. */
  user?: Partial<MerchantUserFormValues> & { userId?: string; fullName?: string };
  /** DASMID options scoped to the merchant's products (NOT the global list). */
  dasmidOptions?: FilterFieldOption[];
  /** Called by the drawer after a successful add to refresh the list. */
  onMutationSuccess?: () => void;
}

function HeaderBar({ name, onClose }: { name: string; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex h-18 items-center rounded-tl-2xl rounded-tr-2xl border-l border-r border-t border-white bg-gradient-to-r from-brand-light to-brand-soft px-6 py-1.5">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal leading-5 text-[#1a1a1a]">
            {t('merchant_user_form.name')}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold leading-5 text-[#1a1a1a]">{name || '—'}</span>
            {name && (
              <button
                type="button"
                aria-label={t('merchant_user_form.share')}
                className="text-[#1a1a1a] hover:opacity-70"
              >
                <DasIcon name="share-2" size={16} />
              </button>
            )}
          </div>
        </div>
        <Button
          variant="icon"
          size="icon"
          type="button"
          onClick={onClose}
          aria-label={t('merchant_user_form.close')}
        >
          <DasIcon name="x-circle" size={24} />
        </Button>
      </div>
    </div>
  );
}

interface ModeButtonProps {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

function ModeButton({ active, children, onClick }: ModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-10 rounded-2xl border bg-white px-4 text-xs font-semibold uppercase tracking-wide drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]',
        active ? 'border-[#f7941d] text-[#f7941d]' : 'border-transparent text-[#1a1a1a]'
      )}
    >
      {children}
    </button>
  );
}

export default function MerchantUserFormDrawer({ data }: DrawerComponentProps) {
  const { t } = useTranslation();
  const { close } = useDrawerControl();
  const drawerData = (data ?? {}) as MerchantUserDrawerData;
  const mode: Mode = drawerData.mode ?? 'add';
  const merchantId = drawerData.merchantId ?? '';

  const { createUser, loading } = useMerchantUserMutation(() => {
    drawerData.onMutationSuccess?.();
    close();
  });

  const headerName = useMemo(() => {
    if (mode === 'add') return t('merchant_user_form.add_new_user');
    if (drawerData.user?.fullName) return drawerData.user.fullName;
    const first = drawerData.user?.firstName ?? '';
    const last = drawerData.user?.lastName ?? '';
    return `${first} ${last}`.trim();
  }, [mode, drawerData.user, t]);

  const dasmidOptions = drawerData.dasmidOptions ?? [];

  const onSubmit = async (values: MerchantUserFormValues) => {
    if (mode === 'add') {
      await createUser({ ...values, merchantID: merchantId });
    } else {
      // Edit mode — endpoint not specified by the API yet; close for now.
      // TODO: wire updateUser when the backend route is available.
      close();
    }
  };

  return (
    <>
      <DasDrawer.Header>
        <HeaderBar name={headerName} onClose={close} />
      </DasDrawer.Header>

      <DasDrawer.Body>
        {mode === 'edit' && (
          <div className="flex items-center gap-3 px-6 pt-4">
            <ModeButton active>{t('merchant_user_form.edit_user')}</ModeButton>
            <ModeButton>{t('merchant_user_form.reset_password')}</ModeButton>
            <ModeButton>{t('merchant_user_form.delete_user')}</ModeButton>
          </div>
        )}

        <MerchantUserForm
          key={mode === 'edit' ? (drawerData.user?.userId ?? 'edit') : 'add'}
          defaultValues={drawerData.user as Partial<MerchantUserFormValues> | undefined}
          dasmidOptions={dasmidOptions}
          onSubmit={onSubmit}
        />
      </DasDrawer.Body>

      <DasDrawer.Footer>
        <div className="flex gap-3">
          <Button type="submit" form={MERCHANT_USER_FORM_ID} disabled={loading} className="flex-1">
            {loading ? (
              <span className="flex items-center gap-2">
                <DasSpinner className="h-4 w-4" />
                {mode === 'add'
                  ? t('merchant_user_form.add_user')
                  : t('merchant_user_form.save_changes')}
              </span>
            ) : mode === 'add' ? (
              t('merchant_user_form.add_user')
            ) : (
              t('merchant_user_form.save_changes')
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            disabled={loading}
            onClick={close}
          >
            {t('merchant_user_form.cancel')}
          </Button>
        </div>
      </DasDrawer.Footer>
    </>
  );
}
