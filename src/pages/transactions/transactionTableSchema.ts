import type { ColumnConfig, TransactionRow } from '@/types/transactions/transaction.types';

export interface SchemaContext {
  onRefIdClick?: (row: TransactionRow) => void;
}

export function buildTransactionColumns({ onRefIdClick }: SchemaContext = {}): ColumnConfig[] {
  return [
    {
      id: 'transactionRefId',
      headerPrimaryKey: 'table.transaction_ref_id',
      headerSecondaryKey: 'table.transaction_id',
      cellType: 'link-copy',
      width: 256,
      accessorFn: (row) => ({ primary: row.transactionRefId, secondary: row.transactionId }),
      onPrimaryClick: onRefIdClick,
    },
    {
      id: 'typeStatus',
      headerPrimaryKey: 'table.transaction_type',
      headerSecondaryKey: 'table.status',
      cellType: 'status',
      width: 190,
      accessorFn: (row) => ({
        primary: row.transactionType,
        status: row.status,
        secondary: row.status,
      }),
    },
    {
      id: 'amountFee',
      headerPrimaryKey: 'table.amount',
      headerSecondaryKey: 'table.fee',
      cellType: 'multi',
      width: 160,
      accessorFn: (row) => ({
        primary: row.currency ? `${row.currency} ${row.amount}` : row.amount,
        secondary: row.currency ? `${row.currency} ${row.fee}` : row.fee,
      }),
    },
    {
      id: 'dates',
      headerPrimaryKey: 'table.transaction_date',
      headerSecondaryKey: 'table.update_date',
      cellType: 'date',
      width: 240,
      accessorFn: (row) => ({ primary: row.transactionDate, secondary: row.updateDate }),
    },
    {
      id: 'paymentMethod',
      headerPrimaryKey: 'table.payment_type',
      headerSecondaryKey: 'table.scheme_card_number',
      cellType: 'payment',
      width: 200,
      accessorFn: (row) => ({
        scheme: row.paymentScheme,
        secondary: row.paymentType,
        primary: row.cardNumber,
      }),
    },
    {
      id: 'trackId',
      headerPrimaryKey: 'table.track_id',
      cellType: 'copy',
      width: 202,
      accessorFn: (row) => ({ primary: row.trackId }),
    },
    {
      id: 'statementId',
      headerPrimaryKey: 'table.statement_id',
      cellType: 'action',
      width: 208,
      accessorFn: (row) => ({ primary: row.statementId, downloadable: true }),
    },
    {
      id: 'acquirer',
      headerPrimaryKey: 'table.acquirer',
      cellType: 'text',
      width: 180,
      accessorFn: (row) => ({ primary: row.acquirer }),
    },
    {
      id: 'acquirerMid',
      headerPrimaryKey: 'table.acquirer_mid',
      cellType: 'copy',
      width: 188,
      accessorFn: (row) => ({ primary: row.acquirerMid }),
    },
    {
      id: 'dasMid',
      headerPrimaryKey: 'table.das_mid',
      cellType: 'text',
      width: 140,
      accessorFn: (row) => ({ primary: row.dasMid }),
    },
    {
      id: 'authCode',
      headerPrimaryKey: 'table.auth_code',
      cellType: 'text',
      width: 148,
      accessorFn: (row) => ({ primary: row.authCode }),
    },
    {
      id: 'productType',
      headerPrimaryKey: 'table.product_type',
      cellType: 'text',
      width: 152,
      accessorFn: (row) => ({ primary: row.productType }),
    },
    {
      id: 'integrationMethod',
      headerPrimaryKey: 'table.integration_method',
      cellType: 'text',
      width: 200,
      accessorFn: (row) => ({ primary: row.integrationMethod }),
    },
    {
      id: 'integrationType',
      headerPrimaryKey: 'table.integration_type',
      cellType: 'text',
      width: 200,
      accessorFn: (row) => ({ primary: row.integrationType }),
    },
    {
      id: 'merchantAccount',
      headerPrimaryKey: 'table.merchant_account',
      cellType: 'text',
      width: 195,
      accessorFn: (row) => ({ primary: row.merchantAccount }),
    },
    {
      id: 'merchantAccountEn',
      headerPrimaryKey: 'table.merchant_account_en',
      cellType: 'text',
      width: 265,
      accessorFn: (row) => ({ primary: row.merchantAccountEn }),
    },
    {
      id: 'merchantRefId',
      headerPrimaryKey: 'table.merchant_ref_id',
      cellType: 'copy',
      width: 172,
      accessorFn: (row) => ({ primary: row.merchantRefId }),
    },
    {
      id: 'subscriptionId',
      headerPrimaryKey: 'table.subscription_id',
      cellType: 'text',
      width: 208,
      accessorFn: (row) => ({ primary: row.subscriptionId }),
    },
    {
      id: 'terminalId',
      headerPrimaryKey: 'table.terminal_id',
      cellType: 'copy',
      width: 160,
      accessorFn: (row) => ({ primary: row.terminalId }),
    },
    {
      id: 'terminalName',
      headerPrimaryKey: 'table.terminal_name',
      cellType: 'text',
      width: 165,
      accessorFn: (row) => ({ primary: row.terminalName }),
    },
    {
      id: 'linkName',
      headerPrimaryKey: 'table.link_name',
      cellType: 'text',
      width: 160,
      accessorFn: (row) => ({ primary: row.linkName }),
    },
  ];
}
