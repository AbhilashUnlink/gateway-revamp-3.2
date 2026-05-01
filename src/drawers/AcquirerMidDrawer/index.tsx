 
import { useMemo } from 'react';
import DasDrawer from '@/components/ui/DasDrawer';
import { cn } from '@/utils/cn';
import { useAcquirerDetails } from '@/hooks/useAcquirerDetails';
import { DrawerEntityHeader } from '../shared/DrawerEntityHeader';
import { DrawerFieldGrid, DrawerSection, type DrawerFieldConfig } from '../shared/DrawerFieldGrid';
import { DrawerStateView } from '../shared/DrawerStateView';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';
import type { AcquirerDetailsData } from '@/types/acquirer/acquirerDetails.types';

const COUNTRY_LABELS: Record<string, string> = {
  JP: 'Japan',
  SG: 'Singapore',
  HK: 'Hong Kong',
  US: 'United States',
  GB: 'United Kingdom',
  IN: 'India',
};

const STATUS_TONE: Record<string, 'success' | 'error'> = {
  ACTIVE: 'success',
  INACTIVE: 'error',
  DISABLED: 'error',
};

function StatusPill({ label }: { label: string }) {
  const tone = STATUS_TONE[label.toUpperCase()] ?? 'success';
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center rounded px-1 text-xs font-medium uppercase leading-none',
        tone === 'success' ? 'bg-[#c6f3da] text-[#1e8f1f]' : 'bg-[#ffe2e2] text-[#ff4343]'
      )}
    >
      {label}
    </span>
  );
}

function buildAcquirerFields(data: AcquirerDetailsData): DrawerFieldConfig[] {
  const country = COUNTRY_LABELS[data.CountryID] ?? data.CountryID;
  return [
    { key: 'acquirer', label: 'Acquirer', value: data.AcquirerName || null },
    { key: 'time_zone', label: 'Time Zone', value: data.TimeZone || null, align: 'end' },
    { key: 'country', label: 'Country', value: country || null },
    {
      key: 'chargeback_days',
      label: 'Chargeback Investigation Days',
      value: data.ChargebackInvestigationDays ?? null,
      align: 'end',
    },
    { key: 'acquirer_code', label: 'Acquirer Code', value: data.AcquirerCode || null },
    {
      key: 'retrieval_days',
      label: 'Retrieval Investigation Days',
      value: data.RetrievalInvestigationDays ?? null,
      align: 'end',
    },
    { key: 'token', label: 'Token', value: data.Token || null },
    { key: 'sender', label: 'Sender', value: data.Sender || null, align: 'end' },
    { key: 'channel', label: 'Channel', value: data.Channel || null },
    {
      key: 'status',
      label: 'Status',
      align: 'end',
      value: data.Status,
      custom: data.Status ? <StatusPill label={data.Status} /> : undefined,
    },
    { key: 'url', label: 'URL', value: data.URL1 || null },
  ];
}

export default function AcquirerMidDrawer({ data }: DrawerComponentProps) {
  const acquirerMid = (data?.acquirerMid as string) ?? '';
  const { data: acquirer, loading, error } = useAcquirerDetails(acquirerMid || null);

  const fields = useMemo(() => (acquirer ? buildAcquirerFields(acquirer) : []), [acquirer]);
  const headerValue = acquirer?.AcquirerMID?.AcquirerMID || acquirerMid;

  return (
    <>
      <DasDrawer.Header>
        <DrawerEntityHeader label="Acquirer MID" value={headerValue} />
      </DasDrawer.Header>

      <DasDrawer.Body>
        <div className="flex flex-col gap-6 p-6">
          <DrawerStateView
            loading={loading}
            error={!loading ? error : null}
            loadingLabel="Loading acquirer details"
          />

          {!loading && !error && acquirer && (
            <DrawerSection bordered={false}>
              <DrawerFieldGrid fields={fields} />
            </DrawerSection>
          )}
        </div>
      </DasDrawer.Body>
    </>
  );
}
