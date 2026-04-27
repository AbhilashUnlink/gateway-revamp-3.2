import { NavLink } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import DasTooltip from '@/components/ui/tooltip';

interface SidebarMenuItemProps {
  tKey: string;
  icon: LucideIcon;
  path: string;
  collapsed: boolean;
}

export function SidebarMenuItem({ tKey, icon: Icon, path, collapsed }: SidebarMenuItemProps) {
  const { t } = useTranslation();
  const label = t(tKey);

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        cn(
          'group flex w-full items-center gap-2 p-3.5 transition-colors duration-200',
          'hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f7941d]',
          isActive && 'bg-neutral-50'
        )
      }
    >
      {({ isActive }) => {
        const iconEl = (
          <div
            className={cn(
              'flex shrink-0 items-center justify-center rounded-[18px] p-3 size-9 transition-colors duration-200',
              isActive ? 'bg-[rgba(247,148,29,0.1)]' : 'bg-transparent group-hover:bg-white'
            )}
          >
            <Icon
              size={18}
              className={cn(
                'transition-colors duration-200',
                isActive ? 'text-[#f7941d]' : 'text-[#1a1a1a]'
              )}
            />
          </div>
        );

        return (
          <>
            {collapsed ? <DasTooltip content={label}>{iconEl}</DasTooltip> : iconEl}
            <span
              className={cn(
                'overflow-hidden whitespace-nowrap font-medium text-sm uppercase tracking-wide transition-all duration-300',
                isActive ? 'text-[#f7941d]' : 'text-[#1a1a1a]',
                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              )}
            >
              {label}
            </span>
          </>
        );
      }}
    </NavLink>
  );
}
