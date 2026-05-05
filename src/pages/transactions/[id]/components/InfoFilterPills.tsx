import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { FILTER_PILLS, type FilterPill } from '../constants';
import type { InfoFilter } from '../types';

interface PillButtonProps {
  pill: FilterPill;
  selected: boolean;
  onSelect: (value: InfoFilter) => void;
}

const PillButton = memo(function PillButton({ pill, selected, onSelect }: PillButtonProps) {
  const { t } = useTranslation();
  const handleClick = useCallback(() => onSelect(pill.value), [onSelect, pill.value]);

  return (
    <Button
      type="button"
      variant={selected ? 'primary' : 'chip'}
      onClick={handleClick}
      className={cn(
        'h-7 w-auto px-4 text-sm leading-5 normal-case font-normal',
        selected
          ? 'rounded-2xl bg-[#f7941d] text-white drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.06)] hover:bg-[#f7941d]'
          : 'rounded-full border-[#1a1a1a] hover:bg-white/60'
      )}
    >
      {t(pill.labelKey)}
    </Button>
  );
});

interface InfoFilterPillsProps {
  active: InfoFilter;
  onChange: (next: InfoFilter) => void;
}

export function InfoFilterPills({ active, onChange }: InfoFilterPillsProps) {
  return (
    <div className="flex h-19 items-center gap-3 rounded-tl-2xl rounded-tr-2xl bg-[#fff6e6] px-6 py-1.5">
      {FILTER_PILLS.map((pill) => (
        <PillButton
          key={pill.value}
          pill={pill}
          selected={pill.value === active}
          onSelect={onChange}
        />
      ))}
    </div>
  );
}
