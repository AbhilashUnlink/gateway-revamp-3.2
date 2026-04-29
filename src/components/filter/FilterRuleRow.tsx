import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectOptionsByKey } from '@/store/slices/gatewayConfigSlice';
import { TextValue } from './controls/TextValue';
import { NumberValue } from './controls/NumberValue';
import { SelectValue } from './controls/SelectValue';
import { MultiSelectValue } from './controls/MultiSelectValue';
import { DateRangeValue } from './controls/DateRangeValue';
import { SearchableSelect } from './controls/SearchableSelect';
import { inferOperator } from './operators';
import type { FilterField, FilterFieldOption, FilterRule, FilterValue } from './types';

/**
 * Merge dynamic (gatewayConfig) options with static (field.options) options.
 * Dedupe by `value`. Dynamic wins on duplicates so backend-driven labels stay
 * authoritative when both sources expose the same key.
 */
function mergeOptions(
  dynamic: FilterFieldOption[],
  staticOpts: FilterFieldOption[] | undefined
): FilterFieldOption[] {
  const map = new Map<string, FilterFieldOption>();
  for (const opt of dynamic) map.set(opt.value, opt);
  for (const opt of staticOpts ?? []) {
    if (!map.has(opt.value)) map.set(opt.value, opt);
  }
  return Array.from(map.values());
}

interface Props {
  rule: FilterRule;
  fields: FilterField[];
  /** Field ids already used by other rules — disabled in the picker. */
  takenFieldIds: string[];
  onChange: (patch: Partial<FilterRule>) => void;
  onRemove: () => void;
}

export function FilterRuleRow({ rule, fields, takenFieldIds, onChange, onRemove }: Props) {
  const { t } = useTranslation();
  const field = fields.find((f) => f.id === rule.field);
  const dynamicOptions = useAppSelector(selectOptionsByKey(field?.optionsFromConfig));
  const fieldOptions = useMemo(
    () => mergeOptions(dynamicOptions, field?.options),
    [dynamicOptions, field?.options]
  );

  const handleField = (newId: string) => {
    const next = fields.find((f) => f.id === newId);
    if (!next) return;
    const blank: FilterValue =
      next.type === 'multiSelect' ? [] : next.type === 'dateRange' ? {} : '';
    onChange({
      field: newId,
      value: blank,
      operator: inferOperator(next.type),
    });
  };

  const handleValue = (v: FilterValue) => {
    onChange({
      value: v,
      operator: field ? inferOperator(field.type) : rule.operator,
    });
  };

  const fieldPickerOptions = useMemo(
    () => fields.map((f) => ({ value: f.id, label: t(f.labelKey, f.id) })),
    [fields, t]
  );
  const fieldPickerDisabled = useMemo(
    () => takenFieldIds.filter((id) => id !== rule.field),
    [takenFieldIds, rule.field]
  );

  return (
    <div className="grid grid-cols-[180px_minmax(0,1fr)_40px] items-center gap-3">
      <SearchableSelect
        value={rule.field}
        onChange={handleField}
        options={fieldPickerOptions}
        disabledValues={fieldPickerDisabled}
        placeholder={t('filter.select_field', 'Select field')}
      />

      <div className="min-w-0">
        {!field && (
          <TextValue value="" onChange={() => {}} placeholder={t('filter.value', 'Value')} />
        )}
        {field?.type === 'text' && (
          <TextValue value={rule.value as string} onChange={(v) => handleValue(v)} />
        )}
        {field?.type === 'number' && (
          <NumberValue value={rule.value as string} onChange={(v) => handleValue(v)} />
        )}
        {field?.type === 'select' && (
          <SelectValue
            value={rule.value as string}
            onChange={(v) => handleValue(v)}
            options={fieldOptions ?? []}
          />
        )}
        {field?.type === 'multiSelect' && (
          <MultiSelectValue
            value={(rule.value as string[]) ?? []}
            onChange={(v) => handleValue(v)}
            options={fieldOptions ?? []}
          />
        )}
        {field?.type === 'dateRange' && (
          <DateRangeValue
            value={(rule.value as { from?: string; to?: string }) ?? {}}
            onChange={(v) => handleValue(v)}
          />
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-[#808080] hover:bg-[#fafafa] hover:text-[#1a1a1a]"
        aria-label="Remove filter"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
