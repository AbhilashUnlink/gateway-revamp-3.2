import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectUserFormatType } from '@/store/slices/gatewayConfigSlice';
import type { FormatValue } from './types';

function normalizeFormat(value: unknown): FormatValue {
  return String(value ?? '').toLowerCase() === 'csv' ? 'csv' : 'excel';
}

/**
 * Tracks the chosen export format. Seeds from the user's preference
 * (`userFormatType`) and re-syncs when the preference loads — but only
 * until the user actively picks a format.
 */
export function useFormatSelection() {
  const userFormatType = useAppSelector(selectUserFormatType);
  const [format, setFormatState] = useState<FormatValue>(() => normalizeFormat(userFormatType));
  const formatTouchedRef = useRef(false);

  useEffect(() => {
    if (formatTouchedRef.current) return;
    if (!userFormatType) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormatState(normalizeFormat(userFormatType));
  }, [userFormatType]);

  const setFormat = (next: FormatValue) => {
    formatTouchedRef.current = true;
    setFormatState(next);
  };

  return { format, setFormat };
}
