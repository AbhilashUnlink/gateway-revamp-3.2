import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { fetchTransactionDetails } from '@/store/thunks/transactionDetailsThunks';
import { useTransactionActions } from '@/hooks/transactions/useTransactionActions';
import TransactionDetails from '@/drawers/transaction-details-drawer/components/TransactionDetails';

const DaspayTransactionDetailsPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const { data, loading, error } = useTransactionActions();

  useEffect(() => {
    if (!id) return;
    void dispatch(fetchTransactionDetails({ id }));
  }, [id, dispatch]);

  return (
    <div className="flex h-full flex-col bg-white">
      <TransactionDetails data={data} loading={loading} error={error} />
    </div>
  );
};

export default DaspayTransactionDetailsPage;
