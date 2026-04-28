import { cn } from '@/utils/cn';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/uiSlice';
import {
  AcquirersIcon,
  DashboardIcon,
  DisputeManagementIcon,
  HashCardIcon,
  HelpSupportIcon,
  MerchantsIcon,
  PrivacyPolicyIcon,
  ProductsIcon,
  RiskManagementIcon,
  SalesLeadIcon,
  StatementsIcon,
  TransactionsIcon,
} from '@/assets/icons/sidebar';
import { SidebarMenu, type MenuItemConfig } from './SidebarMenu';
import { SidebarFooter } from './SidebarFooter';
import { SidebarToggleButton } from './SidebarToggleButton';

const mainMenuItems: MenuItemConfig[] = [
  { tKey: 'sidebar.dashboard', icon: DashboardIcon, path: '/dashboard' },
  { tKey: 'sidebar.transactions', icon: TransactionsIcon, path: '/transactions' },
  { tKey: 'sidebar.merchants', icon: MerchantsIcon, path: '/accounts/merchants' },
  { tKey: 'sidebar.products', icon: ProductsIcon, path: '/products' },
  { tKey: 'sidebar.risk_management', icon: RiskManagementIcon, path: '/risk-management' },
  { tKey: 'sidebar.acquirers', icon: AcquirersIcon, path: '/acquirers' },
  { tKey: 'sidebar.statements', icon: StatementsIcon, path: '/finance/statements' },
  {
    tKey: 'sidebar.dispute_management',
    icon: DisputeManagementIcon,
    path: '/dispute-management/list',
  },
  { tKey: 'sidebar.hash_card', icon: HashCardIcon, path: '/hashcard' },
  { tKey: 'sidebar.sales_lead', icon: SalesLeadIcon, path: '/partner' },
];

const footerItems: MenuItemConfig[] = [
  { tKey: 'sidebar.help_and_support', icon: HelpSupportIcon, path: '/contact-us' },
  { tKey: 'sidebar.privacy_and_policy', icon: PrivacyPolicyIcon, path: '/privacy-policy' },
  { tKey: 'sidebar.terms_and_conditions', icon: PrivacyPolicyIcon, path: '/terms-condition' },
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
