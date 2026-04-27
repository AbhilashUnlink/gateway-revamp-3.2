import { type MenuItemConfig, SidebarMenu } from './SidebarMenu';

interface SidebarFooterProps {
  items: MenuItemConfig[];
  collapsed: boolean;
}

export function SidebarFooter({ items, collapsed }: SidebarFooterProps) {
  return (
    <div className="shrink-0 border-t border-neutral-100">
      <SidebarMenu items={items} collapsed={collapsed} />
    </div>
  );
}
