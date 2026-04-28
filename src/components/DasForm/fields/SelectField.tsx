import { useFormContext, Controller } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SelectFieldSchema } from '@/types/form/form.types';

interface SelectFieldProps {
  field: SelectFieldSchema;
}

export function SelectField({ field }: SelectFieldProps) {
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
      <div className="relative flex items-center">
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: rhfField }) => (
            <select
              id={field.name}
              disabled={field.disabled}
              className={cn(
                'h-13 w-full appearance-none rounded-lg border border-[#e5e5e5] bg-white px-4 pr-10',
                'text-sm focus:outline-none focus:ring-1 focus:ring-[#f7941d]',
                rhfField.value ? 'text-[#1a1a1a]' : 'text-[#808080]',
                error && 'border-red-400 focus:ring-red-300/40'
              )}
              {...rhfField}
              value={rhfField.value ?? ''}
            >
              <option value="" disabled>
                {field.placeholder ?? 'Select'}
              </option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        />
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 text-[#808080]"
          aria-hidden="true"
        />
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
      {field.hint && <p className="text-sm text-[#808080]">{field.hint}</p>}
    </div>
  );
}
