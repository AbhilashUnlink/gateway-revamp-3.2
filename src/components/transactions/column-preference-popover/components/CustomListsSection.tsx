import { useTranslation } from 'react-i18next';
import type { ColumnPreferenceList } from '@/store/slices/columnPreferencesSlice';
import { CustomListRow } from './CustomListRow';
import { AddNewInput } from './AddNewInput';

interface CustomListsSectionProps {
  lists: ColumnPreferenceList[];
  activeKey: string;
  selectListKey: (key: string) => void;
  setConfirmDeleteKey: (k: string | null) => void;
  newListName: string;
  setNewListName: (v: string) => void;
  isNameDuplicate: boolean;
  onAddSubmit: () => void;
}

export function CustomListsSection({
  lists,
  activeKey,
  selectListKey,
  setConfirmDeleteKey,
  newListName,
  setNewListName,
  isNameDuplicate,
  onAddSubmit,
}: CustomListsSectionProps) {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold leading-5 text-[#1a1a1a]">
        {t('columns.custom_lists')}
      </h4>
      <div className="flex flex-col gap-3">
        {lists.map((p) => {
          const isSelected = activeKey === p.uuid;
          return (
            <CustomListRow
              key={p.uuid}
              label={p.name}
              selected={isSelected}
              onSelect={() => selectListKey(p.uuid)}
              onDelete={() => setConfirmDeleteKey(p.uuid)}
              deleteDisabled={isSelected}
              deleteTitle={isSelected ? t('columns.cannot_delete_active') : t('columns.delete')}
            />
          );
        })}
        <AddNewInput
          newListName={newListName}
          setNewListName={setNewListName}
          isNameDuplicate={isNameDuplicate}
          onSubmit={onAddSubmit}
        />
      </div>
    </section>
  );
}
