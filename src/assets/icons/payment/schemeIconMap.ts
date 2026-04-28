import type { ComponentType, SVGProps } from 'react';
import {
  AmexIcon,
  ApplePayIcon,
  GCashIcon,
  JcbIcon,
  MastercardIcon,
  UnionPayIcon,
  VisaIcon,
} from './index';

export type PaymentSchemeIcon = ComponentType<SVGProps<SVGSVGElement>>;

export const SCHEME_ICON_MAP: Record<string, PaymentSchemeIcon> = {
  visa: VisaIcon,
  mastercard: MastercardIcon,
  master: MastercardIcon,
  mc: MastercardIcon,
  jcb: JcbIcon,
  amex: AmexIcon,
  americanexpress: AmexIcon,
  'american express': AmexIcon,
  unionpay: UnionPayIcon,
  'union pay': UnionPayIcon,
  cup: UnionPayIcon,
  applepay: ApplePayIcon,
  'apple pay': ApplePayIcon,
  apple: ApplePayIcon,
  gcash: GCashIcon,
};

export function resolveSchemeKey(scheme: string | null | undefined): string | null {
  if (!scheme) return null;
  const normalized = scheme.trim().toLowerCase().replace(/\s+/g, ' ');
  if (normalized in SCHEME_ICON_MAP) return normalized;
  const compact = normalized.replace(/\s+/g, '');
  if (compact in SCHEME_ICON_MAP) return compact;
  return null;
}
