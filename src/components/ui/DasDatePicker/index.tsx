import DatePicker from 'react-datepicker';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DasDatePickerProps {
  id?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export function DasDatePicker({
  id,
  value,
  onChange,
  placeholder = 'Select Date',
  disabled = false,
  hasError = false,
}: DasDatePickerProps) {
  return (
    <div className="relative flex items-center">
      <DatePicker
        id={id}
        selected={value}
        onChange={onChange}
        disabled={disabled}
        placeholderText={placeholder}
        dateFormat="yyyy-MM-dd"
        autoComplete="off"
        className={cn(
          'h-13 w-full rounded-lg border border-[#e5e5e5] bg-white px-4 pr-12',
          'text-sm text-[#1a1a1a] placeholder:text-[#808080]',
          'focus:outline-none focus:ring-1 focus:ring-[#f7941d]',
          hasError && 'border-red-400 focus:ring-red-300/40'
        )}
        wrapperClassName="w-full"
        popperClassName="z-50"
      />
      <CalendarDays
        size={20}
        className="pointer-events-none absolute right-4 text-[#808080]"
        aria-hidden="true"
      />
    </div>
  );
}
