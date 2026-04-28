import { useForm, FormProvider } from 'react-hook-form';
import type { FieldValues, SubmitHandler, DefaultValues } from 'react-hook-form';
import { cn } from '@/utils/cn';
import type { FormSchema } from '@/types/form/form.types';
import { DasFormContext } from './DasFormContext';
import { DasFormFields } from './DasFormFields';
import { DasFormActions } from './DasFormActions';

// ── Root ──────────────────────────────────────────────────────────────────

interface DasFormRootProps<T extends FieldValues = FieldValues> {
  id?: string;
  schema: FormSchema;
  onSubmit: SubmitHandler<T>;
  onCancel?: () => void;
  loading?: boolean;
  defaultValues?: DefaultValues<T>;
  children: React.ReactNode;
  className?: string;
}

function DasFormRoot<T extends FieldValues = FieldValues>({
  id,
  schema,
  onSubmit,
  onCancel,
  loading,
  defaultValues,
  children,
  className,
}: DasFormRootProps<T>) {
  const methods = useForm<T>({
    mode: 'onTouched',
    defaultValues,
  });

  return (
    <DasFormContext.Provider value={{ schema, loading, onCancel }}>
      <FormProvider {...methods}>
        <form
          id={id}
          onSubmit={methods.handleSubmit(onSubmit)}
          className={cn('flex w-full flex-col gap-10', className)}
          noValidate
        >
          {children}
        </form>
      </FormProvider>
    </DasFormContext.Provider>
  );
}

// ── Compound export ───────────────────────────────────────────────────────

export const DasForm = DasFormRoot as typeof DasFormRoot & {
  Fields: typeof DasFormFields;
  Actions: typeof DasFormActions;
};
DasForm.Fields = DasFormFields;
DasForm.Actions = DasFormActions;
