import { useCallback } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectUserDateFormat } from '@/store/slices/gatewayConfigSlice';
import { DEFAULT_DATE_PATTERN, formatDate } from '@/utils/formatDate';

/**
 * Returns a memoized formatter that applies the signed-in user's preferred
 * `dateFormatType` (from `userPreference`) — falling back to a sensible
 * default when the preference hasn't loaded yet.
 */
export function useUserDateFormat() {
  const pattern = useAppSelector(selectUserDateFormat) ?? DEFAULT_DATE_PATTERN;
  return useCallback(
    (input: string | Date | null | undefined) => formatDate(input, pattern),
    [pattern]
  );
}
