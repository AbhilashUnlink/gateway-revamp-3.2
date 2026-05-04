import { useFormContext } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDasFormContext } from './DasFormContext';
import { cn } from '@/utils/cn';
import type { ActionSchema } from '@/types/form/form.types';

interface DasFormActionsProps {
  className?: string;
}

export function DasFormActions({ className }: DasFormActionsProps) {
  const { schema, loading, onCancel } = useDasFormContext();
  const {
    reset,
    formState: { isValid, isSubmitting },
  } = useFormContext();

  const busy = isSubmitting || !!loading;

  const handleNonSubmit = (action: ActionSchema) => {
    if (action.type === 'reset') reset();
    if (action.type === 'cancel') onCancel?.();
  };

  if (!schema.actions?.length) return null;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {schema.actions.map((action) => {
        if (action.type === 'submit') {
          return (
            <Button key="submit" type="submit" variant="primary" disabled={!isValid || busy}>
              {busy ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {action.loadingLabel ?? action.label}
                </span>
              ) : (
                action.label
              )}
            </Button>
          );
        }

        return (
          <Button
            key={action.type}
            type="button"
            variant="link"
            onClick={() => handleNonSubmit(action)}
          >
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
