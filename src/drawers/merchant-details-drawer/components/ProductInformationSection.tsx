import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { CopyButton } from '@/components/ui/copy-button';
import type { MerchantProduct } from '@/types/merchant/merchantDetails.types';

interface ProductCardProps {
  product: MerchantProduct;
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase() ?? '';
  const tone =
    normalized === 'active'
      ? 'bg-[#c6f3da] text-[#1e8f1f]'
      : normalized === 'terminated'
        ? 'bg-[#ffe2e2] text-[#ff4343]'
        : normalized === 'pending'
          ? 'bg-[#fff1d6] text-[#f7941d]'
          : 'bg-[#f3f4f6] text-[#4b5563]';
  return (
    <span
      className={cn(
        'inline-flex items-center px-1 py-0.5 rounded text-[12px] font-medium uppercase whitespace-nowrap max-w-max',
        tone
      )}
    >
      {status || 'N/A'}
    </span>
  );
}

function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-4 gap-3 rounded-xl border border-[#e5e5e5] bg-white px-4 py-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#808080]">{t('merchant_drawer.product_name')}</span>
        <button
          type="button"
          className="truncate text-left text-sm font-semibold leading-5 text-[#1a1a1a] underline hover:text-[#f7941d]"
        >
          {product.Name || 'N/A'}
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#808080]">{t('merchant_drawer.product_type')}</span>
        <span className="truncate text-sm leading-5 text-[#1a1a1a]">{product.Type || 'N/A'}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#808080]">{t('merchant_drawer.das_mid')}</span>
        <div className="flex items-center gap-1">
          <span className="truncate text-sm leading-5 text-[#1a1a1a]">
            {product.DASMID || 'N/A'}
          </span>
          {product.DASMID && <CopyButton value={product.DASMID} />}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[#808080]">{t('merchant_drawer.mid_status')}</span>
        <StatusBadge status={product.Status} />
      </div>
    </div>
  );
}

interface ProductInformationSectionProps {
  products: MerchantProduct[];
}

export function ProductInformationSection({ products }: ProductInformationSectionProps) {
  const { t } = useTranslation();

  if (!products?.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#e5e5e5] bg-white px-4 py-6 text-center text-sm text-[#808080]">
        {t('merchant_drawer.no_products')}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {products.map((p) => (
        <ProductCard key={p.ProductID || p.DASMID} product={p} />
      ))}
    </div>
  );
}
