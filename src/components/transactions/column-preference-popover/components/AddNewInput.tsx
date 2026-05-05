import { useTranslation } from 'react-i18next';
import { DasIcon } from '@/components/ui/das-icon';

interface AddNewInputProps {
  newListName: string;
  setNewListName: (v: string) => void;
  isNameDuplicate: boolean;
  onSubmit: () => void;
}

export function AddNewInput({
  newListName,
  setNewListName,
  isNameDuplicate,
  onSubmit,
}: AddNewInputProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 border-t border-[#e5e5e5] pt-3">
      <span className="inline-flex w-fit items-center gap-2 text-sm font-semibold leading-5 text-[#1a1a1a]">
        {t('columns.add_new')}
        <DasIcon name="plus" size={16} />
      </span>
      <input
        type="text"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit();
        }}
        placeholder={t('columns.enter_name')}
        className="h-12 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#f7941d]"
      />
      {isNameDuplicate && <span className="text-xs text-[#ff4343]">{t('columns.name_taken')}</span>}
    </div>
  );
}
