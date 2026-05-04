import { useFormContext, Controller } from 'react-hook-form';
import { SearchableSelect } from '@/components/filter/controls/SearchableSelect';
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
        <label htmlFor={field.name} className="text-sm font-medium text-[#1a1a1a]">
          {field.label}
          {isRequired && <span className="font-normal text-[#ff4343]"> *</span>}
        </label>
      )}
      <Controller
        name={field.name}
        control={control}
        rules={field.rules}
        render={({ field: rhfField }) => (
          <SearchableSelect
            id={field.name}
            value={(rhfField.value as string) ?? ''}
            onChange={rhfField.onChange}
            options={field.options}
            placeholder={field.placeholder}
            disabled={field.disabled}
            invalid={!!error}
            triggerClassName="h-13 px-4"
          />
        )}
      />
      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
      {field.hint && <p className="text-sm text-[#808080]">{field.hint}</p>}
    </div>
  );
}
