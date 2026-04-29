import DasDrawer from '@/components/ui/DasDrawer';
import { DrawerTransactionHeader } from '@/drawers/shared/DrawerTransactionHeader';
import { useDrawerTransaction } from '@/hooks/useDrawerTransaction';
import { useTransactionActions } from '@/hooks/useTransactionActions';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';
import TransactionDetails from './components/TransactionDetails';

export function TransactionDetailsDrawer({ type, data, width, topOffset }: DrawerComponentProps) {
  const { handleClose } = useDrawerTransaction({ type, data });
  const { data: transactionDetailsData, loading, error } = useTransactionActions();

  return (
    <DasDrawer width={width} topOffset={topOffset} onClose={handleClose}>
      <DasDrawer.Content>
        <DasDrawer.Header>
          <DrawerTransactionHeader activeTab="details" type={type} data={data} />
        </DasDrawer.Header>

        <DasDrawer.Body>
          <TransactionDetails data={transactionDetailsData} loading={loading} error={error} />
        </DasDrawer.Body>
      </DasDrawer.Content>
    </DasDrawer>
  );
}
