import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import { CopyButton } from '@/components/ui/copy-button';

interface ApiKeyRowProps {
  label: string;
  value: string;
}

function ApiKeyRow({ label, value }: ApiKeyRowProps) {
  const [revealed, setRevealed] = useState(false);
  const toggle = useCallback(() => setRevealed((v) => !v), []);
  const masked = value ? '*'.repeat(Math.max(value.length, 20)) : 'N/A';
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-sm font-medium uppercase leading-5 text-[#1a1a1a]">{label}</span>
      <span className="flex-1 truncate font-mono text-sm leading-5 text-[#231f20]">
        {value ? (revealed ? value : masked) : 'N/A'}
      </span>
      <Button
        type="button"
        variant="icon"
        size="icon"
        onClick={toggle}
        aria-label={revealed ? t('merchant_drawer.hide') : t('merchant_drawer.reveal')}
        disabled={!value}
      >
        {revealed ? <DasIcon name="eye-off" size={18} /> : <DasIcon name="eye" size={18} />}
      </Button>
      <CopyButton value={value} ariaLabel={t('merchant_drawer.copy_api_key')} />
    </div>
  );
}

interface ApiKeysPanelProps {
  liveKey: string;
  testKey?: string;
}

export function ApiKeysPanel({ liveKey, testKey }: ApiKeysPanelProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#e5e5e5] bg-white p-4">
      <ApiKeyRow label={t('merchant_drawer.live_api_key')} value={liveKey} />
      {testKey && <ApiKeyRow label={t('merchant_drawer.test_api_key')} value={testKey} />}
    </div>
  );
}
