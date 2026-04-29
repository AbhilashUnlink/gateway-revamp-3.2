import dotenv from 'dotenv';
dotenv.config();

export const TEST_CONFIG = {
  credentials: {
    username: process.env.TEST_USERNAME ?? '',
    password: process.env.TEST_PASSWORD ?? '',
  },
  routes: {
    login: '/login',
    transactions: '/transactions',
    transactionDetails: (refId: string) => `/transactions/${refId}`,
  },
  transactionCount: Number(process.env.TRANSACTION_COUNT ?? 20),
  scroll: {
    maxAttempts: 80,
    stepPx: 800,
    settleMs: 250,
    idleAttemptsBeforeStop: 4,
  },
} as const;

export type ActionButton = 'refund' | 'capture' | 'void' | 'dispute' | 'editStatus';

export const ACTION_LABELS: Record<ActionButton, RegExp> = {
  refund: /^refund$/i,
  capture: /^capture$/i,
  void: /^void$/i,
  dispute: /^dispute$/i,
  editStatus: /^edit\s*status$/i,
};
