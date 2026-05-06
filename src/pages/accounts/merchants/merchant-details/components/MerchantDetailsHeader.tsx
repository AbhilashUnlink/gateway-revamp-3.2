import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BackButtonIcon } from '@/assets/icons/action-buttons';
import DasPopover from '@/components/ui/das-popover';
import { DasPopoverHeader } from '@/components/ui/das-popover-header';
import { ApiKeysPanel } from '@/drawers/merchant-details-drawer/components/ApiKeysPanel';

interface StatPill {
  label: string;
  value: number | string;
}

interface MerchantDetailsHeaderProps {
  legalName: string;
  merchantId: string;
  /** API keys shown inside the LIVE API KEYS popover. */
  liveKey?: string;
  testKey?: string;
  /** Optional contextual pill (e.g. Total Users / Total Products per active tab). */
  pill?: StatPill | null;
}

function StatsPill({ label, value }: StatPill) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-2xl border border-white bg-[#fff6e6] px-4 drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]">
      <span className="text-xs font-medium uppercase leading-5 text-[#f7941d] whitespace-nowrap">
        {label}
      </span>
      <span className="text-sm font-semibold leading-5 text-[#1a1a1a]">{value}</span>
    </div>
  );
}

interface LiveApiKeysButtonProps {
  label: string;
}

const LiveApiKeysButton = ({
  label,
  className,
  ...rest
}: LiveApiKeysButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <Button
    type="button"
    variant="ghost"
    {...rest}
    className={[
      'h-12 rounded-2xl px-4 text-xs font-semibold uppercase tracking-wide drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)] hover:opacity-80',
      className ?? '',
    ].join(' ')}
  >
    {label}
  </Button>
);

export function MerchantDetailsHeader({
  legalName,
  merchantId,
  liveKey,
  testKey,
  pill,
}: MerchantDetailsHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-start gap-4 pt-6">
      <div className="flex flex-1 items-start gap-3 border-l-4 border-[#f7941d] px-3">
        <Button
          type="button"
          variant="icon"
          size="icon"
          aria-label={t('merchant_details_page.back')}
          onClick={() => navigate('/accounts/merchants')}
          className="mt-1 shrink-0 text-[#1a1a1a]"
        >
          <BackButtonIcon />
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-semibold leading-7 text-[#1a1a1a]">{legalName || '—'}</h1>
          <div className="flex items-center gap-2 text-sm leading-5">
            <Link to="/accounts/merchants" className="text-[#808080] hover:underline">
              {t('merchant_details_page.breadcrumb_merchants')}
            </Link>
            <span className="text-[#808080]">/</span>
            <span className="font-medium text-[#f7941d]">
              {t('merchant_details_page.breadcrumb_merchant_id', { id: merchantId })}
            </span>
          </div>
        </div>
      </div>

      {pill && <StatsPill label={pill.label} value={pill.value} />}

      <DasPopover>
        <DasPopover.Trigger
          as={LiveApiKeysButton}
          label={t('merchant_details_page.live_api_keys')}
        />
        <DasPopover.Content
          align="right"
          className="z-[60] mt-2 w-[480px] rounded-2xl border-0 bg-white drop-shadow-[0px_4px_10px_rgba(0,0,0,0.2)]"
        >
          {({ close }) => (
            <>
              <DasPopoverHeader
                icon="key-round"
                title={t('merchant_drawer.live_api_keys')}
                onClose={close}
                closeAriaLabel={t('merchant_user_form.close')}
              />
              <div className="p-4">
                <ApiKeysPanel liveKey={liveKey ?? ''} testKey={testKey} />
              </div>
            </>
          )}
        </DasPopover.Content>
      </DasPopover>
    </div>
  );
}
