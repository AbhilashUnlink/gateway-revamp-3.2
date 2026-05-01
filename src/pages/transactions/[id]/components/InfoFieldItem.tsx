import { memo, useCallback } from 'react';
import { Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/CopyButton';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { useHashcardCheck } from '@/hooks/useHashcardCheck';
import type { InfoFieldAction, InfoFieldConfig } from '../types';
import { StatusBadge } from './primitives';

interface InfoFieldItemProps {
  field: InfoFieldConfig;
  className?: string;
}

function useFieldActionHandler(action: InfoFieldAction | undefined) {
  const { open } = useDrawerControl();
  const { check: checkHashcard } = useHashcardCheck();
  return useCallback(() => {
    if (!action) return;
    switch (action.kind) {
      case 'product':
        open({
          type: 'product',
          data: {
            transactionRefId: `${action.dasmid}___${action.terminalId}`,
            dasmid: action.dasmid,
            terminalId: action.terminalId,
          },
        });
        return;
      case 'acquirer-mid':
        open({
          type: 'acquirer-mid',
          data: {
            transactionRefId: action.acquirerMid,
            acquirerMid: action.acquirerMid,
          },
        });
        return;
      case 'merchant':
        open({
          type: 'merchant',
          data: {
            transactionRefId: action.merchantId,
            merchantId: action.merchantId,
          },
        });
        return;
      case 'hashcard-check':
        void checkHashcard(action.hashCardNumber);
        return;
    }
  }, [action, open, checkHashcard]);
}

export const InfoFieldItem = memo(function InfoFieldItem({ field, className }: InfoFieldItemProps) {
  const display =
    field.value !== undefined && field.value !== null && field.value !== ''
      ? String(field.value)
      : 'N/A';
  const isMissing = display === 'N/A';
  const handleAction = useFieldActionHandler(field.action);
  const isClickable = !!field.action && !isMissing && !field.badge;

  return (
    <div className={cn('flex h-11 flex-col gap-1', className)}>
      <span className="text-sm leading-5 text-[#808080]">{field.label}</span>
      <div className="flex items-center gap-2">
        {field.badge ? (
          <StatusBadge label={field.badge.label} tone={field.badge.tone} />
        ) : isClickable ? (
          <Button
            type="button"
            variant="field-link"
            size="inline"
            onClick={handleAction}
            className="truncate"
          >
            {display}
          </Button>
        ) : (
          <span
            className={cn(
              'truncate text-sm leading-5',
              isMissing ? 'text-[#808080]' : 'text-[#1a1a1a]'
            )}
          >
            {display}
          </span>
        )}
        {field.copyable && !isMissing && !field.badge && <CopyButton value={display} />}
        {field.downloadable && !isMissing && (
          <button
            type="button"
            className="shrink-0 text-[#808080] hover:text-[#1a1a1a]"
            aria-label="download"
          >
            <Download size={14} />
          </button>
        )}
      </div>
    </div>
  );
});
