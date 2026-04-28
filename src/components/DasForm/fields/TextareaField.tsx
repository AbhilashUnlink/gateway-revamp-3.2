import { useFormContext, Controller } from 'react-hook-form';
import type { TextareaFieldSchema } from '@/types/form/form.types';

interface TextareaFieldProps {
  field: TextareaFieldSchema;
}

export function TextareaField({ field }: TextareaFieldProps) {
  const { control, watch } = useFormContext();
  const value = (watch(field.name) as string) ?? '';
  const isRequired = field.required ?? !!field.rules?.required;

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
          <textarea
            id={field.name}
            maxLength={field.maxLength}
            rows={field.rows ?? 5}
            placeholder={field.placeholder}
            className="w-full resize-none rounded-lg border border-[#e5e5e5] bg-white p-4 text-sm text-[#1a1a1a] placeholder:text-[#808080] focus:outline-none focus:ring-1 focus:ring-[#f7941d]"
            {...rhfField}
            value={rhfField.value ?? ''}
          />
        )}
      />
      {field.hint && (
        <p className="text-sm text-[#808080]">
          {field.maxLength ? `${value.length}/${field.maxLength} — ` : ''}
          {field.hint}
        </p>
      )}
    </div>
  );
}
