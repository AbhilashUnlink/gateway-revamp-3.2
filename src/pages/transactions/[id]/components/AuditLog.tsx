import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const dd = d.getDate().toString().padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  const ss = d.getSeconds().toString().padStart(2, '0');
  return `${dd} ${MONTHS[d.getMonth()]} ${yyyy} | ${hh}:${mm}:${ss}`;
}

interface AuditEntry {
  UpdatedBy?: string;
  updatedBy?: string;
  CreatedBy?: string;
  UpdatedAt?: string;
  updatedAt?: string;
  CreatedAt?: string;
  AuthCode?: string;
  authCode?: string;
  Description?: string;
  description?: string;
  Comment?: string;
  Status?: string;
  status?: string;
  [key: string]: unknown;
}

interface AuditCardProps {
  entry: AuditEntry;
}

function AuditCard({ entry }: AuditCardProps) {
  const { t } = useTranslation();

  const updatedBy = entry.UpdatedBy ?? entry.updatedBy ?? entry.CreatedBy ?? 'N/A';
  const updateDate = entry.UpdatedAt ?? entry.updatedAt ?? entry.CreatedAt ?? '';
  const authCode = entry.AuthCode ?? entry.authCode ?? 'N/A';
  const description = entry.Description ?? entry.description ?? entry.Comment ?? 'N/A';
  const status = (entry.Status ?? entry.status ?? 'Successful').toString();
  const isSuccess = /SUCCESS|APPROVED|UPDATED/i.test(status);

  return (
    <div className="flex w-[453px] shrink-0 flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-[#d0d0d0]" />
        <span
          className={cn(
            'inline-flex items-center rounded px-1 py-0.5 text-xs font-medium uppercase leading-none',
            isSuccess ? 'bg-[#c6f3da] text-[#1e8f1f]' : 'bg-[#ffe2e2] text-[#ff4343]'
          )}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.updated_by')}
            </span>
            <span className="truncate text-sm leading-5 text-[#1a1a1a]">{updatedBy}</span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.update_date')}
            </span>
            <span className="text-sm leading-5 text-[#1a1a1a]">
              {updateDate ? formatDateTime(updateDate) : 'N/A'}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.auth_code')}
            </span>
            <span className="text-sm leading-5 text-[#1a1a1a]">{authCode}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 bg-[#fafafa] p-4">
          <span className="text-sm leading-5 text-[#808080]">
            {t('transaction_details_page.description')}
          </span>
          <span className="line-clamp-2 text-sm leading-5 text-[#1a1a1a]">{description}</span>
        </div>
      </div>
    </div>
  );
}

interface AuditLogProps {
  items: unknown[];
}

export function AuditLog({ items }: AuditLogProps) {
  const { t } = useTranslation();

  const list = (Array.isArray(items) ? (items as AuditEntry[]) : []).slice().sort((a, b) => {
    const aTime = new Date(a.UpdatedAt ?? a.updatedAt ?? a.CreatedAt ?? 0).getTime();
    const bTime = new Date(b.UpdatedAt ?? b.updatedAt ?? b.CreatedAt ?? 0).getTime();
    return bTime - aTime;
  });

  if (list.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[#808080]">
        {t('transaction_details_page.audit_log_empty')}
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-2">
      {list.map((entry, idx) => (
        <AuditCard key={idx} entry={entry} />
      ))}
    </div>
  );
}
