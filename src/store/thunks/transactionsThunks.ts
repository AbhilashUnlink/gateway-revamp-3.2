import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/utils/apiService';
import type {
  TableApiPayload,
  TransactionListParams,
  TransactionRow,
} from '@/types/transactions/transaction.types';
import type {
  TransactionApiRecord,
  TransactionListApiResponse,
} from '@/types/transactions/transactionApi.types';

export const fetchTransactionsList = createAsyncThunk(
  'transactions/fetchList',
  async (params: TransactionListParams, thunkAPI) => {
    try {
      const payload: TableApiPayload = {
        take: params.limit,
        skip: (params.page - 1) * params.limit,
        TimeZone: params.timeZone ?? 'Asia/Calcutta',
        filter: params.filters ?? [],
        ...(params.statsCurrency ? { StatsCurrency: params.statsCurrency } : {}),
      };

      const res = await apiService.transactions.listV2(payload);
      const responseData = res.data as TransactionListApiResponse;
      const listData = responseData?.data;

      let parsedRawRows: TransactionApiRecord[] = [];
      try {
        const parsed: unknown = JSON.parse(listData?.records || '[]');
        parsedRawRows = Array.isArray(parsed)
          ? (parsed as TransactionApiRecord[])
          : ((parsed as { records?: TransactionApiRecord[] }).records ?? []);
      } catch (e) {
        console.error('JSON parse error', e);
      }

      const rows: TransactionRow[] = parsedRawRows.map((r) => ({
        id: String(r['Transaction ID'] ?? ''),
        transactionRefId: String(r['Transaction Ref ID'] ?? ''),
        transactionId: String(r['Transaction ID'] ?? ''),
        transactionType: String(r['Transaction Type'] ?? ''),
        status: String(r['Status'] ?? ''),
        currency: String(r['Currency'] ?? ''),
        amount: String(r['Amount'] ?? ''),
        fee: String(r['Fees'] ?? ''),
        transactionDate: String(r['Transaction Date'] ?? ''),
        updateDate: String(r['Updated Date'] ?? ''),
        paymentScheme: String(r['Scheme'] ?? ''),
        paymentType: String(r['Payment Type'] ?? ''),
        cardNumber: String(r['Card Number'] ?? ''),
        trackId: String(r['Track ID'] ?? ''),
        statementId: String(r['Statement ID'] ?? ''),
        acquirer: String(r['Acquirer'] ?? ''),
        acquirerMid: String(r['Acquirer MID'] ?? ''),
        dasMid: String(r['DASMID'] ?? ''),
        authCode: String(r['Auth Code'] ?? ''),
        productType: String(r['Product Type'] ?? ''),
        integrationMethod: String(r['Integration Method'] ?? ''),
        integrationType: String(r['Integration Type'] ?? ''),
        merchantAccount: String(r['Merchant Account'] ?? ''),
        merchantAccountEn: String(r['Merchant Account (English)'] ?? ''),
        merchantRefId: String(r['Merchant Ref ID'] ?? ''),
        subscriptionId: String(r['Subscription ID'] ?? ''),
        terminalId: String(r['Terminal ID'] ?? ''),
        terminalName: String(r['Terminal Name'] ?? ''),
        linkName: String(r['Link Name'] ?? ''),
      }));

      const totalCount = listData?.total_count ?? 0;
      const skip = (params.page - 1) * params.limit;
      const hasMore =
        listData?.hasMore ??
        (rows.length > 0 &&
          (totalCount > 0 ? skip + rows.length < totalCount : rows.length === params.limit));

      return {
        rows,
        hasMore,
        page: params.page,
        stats: {
          totalCount: listData?.total_count ?? '0',
          totalAmount: listData?.total_amount ?? '0',
          totalSales: listData?.total_sales ?? '0',
          totalRefund: listData?.total_refund ?? '0',
          approvalRatio: listData?.approval_ratio ?? '0',
          currency: listData?.currency ?? 'USD',
        },
      };
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

export const fetchTransactionById = createAsyncThunk(
  'transactions/fetchById',
  async (params: { id: string }, thunkAPI) => {
    try {
      const res = await apiService.transactions.getById({ id: params.id });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

export const downloadTransactionReport = createAsyncThunk(
  'transactions/downloadReport',
  async (payload: unknown, thunkAPI) => {
    try {
      const res = await apiService.transactions.postTransactionReportDownload(payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);
