import { useMemo } from 'react';
import { DataTable } from '@/components/table';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import type { MerchantProduct } from '@/types/merchant/merchantDetails.types';
import { buildMerchantProductColumns } from '../productTableSchema';

interface ProductInformationTabProps {
  products: MerchantProduct[];
}

export function ProductInformationTab({ products }: ProductInformationTabProps) {
  const { open } = useDrawerControl();

  const handleProductClick = (row: MerchantProduct) => {
    if (!row.DASMID) return;
    // The merchant API returns DASMID at the product level but not the
    // terminalId — fall back to LocationID which mirrors the `LOC<dasmid>`
    // shape the product details endpoint accepts.
    const terminalId = row.LocationID || row.Location || row.DASMID;
    open({
      type: 'product',
      data: {
        transactionRefId: `${row.DASMID}___${terminalId}`,
        dasmid: row.DASMID,
        terminalId,
      },
    });
  };

  const columnConfigs = useMemo(
    () => buildMerchantProductColumns({ onProductClick: handleProductClick }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="bg-white px-6 pt-6 pb-6">
      <DataTable<MerchantProduct>
        columnConfigs={columnConfigs}
        data={products}
        loading={false}
        hasMore={false}
        onLoadMore={() => {}}
        onRowClick={handleProductClick}
        hideNoMoreFooter
        className="rounded-2xl"
      />
    </div>
  );
}
