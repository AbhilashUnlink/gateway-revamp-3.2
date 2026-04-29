import { lazy, type ComponentType } from 'react';
const TransactionDetailsDrawer = lazy(() => import('@/drawers/TransactionDetailsDrawer'));
const RefundDrawer = lazy(() => import('@/drawers/RefundDrawer'));
const CaptureDrawer = lazy(() => import('@/drawers/CaptureDrawer'));
const VoidDrawer = lazy(() => import('@/drawers/VoidDrawer'));
const DisputeDrawer = lazy(() => import('@/drawers/DisputeDrawer'));
const EditStatusDrawer = lazy(() => import('@/drawers/EditStatusDrawer'));

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
];
