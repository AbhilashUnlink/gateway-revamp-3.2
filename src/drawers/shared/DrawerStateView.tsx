import { Loader2 } from 'lucide-react';

interface DrawerStateViewProps {
  loading?: boolean;
  error?: string | null;
  loadingLabel?: string;
}

export function DrawerStateView({
  loading,
  error,
  loadingLabel = 'Loading',
}: DrawerStateViewProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#808080]">
        <Loader2 size={16} className="animate-spin" />
        {loadingLabel}
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[#ff4343]">{error}</div>
    );
  }
  return null;
}
