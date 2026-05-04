export const formatCurrency = (
  currency: string | undefined | null,
  value: number | undefined | null
): string | null => {
  if (value === undefined || value === null || value === 0) return null;
  const c = currency ?? '';
  return c ? `${c} ${value}` : `${value}`;
};
