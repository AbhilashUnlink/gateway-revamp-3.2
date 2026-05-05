import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface ActionsBarProps {
  isAdding: boolean;
  isNameDuplicate: boolean;
  saving: boolean;
  onApply: () => void;
  onAdd: () => void;
  onCancelAdd: () => void;
  onClose: () => void;
}

/** Footer — primary button switches between Apply and Save while a name is being typed. */
export function ActionsBar({
  isAdding,
  isNameDuplicate,
  saving,
  onApply,
  onAdd,
  onCancelAdd,
  onClose,
}: ActionsBarProps) {
  const { t } = useTranslation();
  return (
    <div className="mt-auto flex gap-3 pt-2 pb-1">
      <Button
        type="button"
        variant="primary"
        onClick={isAdding ? onAdd : onApply}
        disabled={saving || (isAdding && isNameDuplicate)}
        className="flex-1"
      >
        {isAdding ? t('columns.save') : t('columns.apply')}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={isAdding ? onCancelAdd : onClose}
        disabled={saving}
        className="flex-1"
      >
        {t('columns.cancel')}
      </Button>
    </div>
  );
}
