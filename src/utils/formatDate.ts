const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

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

const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pad = (n: number, w = 2) => String(n).padStart(w, '0');

export function formatDate(input: string | Date | null | undefined, pattern: string): string {
  if (!input) return '';

  const d = input instanceof Date ? input : new Date(input);

  if (isNaN(d.getTime())) {
    if (typeof input === 'string') {
      const retry = new Date(input.replace(' ', 'T'));
      if (!isNaN(retry.getTime())) return formatDate(retry, pattern);
      return input;
    }
    return '';
  }

  const h24 = d.getHours();
  const h12 = h24 % 12 || 12;

  const tokens: Record<string, string> = {
    yyyy: String(d.getFullYear()),
    yy: String(d.getFullYear()).slice(-2),

    MMMM: MONTHS_LONG[d.getMonth()]!,
    MMM: MONTHS_SHORT[d.getMonth()]!,
    MM: pad(d.getMonth() + 1),
    M: String(d.getMonth() + 1),

    dd: pad(d.getDate()),
    d: String(d.getDate()),

    HH: pad(h24),
    H: String(h24),
    hh: pad(h12),
    h: String(h12),

    mm: pad(d.getMinutes()),
    m: String(d.getMinutes()),

    ss: pad(d.getSeconds()),
    s: String(d.getSeconds()),

    a: h24 >= 12 ? 'PM' : 'AM',

    EEEE: DAYS_LONG[d.getDay()]!,
    EEE: DAYS_SHORT[d.getDay()]!,
  };

  return pattern.replace(
    /'([^']*)'|EEEE|EEE|yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|a/g,
    (match, quoted) => (quoted !== undefined ? quoted : (tokens[match] ?? match))
  );
}

export const DEFAULT_DATE_PATTERN = 'dd MMM, yy HH:mm:ss';

/* ✅ Unified helpers */

export const formatDateOnly = (iso?: string | null): string =>
  iso ? formatDate(iso, 'dd MMM yyyy') : 'N/A';

export const formatTimeOnly = (iso?: string | null): string =>
  iso ? formatDate(iso, 'HH:mm:ss') : '—';

export const formatDateTime24 = (iso?: string | null): string =>
  iso ? formatDate(iso, "dd MMM yyyy '|' HH:mm:ss") : '—';

export const formatDateTime12 = (iso?: string | null): string =>
  iso ? formatDate(iso, "dd MMM yyyy '|' hh:mm:ss a") : '—';

/**
 * Splits a formatted timestamp into the leading "date + hours:minutes" portion
 * and the trailing ":seconds(.ms)?(am/pm)?" tail. Tolerant of the various
 * patterns formatDate can emit (`HH:mm:ss`, `hh:mm:ss a`, etc.).
 *
 * The seconds tail is typically rendered in red per Figma so the user can
 * quickly spot sub-minute precision when comparing timestamps.
 */
export function splitSeconds(formatted: string): { head: string; tail: string } {
  const m = formatted.match(/^(.*\d{1,2}:\d{2})(:\d{2}(?:\.\d+)?\s*[A-Za-z]*)$/);
  if (!m || !m[1] || !m[2]) return { head: formatted, tail: '' };
  return { head: m[1], tail: m[2] };
}
