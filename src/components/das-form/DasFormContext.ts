import { createContext, useContext } from 'react';
import type { FormSchema } from '@/types/form/form.types';

export interface DasFormContextValue {
  schema: FormSchema;
  loading?: boolean;
  onCancel?: () => void;
}

export const DasFormContext = createContext<DasFormContextValue | null>(null);

export function useDasFormContext(): DasFormContextValue {
  const ctx = useContext(DasFormContext);
  if (!ctx) throw new Error('useDasFormContext must be used inside <DasForm>');
  return ctx;
}
