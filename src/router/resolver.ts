import React from 'react';

type PageLoader = () => Promise<{ default: React.ComponentType }>;

const registry: Record<string, PageLoader> = {
  // Public pages
  login: () => import('@/pages/login'),
  'forgot-password': () => import('@/pages/forgot-password'),
  'reset-password': () => import('@/pages/reset-password'),
  'reset-successful': () => import('@/pages/reset-successful'),
  'choose-account-type': () => import('@/pages/choose-account-type'),
  'sign-up': () => import('@/pages/sign-up'),
  'mfa-setup': () => import('@/pages/mfa-setup'),
  'daspay-transaction-details': () => import('@/pages/daspay-transaction-details'),
  'terms-condition': () => import('@/pages/terms-condition'),
  'privacy-policy': () => import('@/pages/privacy-policy'),
  // Protected pages
  dashboard: () => import('@/pages/dashboard'),
  transactions: () => import('@/pages/transactions'),
  'transactions/details': () => import('@/pages/transactions/[id]'),
  'accounts/merchants': () => import('@/pages/accounts/merchants'),
  'accounts/merchants/merchant-details': () =>
    import('@/pages/accounts/merchants/merchant-details'),
  acquirers: () => import('@/pages/acquirers'),
  'risk-management': () => import('@/pages/risk-management'),
  'finance/statements': () => import('@/pages/finance/statements'),
  'dispute-management/list': () => import('@/pages/dispute-management/list'),
  onboarding: () => import('@/pages/onboarding'),
  'onboarding/details': () => import('@/pages/onboarding/details'),
  partner: () => import('@/pages/partner'),
  reseller: () => import('@/pages/reseller'),
  hashcard: () => import('@/pages/hashcard'),
  'transaction-xray': () => import('@/pages/transaction-xray'),
  'contact-us': () => import('@/pages/contact-us'),
};

const lazyComponents = Object.fromEntries(
  Object.entries(registry).map(([name, loader]) => [name, React.lazy(loader)])
) as Record<string, React.LazyExoticComponent<React.ComponentType>>;

export function loadComponent(name: string): React.LazyExoticComponent<React.ComponentType> {
  const component = lazyComponents[name];
  if (!component) throw new Error(`Component not registered: ${name}`);
  return component;
}
