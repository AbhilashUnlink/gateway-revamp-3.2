import { useCallback, useState } from 'react';

export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
  const [state, setState] = useState(initialValue);
  const toggle = useCallback(() => setState((s) => !s), []);
  const set = useCallback((value: boolean) => setState(value), []);
  return [state, toggle, set];
}
