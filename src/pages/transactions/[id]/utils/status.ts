export const isSuccessStatus = (status?: string | null): boolean =>
  ['SUCCESSFUL']?.includes(String(status ?? '').toUpperCase());
