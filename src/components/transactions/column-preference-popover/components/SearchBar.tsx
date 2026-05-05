import { useTranslation } from 'react-i18next';
import { DasIcon } from '@/components/ui/das-icon';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  const { t } = useTranslation();
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white pl-3 pr-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t('columns.search')}
        className="h-full flex-1 bg-transparent text-xs leading-[15px] text-[#1a1a1a] outline-none placeholder:text-[#808080]"
      />
      <DasIcon name="search" size={16} className="text-[#808080]" />
    </div>
  );
}
