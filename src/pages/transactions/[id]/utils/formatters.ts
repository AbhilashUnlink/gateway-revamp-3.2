import { formatDate as fmt } from '@/utils/formatDate';

export const formatDateOnly = (iso: string | null | undefined): string =>
  iso ? fmt(iso, 'dd MMM yyyy') : 'N/A';

export const formatTimeOnly = (iso: string | null | undefined): string =>
  iso ? fmt(iso, 'HH:mm:ss') : '—';

export const formatDateTime24 = (iso: string | null | undefined): string =>
  iso ? fmt(iso, "dd MMM yyyy '|' HH:mm:ss") : '—';

export const formatDateTime12 = (iso: string | null | undefined): string =>
  iso ? fmt(iso, "dd MMM yyyy '|' hh:mm:ss a") : '—';

export const shortenId = (id: string, head = 9, tail = 7): string => {
  if (!id) return '—';
  if (id.length <= head + tail + 4) return id;
  return `${id.slice(0, head)}....${id.slice(-tail)}`;
};

export const shortenCaseId = (id: string): string => {
  if (id.length <= 16) return id;
  return `${id.slice(0, 7)}...${id.slice(-8)}`;
};

export const formatCurrency = (
  currency: string | undefined | null,
  value: number | undefined | null
): string | null => {
  if (value === undefined || value === null || value === 0) return null;
  const c = currency ?? '';
  return c ? `${c} ${value}` : `${value}`;
};
