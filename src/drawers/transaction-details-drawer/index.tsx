import DasDrawer from '@/components/ui/das-drawer';
import { DrawerTransactionHeader } from '@/drawers/shared/DrawerTransactionHeader';
import { useTransactionActions } from '@/hooks/transactions/useTransactionActions';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';
import TransactionDetails from './components/TransactionDetails';

export default function TransactionDetailsDrawer({ type, data }: DrawerComponentProps) {
  const { data: transactionDetailsData, loading, error } = useTransactionActions();

  return (
    <>
      <DasDrawer.Header>
        <DrawerTransactionHeader activeTab="details" type={type} data={data} />
      </DasDrawer.Header>

      <DasDrawer.Body>
        <TransactionDetails data={transactionDetailsData} loading={loading} error={error} />
      </DasDrawer.Body>
    </>
  );
}
