import type { TFunction } from 'i18next';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';
import type { InfoSectionConfig, LifecycleSummary } from '../types';
import { formatCurrency } from './formatters';

const PARTIAL_REFUND_STATES = new Set(['PARTIALLYREFUNDED', 'PARTIALLY_REFUNDED']);

const deriveIntegrationMethod = (data: TransactionDetailsData): string =>
  data.ThreeDSecureInfo ? '3DS' : 'Non 3DS';

const computeRemaining = (data: TransactionDetailsData): string | null => {
  if (!Array.isArray(data.TransactionHistory) || data.TransactionHistory.length === 0) return null;
  const refunded = data.TransactionHistory.filter((h) => /refund/i.test(h.event)).reduce(
    (sum, h) => sum + (Number(h.amount) || 0),
    0
  );
  const remaining = (Number(data.Amount) || 0) - refunded;
  return formatCurrency(data.CurrencyCode, remaining);
};

export function buildLifecycleSummary(
  data: TransactionDetailsData,
  t: TFunction
): LifecycleSummary {
  const status = (data.Status ?? '').toUpperCase();
  const event = (data.Event ?? '').toUpperCase();
  const lifecycleLabel = PARTIAL_REFUND_STATES.has(status)
    ? t('transaction_details_page.lifecycle_partially_refunded')
    : (data.Status ?? data.Event ?? event);
  return { lifecycleLabel, balanceLabel: computeRemaining(data) };
}

