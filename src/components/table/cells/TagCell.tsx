import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';
import { isPresent } from '../utils/isPresent';

interface TagStyle {
  border: string;
  bg: string;
  text: string;
}

const PINK: TagStyle = { border: 'border-[#f472b6]', bg: 'bg-[#fdf2f8]', text: 'text-[#be185d]' };
const ORANGE: TagStyle = { border: 'border-[#f7941d]', bg: 'bg-[#fff6e6]', text: 'text-[#f7941d]' };
const BLUE: TagStyle = { border: 'border-[#60a5fa]', bg: 'bg-[#eff6ff]', text: 'text-[#1e40af]' };
const GREEN: TagStyle = { border: 'border-[#34d399]', bg: 'bg-[#ecfdf5]', text: 'text-[#1e8f1f]' };
const PURPLE: TagStyle = { border: 'border-[#a78bfa]', bg: 'bg-[#f5f3ff]', text: 'text-[#5b21b6]' };
const GRAY: TagStyle = { border: 'border-[#d1d5db]', bg: 'bg-[#f9fafb]', text: 'text-[#4b5563]' };

const TAG_STYLE_MAP: Record<string, TagStyle> = {
  ecom: PINK,
  ecommerce: PINK,
  subscription: ORANGE,
  qr: BLUE,
  scheduler: BLUE,
  pbl: GREEN,
  paybylink: GREEN,
  pay_by_link: GREEN,
  'pay by link': GREEN,
  moto: PURPLE,
  softpos: PURPLE,
};

function getTagStyle(value: string): TagStyle {
  if (!value) return GRAY;
  const key = value.trim().toLowerCase().replace(/\s+/g, '');
  return TAG_STYLE_MAP[key] ?? GRAY;
}

interface TagCellProps {
  data: CellData;
  className?: string;
}

export function TagCell({ data, className }: TagCellProps) {
  if (!isPresent(data.primary)) {
    return (
      <span className={cn('text-[14px] font-normal leading-5 text-[#bdbdbd]', className)}>N/A</span>
    );
  }
  const label = String(data.primary).toUpperCase();
  const style = getTagStyle(label);
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded border text-[12px] font-medium uppercase whitespace-nowrap max-w-max',
        style.border,
        style.bg,
        style.text,
        className
      )}
    >
      {label}
    </span>
  );
}
