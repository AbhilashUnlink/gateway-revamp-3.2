import { useTranslation } from 'react-i18next';
import { DrawerFieldGrid, type DrawerFieldConfig } from '@/drawers/shared/DrawerFieldGrid';
import type { MerchantDetailsData } from '@/types/merchant/merchantDetails.types';
import { formatCountry, formatSubsidiary } from '../merchantDetailsConfig';

function joinNonEmpty(parts: Array<string | undefined>, sep = ' '): string {
  return parts.filter((p): p is string => Boolean(p && p.trim())).join(sep);
}

function buildBusinessFields(
  data: MerchantDetailsData,
  t: (k: string) => string
): DrawerFieldConfig[] {
  return [
    {
      key: 'merchant_account',
      label: t('merchant_details_page.field_merchant_account'),
      value: data.LegalName || null,
      copyable: true,
    },
    {
      key: 'merchant_account_en',
      label: t('merchant_details_page.field_merchant_account_en'),
      value: data.LegalNameInEnglish || null,
      copyable: true,
    },
    {
      key: 'merchant_id',
      label: t('merchant_details_page.field_merchant_id'),
      value: data.MerchantID || null,
      copyable: true,
    },
    {
      key: 'registration_number',
      label: t('merchant_details_page.field_registration_number'),
      value: data.RegistrationNumber || null,
      copyable: true,
    },
    {
      key: 'po_entity',
      label: t('merchant_details_page.field_po_entity'),
      value: formatSubsidiary(data.SubsidiaryID) || null,
    },
    {
      key: 'company_address',
      label: t('merchant_details_page.field_company_address'),
      value: data.Address || null,
    },
    {
      key: 'country',
      label: t('merchant_details_page.field_country'),
      value: formatCountry(data.Country) || null,
    },
    {
      key: 'city',
      label: t('merchant_details_page.field_city'),
      value: data.City || null,
    },
    {
      key: 'postal_code',
      label: t('merchant_details_page.field_postal_code'),
      value: data.PostalCode || null,
      copyable: true,
    },
    {
      key: 'partner_name',
      label: t('merchant_details_page.field_partner_name'),
      value: data.Reseller?.legalName || null,
    },
  ];
}

function buildContactFields(
  data: MerchantDetailsData,
  t: (k: string) => string
): DrawerFieldConfig[] {
  const fullFirst = joinNonEmpty([data.ContactFirstname]);
  return [
    {
      key: 'first_name',
      label: t('merchant_details_page.field_first_name'),
      value: fullFirst || null,
    },
    {
      key: 'middle_name',
      label: t('merchant_details_page.field_middle_name'),
      value: data.ContactMiddleName || null,
    },
    {
      key: 'last_name',
      label: t('merchant_details_page.field_last_name'),
      value: data.ContactLastname || null,
    },
    {
      key: 'phone_number',
      label: t('merchant_details_page.field_phone_number'),
      value: data.ContactPhone || null,
      copyable: true,
    },
    {
      key: 'email_address',
      label: t('merchant_details_page.field_email_address'),
      value: data.ContactEmail || null,
      copyable: true,
    },
  ];
}

interface SectionTitleProps {
  title: string;
}

function SectionTitle({ title }: SectionTitleProps) {
  return <h2 className="text-base font-semibold leading-5 text-[#1a1a1a]">{title}</h2>;
}

interface SectionProps {
  data: MerchantDetailsData;
  /** When `single`, the section spans full width with a 5-column field grid. */
  layout?: 'split' | 'single';
}

export function BusinessDetailsSection({ data, layout = 'split' }: SectionProps) {
  const { t } = useTranslation();
  const fields = buildBusinessFields(data, t);
  const columns = layout === 'single' ? 5 : 2;
  return (
    <section className="flex flex-col gap-4 border-t border-[#e5e5e5] pt-4 first:border-t-0 first:pt-0">
      <SectionTitle title={t('merchant_details_page.section_business_details')} />
      <DrawerFieldGrid fields={fields} columns={columns} />
    </section>
  );
}

export function ContactDetailsSection({ data, layout = 'split' }: SectionProps) {
  const { t } = useTranslation();
  const fields = buildContactFields(data, t);
  const columns = layout === 'single' ? 5 : 2;
  return (
    <section className="flex flex-col gap-4 border-t border-[#e5e5e5] pt-4 first:border-t-0 first:pt-0">
      <SectionTitle title={t('merchant_details_page.section_contact_details')} />
      <DrawerFieldGrid fields={fields} columns={columns} />
    </section>
  );
}
