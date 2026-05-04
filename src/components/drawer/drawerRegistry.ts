import { lazy, type ComponentType } from 'react';
const TransactionDetailsDrawer = lazy(() => import('@/drawers/transaction-details-drawer'));
const RefundDrawer = lazy(() => import('@/drawers/refund-drawer'));
const CaptureDrawer = lazy(() => import('@/drawers/capture-drawer'));
const VoidDrawer = lazy(() => import('@/drawers/void-drawer'));
const DisputeDrawer = lazy(() => import('@/drawers/dispute-drawer'));
const EditStatusDrawer = lazy(() => import('@/drawers/edit-status-drawer'));
const ProductDetailsDrawer = lazy(() => import('@/drawers/product-details-drawer'));
const AcquirerMidDrawer = lazy(() => import('@/drawers/acquirer-mid-drawer'));
const MerchantDetailsDrawer = lazy(() => import('@/drawers/merchant-details-drawer'));

export interface DrawerComponentProps {
  type: string;
  data?: Record<string, unknown>;
}

export interface DrawerRegistryEntry {
  type: string;
  component: ComponentType<DrawerComponentProps>;
  width?: number; // panel width in px, default 420
  topOffset?: number; // distance from screen top in px, default 200
}

export const DRAWER_REGISTRY: DrawerRegistryEntry[] = [
  { type: 'details', component: TransactionDetailsDrawer, width: 520, topOffset: 100 },
  { type: 'refund', component: RefundDrawer, width: 520, topOffset: 100 },
  { type: 'capture', component: CaptureDrawer, width: 520, topOffset: 100 },
  { type: 'void', component: VoidDrawer, width: 520, topOffset: 100 },
  { type: 'dispute', component: DisputeDrawer, width: 520, topOffset: 100 },
  { type: 'edit-status', component: EditStatusDrawer, width: 520, topOffset: 100 },
  { type: 'product', component: ProductDetailsDrawer, width: 640, topOffset: 100 },
  { type: 'acquirer-mid', component: AcquirerMidDrawer, width: 640, topOffset: 100 },
  { type: 'merchant', component: MerchantDetailsDrawer, width: 640, topOffset: 100 },
];
