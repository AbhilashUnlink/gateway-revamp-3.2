import type { ComponentType } from 'react';
import { TransactionDetailsDrawer } from '@/drawers/TransactionDetailsDrawer';
import { RefundDrawer } from '@/drawers/RefundDrawer';
import { CaptureDrawer } from '@/drawers/CaptureDrawer';
import { VoidDrawer } from '@/drawers/VoidDrawer';
import { DisputeDrawer } from '@/drawers/DisputeDrawer';
import { EditStatusDrawer } from '@/drawers/EditStatusDrawer';

export interface DrawerComponentProps {
  type: string;
  data?: Record<string, unknown>;
  width?: number;
  topOffset?: number;
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
