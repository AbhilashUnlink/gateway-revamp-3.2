import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import { FilterRuleRow } from '../../FilterRuleRow';
import type { FilterField, FilterRule } from '../../types';

interface DraftRulesListProps {
  draftRules: FilterRule[];
  fields: FilterField[];
  takenFieldIds: string[];
  canAdd: boolean;
  allRulesComplete: boolean;
  hasFreeField: boolean;
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<FilterRule>) => void;
  onRemove: (id: string) => void;
}

export function DraftRulesList({
  draftRules,
  fields,
  takenFieldIds,
  canAdd,
  allRulesComplete,
  hasFreeField,
  onAdd,
  onUpdate,
  onRemove,
}: DraftRulesListProps) {
  const { t } = useTranslation();
  const addTitle = !allRulesComplete
    ? t('filter.fill_value_first', 'Fill in the current filter value first')
    : !hasFreeField
      ? t('filter.no_more_fields', 'All fields are already in use')
      : undefined;

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      {draftRules.length > 0 && <FieldsHeaderRow />}

      {draftRules.map((rule) => (
        <FilterRuleRow
          key={rule.id}
          rule={rule}
          fields={fields}
          takenFieldIds={takenFieldIds}
          onChange={(patch) => onUpdate(rule.id, patch)}
          onRemove={() => onRemove(rule.id)}
        />
      ))}

      <div className="border-t border-[#e5e5e5] pt-3">
        <Button
          type="button"
          variant="link"
          size="inline"
          onClick={onAdd}
          disabled={!canAdd}
          title={addTitle}
          className="gap-2.5 font-semibold text-[#1a1a1a] hover:no-underline disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('filter.add_new', 'Add New')}
          <DasIcon name="plus" size={20} strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
}

function FieldsHeaderRow() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[1fr_1fr_40px] gap-4">
      <RequiredLabel>{t('filter.field', 'Field')}</RequiredLabel>
      <RequiredLabel>{t('filter.value', 'Value')}</RequiredLabel>
      <span />
    </div>
  );
}

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm font-semibold text-[#1a1a1a]">
      {children}
      <span className="font-normal text-[#ff4343]">*</span>
    </span>
  );
}
