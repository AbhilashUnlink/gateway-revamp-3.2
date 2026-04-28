export interface ChargebackStatusEntry {
  ChargeBackId: string;
  Status: string;
  Comment: string | null;
  FilePath: string | null;
  KeyName: string | null;
  CreatedBy: string | null;
  UpdatedBy: string | null;
  CreatedAt: string;
  Amount: number;
  Currency: string;
}

export type ChargebackStageKey =
  | 'FirstChargeback'
  | 'SecondChargeback'
  | 'AutoRepresentment'
  | 'PreArbitration'
  | 'Arbitration';

export type ChargebackStageGroup = Partial<Record<ChargebackStageKey, ChargebackStatusEntry[]>> &
  Record<string, ChargebackStatusEntry[] | undefined>;

export interface ChargebackHistoryResponse {
  statusCode: number;
  message: string;
  messageCode: string;
  success: boolean;
  data: ChargebackStageGroup[];
}

export interface ChargebackCase {
  stageKey: string;
  stageLabel: string;
  caseId: string;
  amount: number;
  currency: string;
  issuedAt: string;
  arn: string | null;
  reasonDescription: string | null;
  statusTone: 'open' | 'closed';
  statusLabel: string;
  rawLatestStatus: string;
}
