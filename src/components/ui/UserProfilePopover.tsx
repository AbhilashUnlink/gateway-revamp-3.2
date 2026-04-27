import { CircleUser, ChevronDown, KeyRound, UserCog, UserCheck, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/thunks/authThunks';
import DasPopover from '@/components/ui/DasPopover';
import { cn } from '@/utils/cn';

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
  icon: Icon,
  label,
  onClick,
  className,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 border-t border-[#e5e5e5] px-3 py-5',
        'text-sm text-[#1a1a1a] transition-colors hover:bg-neutral-50',
        className
      )}
    >
      <Icon size={24} className="shrink-0 text-[#1a1a1a]" />
      <span>{label}</span>
    </button>
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
        <CircleUser size={24} className="shrink-0" />
        <span className="text-xs font-medium whitespace-nowrap">{displayName}</span>
        <ChevronDown size={12} className="shrink-0" />
      </DasPopover.Trigger>

      <DasPopover.Content align="right" className="w-108">
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-b from-[#fff6e6] to-white px-3 py-1.5">
          <CircleUser size={28} className="shrink-0 text-[#1a1a1a]" />
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

        <MenuRow icon={KeyRound} label="Change Password" />
        <MenuRow icon={UserCog} label="User Settings" />
        <MenuRow
          icon={UserCheck}
          label="Sign In as a Merchant"
          className="bg-[#fff6e6] hover:bg-[#fff0d6]"
        />
        <MenuRow icon={LogOut} label="Sign Out" onClick={handleSignOut} />
      </DasPopover.Content>
    </DasPopover>
  );
}
