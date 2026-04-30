import type { ColumnConfig, TransactionRow } from '@/types/transactions/transaction.types';
import { STATUS } from '@/constants/transactions';

/**
 * Map between column `id` (camelCase, what the table uses) and the backend
 * display name in the saved-preference `columns_json` array.
 */
export const TRANSACTION_COLUMN_DISPLAY_NAMES: Record<string, string> = {
  transactionRefId: 'Transaction Ref ID',
  typeStatus: 'Transaction Type',
  amountFee: 'Amount',
  dates: 'Transaction Date',
  paymentMethod: 'Payment Type',
  trackId: 'Track ID',
  statementId: 'Statement ID',
  acquirer: 'Acquirer',
  acquirerMid: 'Acquirer MID',
  dasMid: 'DASMID',
  authCode: 'Auth Code',
  productType: 'Product Type',
  integrationMethod: 'Integration Method',
  integrationType: 'Integration Type',
  merchantAccount: 'Merchant Account',
  merchantAccountEn: 'Merchant Account (English)',
  merchantRefId: 'Merchant Ref ID',
  subscriptionId: 'Subscription ID',
  terminalId: 'Terminal ID',
  terminalName: 'Terminal Name',
  linkName: 'Link Name',
};

const ID_BY_DISPLAY_NAME = Object.fromEntries(
  Object.entries(TRANSACTION_COLUMN_DISPLAY_NAMES).map(([id, name]) => [name, id])
);

export const transactionColumnIdToDisplayName = (id: string): string =>
  TRANSACTION_COLUMN_DISPLAY_NAMES[id] ?? id;

export const transactionDisplayNameToColumnId = (name: string): string | undefined =>
  ID_BY_DISPLAY_NAME[name];

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
      sticky: true,
      accessorFn: (row) => ({ primary: row.transactionRefId, secondary: row.transactionId }),
      onPrimaryClick: onRefIdClick,
      filterAttributes: [
        { id: 'uuid', labelKey: 'table.transaction_ref_id', type: 'text' },
        { id: 'transactionId', labelKey: 'table.transaction_id', type: 'text' },
      ],
    },
    {
      id: 'typeStatus',
      headerPrimaryKey: 'table.transaction_type',
      headerSecondaryKey: 'table.status',
      cellType: 'status',
      width: 190,
      sticky: true,
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
      sticky: true,

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
        // { id: 'fee', labelKey: 'table.fee', type: 'number' },
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
        { id: 'Date', labelKey: 'table.transaction_date', type: 'dateRange' },
        { id: 'UpdatedDate', labelKey: 'table.update_date', type: 'dateRange' },
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
          id: 'Scheme',
          labelKey: 'transaction_details_page.scheme',
          type: 'multiSelect',
          options: [
            { label: 'VISA', value: 'VISA' },
            { label: 'MASTERCARD', value: 'MASTERCARD' },
            { label: 'AMEX', value: 'AMEX' },
            { label: 'JCB', value: 'JCB' },
            { label: 'DINERSCLUB', value: 'DINERS' },
          ],
        },
        {
          id: 'paymentType',
          labelKey: 'table.payment_type',
          type: 'select',
          options: [
            {
              label: 'CARDPAYMENT',
              value: 'CARDPAYMENT',
            },
            {
              label: 'GCASH',
              value: 'gcash',
            },
            {
              label: 'PAYPAY',
              value: 'paypay',
            },
            {
              label: 'PAYEASY',
              value: 'payeasy',
            },
            {
              label: 'KONBINI',
              value: 'konbini',
            },
            {
              label: 'APPLEPAY',
              value: 'applepay',
            },
            {
              label: 'GOOGLEPAY',
              value: 'googlepay',
            },
            {
              label: 'DASPAY',
              value: 'daspay',
            },
          ],
        },
        { id: 'cardNumber', labelKey: 'transaction_details_page.card_number', type: 'text' },
      ],
    },
    {
      id: 'trackId',
      headerPrimaryKey: 'table.track_id',
      cellType: 'copy',
      width: 202,
      accessorFn: (row) => ({ primary: row.trackId }),
      filterAttributes: [{ id: 'trackID', labelKey: 'table.track_id', type: 'text' }],
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
      filterAttributes: [
        {
          id: 'ProductType',
          labelKey: 'table.product_type',
          type: 'multiSelect',
          options: [
            { label: 'ECOM', value: 'ECOM' },
            { label: 'MOTO', value: 'MOTO' },
            { label: 'QR', value: 'QR' },
            { label: 'PBL', value: 'PBL' },
            { label: 'SUBSCRIPTION', value: 'SUBSCRIPTION' },
            { label: 'SCHEDULER', value: 'SCHEDULER' },
            { label: 'SOFTPOS', value: 'SOFTPOS' },
          ],
        },
      ],
    },
    {
      id: 'integrationMethod',
      headerPrimaryKey: 'table.integration_method',
      cellType: 'text',
      width: 200,
      accessorFn: (row) => ({ primary: row.integrationMethod }),
      filterAttributes: [
        {
          id: 'has3DS',
          labelKey: 'table.integration_method',
          type: 'select',
          options: [
            { label: '3DS', value: 'true' },
            { label: 'Non 3DS', value: 'false' },
          ],
        },
      ],
    },
    {
      id: 'integrationType',
      headerPrimaryKey: 'table.integration_type',
      cellType: 'text',
      width: 200,
      accessorFn: (row) => ({ primary: row.integrationType }),
      filterAttributes: [
        {
          id: 'integrationType',
          labelKey: 'table.integration_type',
          type: 'select',
          options: [
            { label: 'HOSTED PAYMENTS PAGE', value: 'HPP' },
            { label: 'SERVER TO SERVER', value: 'SERVERTOSERVERAPI' },
          ],
        },
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
