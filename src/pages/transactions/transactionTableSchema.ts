import type { ColumnConfig, TransactionRow } from '@/types/transactions/transaction.types';
import { STATUS } from '@/constants/transactions';

export interface SchemaContext {
  onRefIdClick?: (row: TransactionRow) => void;
}

/**
 * `filterAttributes[].id` is the BACKEND field name — it's what gets serialized
 * onto the wire as `{ field, operator, value }`. The UI label comes from
 * `labelKey` (i18n) and is fully decoupled from the id.
 */
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
      filterAttributes: [
        { id: 'transactionRefId', labelKey: 'table.transaction_ref_id', type: 'text' },
        { id: 'transactionId', labelKey: 'table.transaction_id', type: 'text' },
      ],
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
      filterAttributes: [
        {
          id: 'TransactionType',
          labelKey: 'table.transaction_type',
          type: 'multiSelect',
          options: [
            { value: 'AUTHORISATION', label: 'AUTHORISATION' },
            { value: 'PURCHASE', label: 'PURCHASE' },
            { value: 'CAPTURE', label: 'CAPTURE' },
            { value: 'VOIDAUTHORISATION', label: 'VOIDAUTHORISATION' },
            { value: 'REFUND', label: 'REFUND' },
          ],
        },
        {
          id: 'status',
          labelKey: 'table.status',
          type: 'multiSelect',
          optionsFromConfig: 'statuses',
          options: Object.entries(STATUS.TRANSACTION).map(([key, value]) => ({
            label: value,
            value: key,
          })),
        },
      ],
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
      filterAttributes: [
        { id: 'amount', labelKey: 'table.amount', type: 'number' },
        { id: 'fee', labelKey: 'table.fee', type: 'number' },
      ],
    },
    {
      id: 'dates',
      headerPrimaryKey: 'table.transaction_date',
      headerSecondaryKey: 'table.update_date',
      cellType: 'date',
      width: 240,
      accessorFn: (row) => ({ primary: row.transactionDate, secondary: row.updateDate }),
      filterAttributes: [
        { id: 'transactionDate', labelKey: 'table.transaction_date', type: 'dateRange' },
        { id: 'updatedDate', labelKey: 'table.update_date', type: 'dateRange' },
      ],
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
      filterAttributes: [
        {
          id: 'paymentScheme',
          labelKey: 'table.scheme',
          type: 'multiSelect',
          optionsFromConfig: 'paymentSchemes',
        },
        {
          id: 'paymentType',
          labelKey: 'table.payment_type',
          type: 'multiSelect',
          optionsFromConfig: 'paymentTypes',
        },
        { id: 'cardNumber', labelKey: 'table.card_number', type: 'text' },
      ],
    },
    {
      id: 'trackId',
      headerPrimaryKey: 'table.track_id',
      cellType: 'copy',
      width: 202,
      accessorFn: (row) => ({ primary: row.trackId }),
      filterAttributes: [{ id: 'trackId', labelKey: 'table.track_id', type: 'text' }],
    },
    {
      id: 'statementId',
      headerPrimaryKey: 'table.statement_id',
      cellType: 'action',
      width: 208,
      accessorFn: (row) => ({ primary: row.statementId, downloadable: true }),
      filterAttributes: [
        { id: 'statementId', labelKey: 'table.statement_id', type: 'text', hideFromFilter: true },
      ],
    },
    {
      id: 'acquirer',
      headerPrimaryKey: 'table.acquirer',
      cellType: 'text',
      width: 180,
      accessorFn: (row) => ({ primary: row.acquirer }),
      filterAttributes: [
        {
          id: 'AcquirerCode',
          labelKey: 'table.acquirer',
          type: 'multiSelect',
          optionsFromConfig: 'acquirers',
        },
      ],
    },
    {
      id: 'acquirerMid',
      headerPrimaryKey: 'table.acquirer_mid',
      cellType: 'copy',
      width: 188,
      accessorFn: (row) => ({ primary: row.acquirerMid }),
      filterAttributes: [
        {
          id: 'acquirerMid',
          labelKey: 'table.acquirer_mid',
          type: 'multiSelect',
          optionsFromConfig: 'acquirerMIDData',
        },
      ],
    },
    {
      id: 'dasMid',
      headerPrimaryKey: 'table.das_mid',
      cellType: 'text',
      width: 140,
      accessorFn: (row) => ({ primary: row.dasMid }),
      filterAttributes: [
        {
          id: 'dasMid',
          labelKey: 'table.das_mid',
          type: 'multiSelect',
          optionsFromConfig: 'dasmidOptions',
        },
      ],
    },
    {
      id: 'authCode',
      headerPrimaryKey: 'table.auth_code',
      cellType: 'text',
      width: 148,
      accessorFn: (row) => ({ primary: row.authCode }),
      filterAttributes: [{ id: 'authCode', labelKey: 'table.auth_code', type: 'text' }],
    },
    {
      id: 'productType',
      headerPrimaryKey: 'table.product_type',
      cellType: 'text',
      width: 152,
      accessorFn: (row) => ({ primary: row.productType }),
      filterAttributes: [{ id: 'productType', labelKey: 'table.product_type', type: 'text' }],
    },
    {
      id: 'integrationMethod',
      headerPrimaryKey: 'table.integration_method',
      cellType: 'text',
      width: 200,
      accessorFn: (row) => ({ primary: row.integrationMethod }),
      filterAttributes: [
        { id: 'integrationMethod', labelKey: 'table.integration_method', type: 'text' },
      ],
    },
    {
      id: 'integrationType',
      headerPrimaryKey: 'table.integration_type',
      cellType: 'text',
      width: 200,
      accessorFn: (row) => ({ primary: row.integrationType }),
      filterAttributes: [
        { id: 'integrationType', labelKey: 'table.integration_type', type: 'text' },
      ],
    },
    {
      id: 'merchantAccount',
      headerPrimaryKey: 'table.merchant_account',
      cellType: 'text',
      width: 195,
      accessorFn: (row) => ({ primary: row.merchantAccount }),
      filterAttributes: [
        {
          id: 'LegalName',
          labelKey: 'table.merchant_account',
          type: 'multiSelect',
          optionsFromConfig: 'merchantData',
        },
      ],
    },
    {
      id: 'merchantAccountEn',
      headerPrimaryKey: 'table.merchant_account_en',
      cellType: 'text',
      width: 265,
      accessorFn: (row) => ({ primary: row.merchantAccountEn }),
      filterAttributes: [
        { id: 'legalNameInEnglish', labelKey: 'table.merchant_account_en', type: 'text' },
      ],
    },
    {
      id: 'merchantRefId',
      headerPrimaryKey: 'table.merchant_ref_id',
      cellType: 'copy',
      width: 172,
      accessorFn: (row) => ({ primary: row.merchantRefId }),
      filterAttributes: [
        { id: 'merchantRefNumber', labelKey: 'table.merchant_ref_id', type: 'text' },
      ],
    },
    {
      id: 'subscriptionId',
      headerPrimaryKey: 'table.subscription_id',
      cellType: 'text',
      width: 208,
      accessorFn: (row) => ({ primary: row.subscriptionId }),
      filterAttributes: [{ id: 'subscriptionId', labelKey: 'table.subscription_id', type: 'text' }],
    },
    {
      id: 'terminalId',
      headerPrimaryKey: 'table.terminal_id',
      cellType: 'copy',
      width: 160,
      accessorFn: (row) => ({ primary: row.terminalId }),
      filterAttributes: [{ id: 'terminalId', labelKey: 'table.terminal_id', type: 'text' }],
    },
    {
      id: 'terminalName',
      headerPrimaryKey: 'table.terminal_name',
      cellType: 'text',
      width: 165,
      accessorFn: (row) => ({ primary: row.terminalName }),
      filterAttributes: [{ id: 'terminalName', labelKey: 'table.terminal_name', type: 'text' }],
    },
    {
      id: 'linkName',
      headerPrimaryKey: 'table.link_name',
      cellType: 'text',
      width: 160,
      accessorFn: (row) => ({ primary: row.linkName }),
      filterAttributes: [{ id: 'pblLinkName', labelKey: 'table.link_name', type: 'text' }],
    },
  ];
}
