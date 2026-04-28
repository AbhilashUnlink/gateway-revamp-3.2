const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export interface TransactionDateParts {
  date: string; // e.g. "12 Mar, 25"
  time: string; // e.g. "17:00:44"
}

const EMPTY: TransactionDateParts = { date: '', time: '' };

export function formatTransactionDate(input: string | null | undefined): TransactionDateParts {
  if (!input) return EMPTY;

  const trimmed = String(input).trim();
  if (!trimmed) return EMPTY;

  let d = new Date(trimmed);
  if (isNaN(d.getTime())) {
    // Fallback: try replacing space with 'T' for ISO-like formats
    d = new Date(trimmed.replace(' ', 'T'));
  }
  if (isNaN(d.getTime())) return { date: trimmed, time: '' };

  const dd = d.getDate().toString().padStart(2, '0');
  const mon = MONTHS_SHORT[d.getMonth()];
  const yy = d.getFullYear().toString().slice(-2);
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  const ss = d.getSeconds().toString().padStart(2, '0');

  return {
    date: `${dd} ${mon}, ${yy}`,
    time: `${hh}:${mm}:${ss}`,
  };
}
