import { type LucideIcon } from 'lucide-react';
import { SidebarMenuItem } from './SidebarMenuItem';

export interface MenuItemConfig {
  tKey: string;
  icon: LucideIcon;
  path: string;
}

interface SidebarMenuProps {
  items: MenuItemConfig[];
  collapsed: boolean;
}

export function SidebarMenu({ items, collapsed }: SidebarMenuProps) {
  return (
    <nav className="flex flex-col" aria-label="Main navigation">
      {items.map((item) => (
        <SidebarMenuItem key={item.path} {...item} collapsed={collapsed} />
      ))}
    </nav>
  );
}
