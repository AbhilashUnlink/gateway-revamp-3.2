import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
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
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex h-7 items-center px-4 text-sm leading-5 transition-colors',
        selected
          ? 'rounded-2xl bg-[#f7941d] text-white drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.06)]'
          : 'rounded-full border border-[#1a1a1a] text-[#1a1a1a] hover:bg-white/60'
      )}
    >
      {t(pill.labelKey)}
    </button>
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
