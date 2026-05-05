import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasSpinner } from '@/components/ui/das-spinner';
import DasDialog from '@/components/ui/das-dialog';

interface DeleteConfirmModalProps {
  open: boolean;
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ open, saving, onCancel, onConfirm }: DeleteConfirmModalProps) {
  const { t } = useTranslation();
  return (
    <DasDialog open={open} onClose={onCancel}>
      <DasDialog.Title>{t('columns.delete_title')}</DasDialog.Title>
      <DasDialog.Body>{t('columns.delete_confirm')}</DasDialog.Body>
      <DasDialog.Actions>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          {t('columns.cancel')}
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} disabled={saving}>
          {saving && <DasSpinner size={14} className="mr-1.5" />}
          {t('columns.delete')}
        </Button>
      </DasDialog.Actions>
    </DasDialog>
  );
}
