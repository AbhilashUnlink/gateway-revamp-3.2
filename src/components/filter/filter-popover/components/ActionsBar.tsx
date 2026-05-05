import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface ActionsBarProps {
  canApply: boolean;
  onApply: () => void;
  onCancel: () => void;
}

export function ActionsBar({ canApply, onApply, onCancel }: ActionsBarProps) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-3 px-4 pb-4">
      <Button
        type="button"
        variant="primary"
        onClick={onApply}
        disabled={!canApply}
        className="flex-1 rounded-2xl shadow-[0px_4px_9px_0px_rgba(0,0,0,0.1)]"
      >
        {t('filter.apply', 'Apply')}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        className="flex-1 rounded-2xl uppercase"
      >
        {t('filter.cancel', 'Cancel')}
      </Button>
    </div>
  );
}
