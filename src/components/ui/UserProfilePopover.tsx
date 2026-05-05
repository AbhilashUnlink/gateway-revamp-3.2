import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DasIcon, type DasIconName } from '@/components/ui/DasIcon';
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/store/thunks/authThunks';
import DasPopover from '@/components/ui/DasPopover';

// ── Subsidiary display labels ─────────────────────────────────────────────

const SUBSIDIARY_LABELS: Record<string, string> = {
  SG: 'PO Singapore',
  RESELLER: 'PO Reseller',
  JP: 'PO Japan',
  MU: 'PO Mauritius',
  EU: 'PO Europe',
  HK: 'PO Hong Kong',
  CN: 'PO China',
};

function formatLastLogin(authTime: number): string {
  if (!authTime) return '';
  const d = new Date(authTime * 1000);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
}

// ── Reusable menu row ─────────────────────────────────────────────────────

function MenuRow({
  icon,
  label,
  onClick,
  className,
}: {
  icon: DasIconName;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="menu-row"
      size="menu-row"
      onClick={onClick}
      className={className}
    >
      <DasIcon name={icon} size={24} className="shrink-0 text-[#1a1a1a]" />
      <span>{label}</span>
    </Button>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export function UserProfilePopover() {
  const dispatch = useAppDispatch();
  const { name, email, auth_time, subsidiaries, Groups } = useAppSelector((s) => s.auth.signInData);

  const displayName = name || email || 'User';
  const entityList = subsidiaries.map((s) => SUBSIDIARY_LABELS[s] ?? s).join(', ');
  const groupList = Groups.join(', ');
  const lastLogin = formatLastLogin(auth_time);

  const handleSignOut = () => {
    void dispatch(logoutUser());
  };

  return (
    <DasPopover>
      <DasPopover.Trigger className="flex items-center gap-2.5 text-[#1a1a1a] transition-opacity hover:opacity-70">
        <DasIcon name="circle-user" size={24} className="shrink-0" />
        <span className="text-xs font-medium whitespace-nowrap">{displayName}</span>
        <DasIcon name="chevron-down" size={12} className="shrink-0" />
      </DasPopover.Trigger>

      <DasPopover.Content align="right" className="w-108">
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-b from-[#fff6e6] to-white px-3 py-1.5">
          <DasIcon name="circle-user" size={28} className="shrink-0 text-[#1a1a1a]" />
          <div className="flex flex-col justify-center">
            <p className="text-base font-semibold leading-5 text-[#1a1a1a]">{displayName}</p>
            {lastLogin && <p className="text-sm text-[#1a1a1a]">Last login {lastLogin}</p>}
          </div>
        </div>

        {/* PO Entity */}
        {entityList && (
          <div className="border-t border-[#e5e5e5] px-3 py-5 text-sm">
            <span className="font-semibold text-[#f7941d]">PO ENTITY: </span>
            <span className="text-[#1a1a1a]">{entityList}</span>
          </div>
        )}

        {/* Access Group */}
        {groupList && (
          <div className="border-t border-[#e5e5e5] px-3 py-5 text-sm">
            <span className="font-semibold text-[#f7941d]">ACCESS GROUP: </span>
            <span className="text-[#1a1a1a]">{groupList}</span>
          </div>
        )}

        <MenuRow icon="key-round" label="Change Password" />
        <MenuRow icon="user-cog" label="User Settings" />
        <MenuRow
          icon="user-check"
          label="Sign In as a Merchant"
          className="bg-[#fff6e6] hover:bg-[#fff0d6]"
        />
        <MenuRow icon="log-out" label="Sign Out" onClick={handleSignOut} />
      </DasPopover.Content>
    </DasPopover>
  );
}
