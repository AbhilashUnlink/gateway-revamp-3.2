import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

interface SidebarToggleButtonProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarToggleButton({ collapsed, onToggle }: SidebarToggleButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onToggle}
      aria-label={collapsed ? t('sidebar.expand_sidebar') : t('sidebar.collapse_sidebar')}
      className={cn(
        'absolute -right-3 top-6 z-10 flex size-6 cursor-pointer items-center justify-center',
        'rounded-full border border-neutral-200 bg-white shadow-sm',
        'transition-all duration-200 hover:scale-105 hover:bg-neutral-100 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7941d]'
      )}
    >
      {collapsed ? (
        <ChevronRight size={12} className="text-neutral-600" />
      ) : (
        <ChevronLeft size={12} className="text-neutral-600" />
      )}
    </button>
  );
}