export function buildSections(data: TransactionDetailsData, t: TFunction): InfoSectionConfig[] {
  const txCurrency = data.CurrencyCode ?? '';
  const fee = formatCurrency(txCurrency, undefined);

  return [
    {
      id: 'transaction',
      titleKey: 'transaction_details_page.section_transaction_info',
      fields: [
        {
          label: t('transaction_details_page.transaction_id'),
          value: data.TransactionID,
          copyable: true,
        },
        {
          label: t('transaction_details_page.transaction_ref_id'),
          value: data.TransactionRefID,
          copyable: true,
        },
        {
          label: t('transaction_details_page.transaction_type'),
          badge: { label: data.TransactionType ?? '—', tone: 'neutral' },
        },
        { label: t('transaction_details_page.track_id'), value: data.trackID, copyable: true },
        {
          label: t('transaction_details_page.amount'),
          value: formatCurrency(txCurrency, data.Amount),
        },
        { label: t('transaction_details_page.currency'), value: txCurrency || null },
        {
          label: t('transaction_details_page.status'),
          badge: { label: data.Status ?? '—', tone: 'success' },
        },
        { label: t('transaction_details_page.transaction_date'), value: data.Date },
        { label: t('transaction_details_page.update_date'), value: data.UpdatedDate },
        {
          label: t('transaction_details_page.response_code'),
          value: data.Response,
          copyable: true,
        },
        { label: t('transaction_details_page.auth_code'), value: data.AuthCode, copyable: true },
        { label: t('transaction_details_page.cvv_response'), value: data.CVVResponse },
        { label: t('transaction_details_page.gateway_response'), value: data.GatewayError },
        { label: t('transaction_details_page.transaction_fee'), value: fee },
        { label: t('transaction_details_page.transaction_processing_fee'), value: fee },
        { label: t('transaction_details_page.memo'), value: data.Memo, copyable: true },
        { label: t('transaction_details_page.request_id'), value: data.RequestID, copyable: true },
        {
          label: t('transaction_details_page.statement_id'),
          value: data.trackID,
          copyable: true,
          downloadable: true,
        },
        { label: t('transaction_details_page.amount_in_settlement_currency'), value: null },
        { label: t('transaction_details_page.customer_interaction'), value: data.ProductType },
      ],
    },
    {
      id: 'merchant',
      titleKey: 'transaction_details_page.section_merchant_info',
      fields: [
        {
          label: t('transaction_details_page.merchant_account'),
          value: data.Merchant,
          copyable: true,
        },
        {
          label: t('transaction_details_page.merchant_account_en'),
          value: data.LegalNameInEnglish,
          copyable: true,
        },
        {
          label: t('transaction_details_page.merchant_ref_id'),
          value: data.MerchantRefNumber,
          copyable: true,
        },
        {
          label: t('transaction_details_page.merchant_id'),
          value: data.MerchantID,
          copyable: true,
        },
        { label: t('transaction_details_page.merchant_ip'), value: data.MerchantIP },
        {
          label: t('transaction_details_page.merchant_category_code'),
          value: data.MerchantCategoryCode,
        },
        { label: t('transaction_details_page.das_mid'), value: data.DASMID, copyable: true },
        { label: t('transaction_details_page.product_type'), value: data.ProductType },
        { label: t('transaction_details_page.acquirer'), value: data.AcquirerCode },
        {
          label: t('transaction_details_page.acquirer_mid'),
          value: data.AcquirerMID,
          copyable: true,
        },
        {
          label: t('transaction_details_page.acquirer_reference_number'),
          value: data.AcquirerReferenceNumber,
          copyable: true,
        },
        {
          label: t('transaction_details_page.integration_method'),
          value: deriveIntegrationMethod(data),
        },
        { label: t('transaction_details_page.integration_type'), value: data.PaymentType },
        {
          label: t('transaction_details_page.terminal_id'),
          value: data.TerminalID,
          copyable: true,
        },
        { label: t('transaction_details_page.terminal_name'), value: data.TerminalName },
        { label: t('transaction_details_page.link_name'), value: data.PBLLinkName },
      ],
    },
    {
      id: 'payment',
      titleKey: 'transaction_details_page.section_payment_card_info',
      fields: [
        { label: t('transaction_details_page.payment_type'), value: data.PaymentType },
        {
          label: t('transaction_details_page.card_number'),
          value: data.CardNumber,
          copyable: true,
        },
        { label: t('transaction_details_page.expiry_date'), value: data.ExpiryDate },
        { label: t('transaction_details_page.scheme'), value: data.Scheme },
        { label: t('transaction_details_page.card_holder'), value: data.CardHolder },
        {
          label: t('transaction_details_page.hash_card_number'),
          value: data.HashCardNumber,
          copyable: true,
        },
        {
          label: t('transaction_details_page.email_address'),
          value: data.EmailAddress,
          copyable: true,
        },
        { label: t('transaction_details_page.phone_number'), value: data.Phone, copyable: true },
        { label: t('transaction_details_page.billing_country'), value: data.BillingCountry },
        { label: t('transaction_details_page.billing_postcode'), value: data.BillingPostcode },
        { label: t('transaction_details_page.billing_address'), value: data.BillingAddress },
        { label: t('transaction_details_page.billing_city'), value: data.BillingCity },
        { label: t('transaction_details_page.shipping_country'), value: data.ShippingCountry },
        { label: t('transaction_details_page.shipping_postcode'), value: data.ShippingPostcode },
        { label: t('transaction_details_page.shipping_address'), value: data.ShippingAddress },
        { label: t('transaction_details_page.shipping_city'), value: data.ShippingCity },
      ],
    },
    {
      id: 'subscription',
      titleKey: 'transaction_details_page.section_subscription_info',
      fields: [
        {
          label: t('transaction_details_page.subscription_id'),
          value: data.SubscriptionDetails?.SubscriptionID,
          copyable: true,
        },
        {
          label: t('transaction_details_page.subscription_plan'),
          value: data.SubscriptionDetails?.Plan,
        },
        {
          label: t('transaction_details_page.billing_cycle'),
          value: data.SubscriptionDetails?.BillingCycle,
        },
        {
          label: t('transaction_details_page.next_billing'),
          value: data.SubscriptionDetails?.NextBilling,
        },
        {
          label: t('transaction_details_page.cycle_billed'),
          value: data.SubscriptionDetails?.CycleBilled,
        },
        {
          label: t('transaction_details_page.subscription_status'),
          badge: data.SubscriptionDetails?.Status
            ? { label: data.SubscriptionDetails.Status, tone: 'success' }
            : undefined,
          value: data.SubscriptionDetails ? null : '—',
        },
      ],
    },
    {
      id: 'browser',
      titleKey: 'transaction_details_page.section_browser_info',
      fields: [
        { label: t('transaction_details_page.accept_header'), value: null },
        { label: t('transaction_details_page.screen_color_depth'), value: null },
        { label: t('transaction_details_page.java_enabled'), value: null },
        { label: t('transaction_details_page.language'), value: null },
        { label: t('transaction_details_page.screen_height'), value: null },
        { label: t('transaction_details_page.screen_width'), value: null },
        { label: t('transaction_details_page.challenge_window'), value: null },
        { label: t('transaction_details_page.user_agent'), value: null },
        { label: t('transaction_details_page.customer_ip'), value: data.CustomerIP },
        {
          label: t('transaction_details_page.transaction_timezone'),
          value: data.TransactionTimezone,
        },
      ],
    },
    {
      id: 'additional',
      titleKey: 'transaction_details_page.section_additional_info',
      fields: [
        { label: t('transaction_details_page.bin'), value: data.BIN },
        { label: t('transaction_details_page.issuing_bank'), value: data.IssuingBank },
        { label: t('transaction_details_page.issuing_country'), value: data.IssuingCountry },
        { label: t('transaction_details_page.acquiring_institution_country_code'), value: null },
        { label: t('transaction_details_page.forwarding_institution_country_code'), value: null },
        { label: t('transaction_details_page.forwarding_institution_id_code'), value: null },
        { label: t('transaction_details_page.receiving_institution_country_code'), value: null },
        { label: t('transaction_details_page.settlement_institution_country_code'), value: null },
        { label: t('transaction_details_page.settlement_institution_id_code'), value: null },
        { label: t('transaction_details_page.receiving_institution_id_code'), value: null },
        { label: t('transaction_details_page.authorizing_agent_id_code'), value: null },
        { label: t('transaction_details_page.point_of_service_entry_mode'), value: null },
        { label: t('transaction_details_page.function_codes'), value: null },
        { label: t('transaction_details_page.point_of_service_condition_code'), value: null },
        { label: t('transaction_details_page.point_of_service_capture_code'), value: null },
        { label: t('transaction_details_page.retrieval_reference_number'), value: null },
        { label: t('transaction_details_page.service_restriction_code'), value: null },
        { label: t('transaction_details_page.additional_response_data'), value: null },
        { label: t('transaction_details_page.additional_amounts'), value: null },
        { label: t('transaction_details_page.extended_payment_code'), value: null },
        { label: t('transaction_details_page.info_text'), value: null },
        { label: t('transaction_details_page.cardholder_billing_currency_rate'), value: null },
        { label: t('transaction_details_page.settlement_date'), value: null },
        { label: t('transaction_details_page.currency_conversion_date'), value: null },
        { label: t('transaction_details_page.settlement_fee'), value: null },
        { label: t('transaction_details_page.currency_code_settlement'), value: null },
        { label: t('transaction_details_page.currency_code_cardholder_billing'), value: null },
        { label: t('transaction_details_page.settlement_code'), value: null },
        { label: t('transaction_details_page.net_settlement_amount'), value: null },
        { label: t('transaction_details_page.three_ds_code'), value: null },
        { label: t('transaction_details_page.three_ds_flex_flow'), value: null },
        { label: t('transaction_details_page.avs_status'), value: null },
        { label: t('transaction_details_page.fraud_monitoring_fee'), value: null },
      ],
    },
  ];
}
