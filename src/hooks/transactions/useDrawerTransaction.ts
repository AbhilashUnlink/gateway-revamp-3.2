import { useDrawerControl } from '@/hooks/useDrawerControl';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';

export function useDrawerTransaction({ type, data }: Pick<DrawerComponentProps, 'type' | 'data'>) {
  const { open, close } = useDrawerControl();

  const transactionRefId = (data?.transactionRefId as string) ?? '—';

  const handleClose = () => close();

  const handleCopy = () => void navigator.clipboard.writeText(transactionRefId);

  const navigateTo = (targetType: string) => {
    open({ type: targetType, data });
  };

  return { transactionRefId, handleClose, handleCopy, navigateTo, type };
}
