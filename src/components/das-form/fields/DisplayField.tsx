import type { DisplayFieldSchema } from '@/types/form/form.types';

interface DisplayFieldProps {
  field: DisplayFieldSchema;
}

export function DisplayField({ field }: DisplayFieldProps) {
  const isRequired = field.required ?? !!field.rules?.required;

  return (
    <div className="flex flex-col gap-2">
      {field.label && (
        <label className="text-sm font-semibold text-[#1a1a1a]">
          {field.label}
          {isRequired && <span className="font-normal text-[#ff4343]"> *</span>}
        </label>
      )}
      <div className="flex h-13 items-center justify-between rounded-lg border border-[#e5e5e5] bg-white px-4 text-sm">
        <span className="text-[#1a1a1a]">{field.value}</span>
        {field.suffix && <span className="text-[#808080]">{field.suffix}</span>}
      </div>
      {field.hint && <p className="text-sm text-[#808080]">{field.hint}</p>}
    </div>
  );
}
