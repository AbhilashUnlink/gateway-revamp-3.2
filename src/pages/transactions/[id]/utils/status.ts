const SUCCESS_RE = /SUCCESS|APPROVED|CAPTURED|PURCHASED?|UPDATED/;

export const isSuccessStatus = (status?: string | null): boolean =>
  SUCCESS_RE.test(String(status ?? '').toUpperCase());
