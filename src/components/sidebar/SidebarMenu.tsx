import type { ComponentType } from 'react';
import { SidebarMenuItem } from './SidebarMenuItem';

export type SidebarIconComponent = ComponentType<{ size?: number; className?: string }>;

export interface MenuItemConfig {
  tKey: string;
  icon: SidebarIconComponent;
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
