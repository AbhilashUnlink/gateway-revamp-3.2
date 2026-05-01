import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { TransactionActionsVisibility } from '@/store/slices/transactionDetailsSlice';
import { ACTION_BUTTONS, type ActionConfig } from '../constants';
import type { TransactionActionType } from '../types';

interface ActionButtonProps {
  action: ActionConfig;
  onAction: (type: TransactionActionType) => void;
}

const ActionButton = memo(function ActionButton({ action, onAction }: ActionButtonProps) {
  const { t } = useTranslation();
  const handleClick = useCallback(() => onAction(action.type), [onAction, action.type]);

  return (
    <Button type="button" variant="ghost" className="h-12 px-4" onClick={handleClick}>
      {t(action.labelKey)}
    </Button>
  );
});

interface ActionButtonsProps {
  visibility: TransactionActionsVisibility;
  onAction: (type: TransactionActionType) => void;
}

export function ActionButtons({ visibility, onAction }: ActionButtonsProps) {
  const visible = ACTION_BUTTONS.filter((action) => visibility[action.visibilityKey]);
  if (visible.length === 0) return null;

  return (
    <div className="flex items-center gap-3 pb-3">
      {visible.map((action) => (
        <ActionButton key={action.type} action={action} onAction={onAction} />
      ))}
    </div>
  );
}
