import { useFormContext } from 'react-hook-form';
import type { CheckboxFieldSchema } from '@/types/form/form.types';

interface CheckboxFieldProps {
  field: CheckboxFieldSchema;
}

export function CheckboxField({ field }: CheckboxFieldProps) {
  const { register } = useFormContext();

  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id={field.name}
        disabled={field.disabled}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border border-[#e5e5e5] accent-[#f7941d]"
        {...register(field.name, field.rules)}
      />
      {field.label && (
        <label htmlFor={field.name} className="cursor-pointer text-sm leading-5 text-[#1a1a1a]">
          {field.label}
        </label>
      )}
    </div>
  );
}
