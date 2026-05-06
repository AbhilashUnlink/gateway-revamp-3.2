import { useTranslation } from 'react-i18next';
import { DasIcon } from '@/components/ui/das-icon';
import type { MerchantIpRow } from '@/types/merchant/merchantIpList.types';

interface IconButtonProps {
  ariaLabel: string;
  iconName: 'edit-button' | 'delete-button';
  onClick: () => void;
}

function IconButton({ ariaLabel, iconName, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex shrink-0 items-center justify-center bg-transparent p-0 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7941d]"
    >
      {/* The SVG ships with its own white card + drop shadow, so no extra wrapper styling. */}
      <DasIcon name={iconName} size={48} />
    </button>
  );
}

interface IpRowActionsProps {
  row: MerchantIpRow;
  onEdit: (row: MerchantIpRow) => void;
  onDelete: (row: MerchantIpRow) => void;
}

export function IpRowActions({ row, onEdit, onDelete }: IpRowActionsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-end gap-2">
      <IconButton
        ariaLabel={t('merchant_settings.edit_ip')}
        iconName="edit-button"
        onClick={() => onEdit(row)}
      />
      <IconButton
        ariaLabel={t('merchant_settings.delete_ip')}
        iconName="delete-button"
        onClick={() => onDelete(row)}
      />
    </div>
  );
}
