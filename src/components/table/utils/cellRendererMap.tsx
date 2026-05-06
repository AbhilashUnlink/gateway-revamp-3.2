import type { ReactNode } from 'react';
import type { CellData, CellType } from '@/types/transactions/transaction.types';
import { TextCell } from '../cells/TextCell';
import { MultiLineCell } from '../cells/MultiLineCell';
import { StatusCell } from '../cells/StatusCell';
import { CopyCell } from '../cells/CopyCell';
import { ActionCell } from '../cells/ActionCell';
import { DateCell } from '../cells/DateCell';
import { PaymentCell } from '../cells/PaymentCell';
import { CountCell } from '../cells/CountCell';
import { TagCell } from '../cells/TagCell';

type CellRenderer = (data: CellData, onPrimaryClick?: () => void) => ReactNode;

export const cellRendererMap: Record<CellType, CellRenderer> = {
  text: (data) => <TextCell data={data} />,
  multi: (data) => <MultiLineCell data={data} />,
  status: (data) => <StatusCell data={data} />,
  copy: (data) => <CopyCell data={data} />,
  'link-copy': (data, onPrimaryClick) => (
    <CopyCell data={data} underline onPrimaryClick={onPrimaryClick} />
  ),
  action: (data) => <ActionCell data={data} />,
  date: (data) => <DateCell data={data} />,
  payment: (data) => <PaymentCell data={data} />,
  count: (data) => <CountCell data={data} />,
  tag: (data) => <TagCell data={data} />,
};
