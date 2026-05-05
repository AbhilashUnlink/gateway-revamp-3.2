import { useTranslation } from 'react-i18next';
import { DasIcon } from '@/components/ui/DasIcon';
import { Button } from '@/components/ui/button';

interface SidebarToggleButtonProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarToggleButton({ collapsed, onToggle }: SidebarToggleButtonProps) {
  const { t } = useTranslation();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label={collapsed ? t('sidebar.expand_sidebar') : t('sidebar.collapse_sidebar')}
      className="absolute -right-3 top-6 z-10 size-6 cursor-pointer rounded-full border border-neutral-200 bg-white shadow-sm hover:scale-105 hover:bg-neutral-100 hover:opacity-100 active:scale-95 focus-visible:ring-[#f7941d]"
    >
      {collapsed ? (
        <DasIcon name="chevron-right" size={12} className="text-neutral-600" />
      ) : (
        <DasIcon name="chevron-left" size={12} className="text-neutral-600" />
      )}
    </Button>
  );
}
