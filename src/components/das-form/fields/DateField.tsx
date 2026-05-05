import { useFormContext, Controller } from 'react-hook-form';
import { DasDatePicker } from '@/components/ui/das-date-picker';
import type { DateFieldSchema } from '@/types/form/form.types';

interface DateFieldProps {
  field: DateFieldSchema;
}

export function DateField({ field }: DateFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const isRequired = field.required ?? !!field.rules?.required;
  const error = errors[field.name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-2">
      {field.label && (
        <label htmlFor={field.name} className="text-sm font-semibold text-[#1a1a1a]">
          {field.label}
          {isRequired && <span className="font-normal text-[#ff4343]"> *</span>}
        </label>
      )}
      <Controller
        name={field.name}
        control={control}
        rules={field.rules}
        render={({ field: rhfField }) => (
          <DasDatePicker
            id={field.name}
            value={rhfField.value ? new Date(rhfField.value as string) : null}
            onChange={(date) => rhfField.onChange(date ? date.toISOString() : '')}
            placeholder={field.placeholder}
            disabled={field.disabled}
            hasError={!!error}
          />
        )}
      />
      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
