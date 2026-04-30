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

/**
 * Token-based date formatter (date-fns subset). Supported tokens:
 *   yyyy yy MMMM MMM MM M dd d HH H hh h mm m ss s a EEEE EEE
 * Quoted segments are preserved verbatim (e.g. `'on'` → on).
 * Falls back to the input string when parsing fails so cells never blank out.
 */
export function formatDate(input: string | Date | null | undefined, pattern: string): string {
  if (!input) return '';
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) {
    // Try ISO-ish recovery (space → T) before giving up.
    if (typeof input === 'string') {
      const retry = new Date(input.replace(' ', 'T'));
      if (!isNaN(retry.getTime())) return formatDate(retry, pattern);
      return input;
    }
    return '';
  }

  const h24 = d.getHours();
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;

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

  // Longer tokens listed first so `MMMM` wins over `MMM`/`MM`/`M`.
  return pattern.replace(
    /'([^']*)'|EEEE|EEE|yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|a/g,
    (match, quoted) => (quoted !== undefined ? quoted : (tokens[match] ?? match))
  );
}

export const DEFAULT_DATE_PATTERN = 'dd MMM, yy HH:mm:ss';
