import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Package,
  ShieldAlert,
  Building2,
  FileText,
  Scale,
  CreditCard,
  TrendingUp,
  MessageCircle,
  Info,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { SidebarMenu, type MenuItemConfig } from './SidebarMenu';
import { SidebarFooter } from './SidebarFooter';
import { SidebarToggleButton } from './SidebarToggleButton';

const mainMenuItems: MenuItemConfig[] = [
  { tKey: 'sidebar.dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { tKey: 'sidebar.transactions', icon: ArrowLeftRight, path: '/transactions' },
  { tKey: 'sidebar.merchants', icon: Users, path: '/accounts/merchants' },
  { tKey: 'sidebar.products', icon: Package, path: '/products' },
  { tKey: 'sidebar.risk_management', icon: ShieldAlert, path: '/risk-management' },
  { tKey: 'sidebar.acquirers', icon: Building2, path: '/acquirers' },
  { tKey: 'sidebar.statements', icon: FileText, path: '/finance/statements' },
  { tKey: 'sidebar.dispute_management', icon: Scale, path: '/dispute-management/list' },
  { tKey: 'sidebar.hash_card', icon: CreditCard, path: '/hashcard' },
  { tKey: 'sidebar.sales_lead', icon: TrendingUp, path: '/partner' },
];

const footerItems: MenuItemConfig[] = [
  { tKey: 'sidebar.help_and_support', icon: MessageCircle, path: '/contact-us' },
  { tKey: 'sidebar.privacy_and_policy', icon: Info, path: '/privacy-policy' },
  { tKey: 'sidebar.terms_and_conditions', icon: Info, path: '/terms-condition' },
];

export function Sidebar() {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const collapsed = !sidebarOpen;

  return (
    <aside
      className={cn(
        'relative flex h-[calc(100vh-3.5rem)] flex-col bg-white shadow-[0px_8px_8px_rgba(0,0,0,0.04)]',
        'transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-18' : 'w-66'
      )}
    >
      <SidebarToggleButton collapsed={collapsed} onToggle={() => dispatch(toggleSidebar())} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <SidebarMenu items={mainMenuItems} collapsed={collapsed} />
        </div>
        <SidebarFooter items={footerItems} collapsed={collapsed} />
      </div>
    </aside>
  );
}
