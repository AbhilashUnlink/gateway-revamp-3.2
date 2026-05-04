import type { MfaGeneratePayload, SignInPayload, SignoutPayload } from '@/types/login/auth.types';
import { useFetchWrapper as Api } from '@/utils';

export const apiService = {
  onboarding: {
    getApplicantWorkflowrun: (params: { workflowRunId: string }) =>
      Api().get(`onboarding/applicant-workflowrun/${params.workflowRunId}`),
    postApplication: () => Api().post(`onboarding/application`),
    getApplication: () => Api().get(`onboarding/application`),
    postRegister: () => Api().post(`onboarding/register`),
    postResentOtp: () => Api().post(`onboarding/resent-otp`),
    postVerifyOtp: (data?: unknown) => Api().post(`onboarding/verify-otp`, data),
    postVerifyEmail: (data?: unknown) => Api().post(`onboarding/verify-email`, data),
    patchApplication: (data?: unknown) => Api().patch(`onboarding/application`, data),
    postApplicationSubmit: () => Api().post(`onboarding/application/submit`),
    getDownload: (params: { itemdocBinaryId?: string; documentDatadocBinaryId?: string }) =>
      Api().get(`onboarding/download/${params.documentDatadocBinaryId ?? params.itemdocBinaryId}`),
    postApplicationAddtlInfoReq: (data?: unknown) =>
      Api().post(`onboarding/application/addtl-info-req`, data),
    postApplicationAddtlInfoFulfil: (data?: unknown) =>
      Api().post(`onboarding/application/addtl-info-fulfil`, data),
    postApplicationRetryKyc: () => Api().post(`onboarding/application/retry-kyc`),
    postWebhookUpdateKycStatus: (data?: unknown) =>
      Api().post(`onboarding/webhook-update-kyc-status`, data),
  },

  dasconfig: {
    userPreferences: () => Api().get(`dasconfig/user-preferences`),
    gatewayConfiguration: () => Api().get(`dasconfig/gateway-configuration`),
    getSubsidiaryList: () => Api().get(`dasconfig/subsidiary-list`),
    postRulesUpsert: (data?: unknown) => Api().post(`dasconfig/rules/upsert`, data),
  },

  auth: {
    checkMfaExist: (data: SignInPayload) => Api().post(`auth/check-mfa-exist`, data),
    signIn: (data: SignInPayload) => Api().post(`auth/signIn`, data),
    mfaGenerate: (data: MfaGeneratePayload) => Api().post(`auth/mfa/generate`, data),
    refreshToken: (data?: unknown) => Api().post(`auth/refreshToken`, data),
    signOut: (payload: SignoutPayload) => Api().post(`auth/signOut`, payload),
    postMfaEmailVerify: (data?: unknown) => Api().post(`auth/mfa/email/verify`, data),
    postForgotPassword: (data?: unknown) => Api().post(`auth/forgotPassword`, data),
    postMfaVerifyGatewayOtp: (data?: unknown) => Api().post(`auth/mfa/verify/gateway/otp`, data),
    postMfaVerifyGatewayRegistrationOtp: (data?: unknown) =>
      Api().post(`auth/mfa/verify/gateway/registration/otp`, data),
    postForgotPasswordVerify: (data?: unknown) => Api().post(`auth/forgotPasswordVerify`, data),
    postChangePassword: (data?: unknown) => Api().post(`auth/change-password`, data),
  },

  hashcard: {
    postCheckHashcard: (data?: unknown) => Api().post(`hashcard/check-hashcard`, data),
    postAdd: (data?: unknown) => Api().post(`hashcard/add`, data),
  },

  reports: {
    getIntegrationAccessToken: () => Api().get(`reports/integration/access-token`),
  },

  webhook: {
    getGetWebhookDetails: () => Api().get(`webhook/getWebhookDetails`),
    postGetWebhookDetails: (data?: unknown) => Api().post(`webhook/getWebhookDetails`, data),
  },

  paybylink: {
    postImageUpload: (data?: unknown) => Api().post(`paybylink/image/upload`, data),
  },

  chargeback: {
    postUploadFile: (data?: unknown) => Api().post(`chargeback/uploadFile`, data),
    add: (data?: unknown) => Api().post(`chargeback/add`, data),
    postUpdateChargebackStatus: (data?: unknown) =>
      Api().post(`chargeback/updateChargebackStatus`, data),
    postMessage: (data?: unknown) => Api().post(`chargeback/message`, data),
    postChargebackPreferenceCreate: (data?: unknown) =>
      Api().post(`chargeback/chargeback-preference/create`, data),
    getFiles: (params: { val: string }) => Api().get(`chargeback/files/${params.val}`),
    patchUpdate: (data?: unknown) => Api().patch(`chargeback/update`, data),
  },

  transactions: {
    listV2: (payload: unknown) => Api().post(`transactions/listv2`, payload),
    getById: (params: { id: string }) => Api().get(`transactions/${params.id}`),
    getChargebackByTransactionId: (params: { transactionId: string }) =>
      Api().get(`chargeback/transactionId/${params.transactionId}`),
    postTransactionReportDownload: (data?: unknown) =>
      Api().post(`transactions/transaction-report/download`, data),
    getTransactionReportDownloadList: (params: { take: number; skip: number; TimeZone: string }) =>
      Api().get(
        `transactions/transaction-report/download-list?take=${params.take}&skip=${params.skip}&TimeZone=${encodeURIComponent(params.TimeZone)}`
      ),
    getTransactionReportDownloadByJobId: (params: { jobID: string }) =>
      Api().get(
        `transactions/transaction-report/download-report?jobID=${encodeURIComponent(params.jobID)}`
      ),
    postTransactionPresetFilterCreate: (data?: unknown) =>
      Api().post(`transactions/transaction-preset/filter/create`, data),
    getAllTransactionPresetFilters: () =>
      Api().get(`transactions/transaction-preset/filter/user/getAll`),
    deleteTransactionPresetFilter: (params: { uuid: string }) =>
      Api().post(`transactions/transaction-preset/filter/delete/${params.uuid}`),
    postTransactionReportPreferenceCreate: (data?: unknown) =>
      Api().post(`transactions/transaction-report-preference/create`, data),
    getAllTransactionColumnPreferences: () =>
      Api().get(`transactions/transaction-column-preference/getAll`),
    postTransactionColumnPreferenceCreate: (data?: unknown) =>
      Api().post(`transactions/transaction-column-preference/create`, data),
    postTransactionColumnPreferenceUpdate: (params: { uuid: string }, data?: unknown) =>
      Api().post(`transactions/transaction-column-preference/update/${params.uuid}`, data),
    postTransactionColumnPreferenceDelete: (params: { uuid: string }) =>
      Api().post(`transactions/transaction-column-preference/delete/${params.uuid}`),
    getTransactionColumnPreferenceById: (params: { uuid: string }) =>
      Api().get(`transactions/transaction-column-preference/${params.uuid}`),
    postVoid: (headers?: Record<string, string>, data?: unknown) =>
      Api().post(`transactions/void`, data, { headers }),
    capture: (headers?: Record<string, string>, data?: unknown) =>
      Api().post(`transactions/capture`, data, { headers }),
    refund: (headers?: Record<string, string>, data?: unknown) =>
      Api().post(`transactions/refund`, data, { headers }),
    postUpdateStatus: (data?: unknown) => Api().post(`transactions/update-status`, data),
    postTransactionDownloadingScheduleCreate: (data?: unknown) =>
      Api().post(`transactions/transaction-downloading-schedule/create`, data),
  },

  statements: {
    postStatementApprove: (data?: unknown) => Api().post(`statements/statement/approve`, data),
    putStatementHolidayList: (data?: unknown) =>
      Api().put(`statements/statement/holiday-list`, data),
    postS3UploadXlsx: (data?: unknown) => Api().post(`statements/s3/upload-xlsx`, data),
    postS3ChargebackGenerateSignedUrl: (data?: unknown) =>
      Api().post(`statements/s3/chargeback-generate-signed-url`, data),
    postStatement: (params: { endPoint: string }, data?: unknown) =>
      Api().post(`statements/statement/${params.endPoint}`, data),
    postStatementPreferenceCreate: (data?: unknown) =>
      Api().post(`statements/statement-preference/create`, data),
    postStatementRegenerate: (data?: unknown) =>
      Api().post(`statements/statement/regenerate`, data),
    postS3GenerateSignedUrl: (data?: unknown) =>
      Api().post(`statements/s3/generate-signed-url`, data),
  },

  entities: {
    patchProductUpdateDASMIDStatus: (data?: unknown) =>
      Api().patch(`entities/product/updateDASMIDStatus`, data),
    postUserManagementUserAdd: (data?: unknown) =>
      Api().post(`entities/user-management/user/add`, data),
    postRecurringPlanCreatePlan: (data?: unknown) =>
      Api().post(`entities/recurring/plan/createPlan`, data),
    patchRecurringSubscriptionEdit: (data?: unknown) =>
      Api().patch(`entities/recurring/subscription/edit`, data),
    postRecurringSubscriptionCreate: (data?: unknown) =>
      Api().post(`entities/recurring/subscription/create`, data),
    postResellerSendReferralEmail: (data?: unknown) =>
      Api().post(`entities/reseller/sendReferralEmail`, data),
    getProductTake10Skip0DASMID: (params: { DASMID: string }) =>
      Api().get(`entities/product/?take=10&skip=0&DASMID=${params.DASMID}`),
    getProductByDASMIDTerminalID: (params: { dasmid: string; terminalId: string }) =>
      Api().get(
        `entities/product/${encodeURIComponent(params.dasmid)}@@@${encodeURIComponent(params.terminalId)}/`
      ),
    getMerchantById: (params: { merchantId: string }) =>
      Api().get(`entities/merchant/${encodeURIComponent(params.merchantId)}/`),
    postMerchantDevicesCreate: (data?: unknown) =>
      Api().post(`entities/merchant/devices/create`, data),
    postMerchantCatalogCategories: (data?: unknown) =>
      Api().post(`entities/merchant/catalog/categories`, data),
    postMerchantCatalogProducts: (data?: unknown) =>
      Api().post(`entities/merchant/catalog/products`, data),
    postMerchantCatalogUploadProductsImages: (data?: unknown) =>
      Api().post(`entities/merchant/catalog/upload-products-images`, data),
    postMerchantMerchantIp: (data?: unknown) => Api().post(`entities/merchant/merchant-ip`, data),
    postMerchantWebhook: (data?: unknown) => Api().post(`entities/merchant/webhook`, data),
  },

  misc: {
    postEndpoint: (params: { transactions: string; data: string }, body?: unknown) =>
      Api().post(`/${params.transactions}${params.data}`, body),
  },

  ruleengine: {
    deleteEndpoint: (params: { ruleId: string }) => Api().delete(`rule-engine/${params.ruleId}`),
  },

  acquirers: {
    postAdd: (data?: unknown) => Api().post(`acquirers/add`, data),
    getByAcquirerMid: (params: { acquirerMid: string }) =>
      Api().get(`acquirers/acquirer-mid/${encodeURIComponent(params.acquirerMid)}`),
  },
};
