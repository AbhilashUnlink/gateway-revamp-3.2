import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';

interface PresetListItem {
  uuid: string;
  name: string;
}

interface PresetListProps {
  presets: PresetListItem[];
  onLoad: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

export function PresetList({ presets, onLoad, onDelete }: PresetListProps) {
  const { t } = useTranslation();

  if (presets.length === 0) {
    return (
      <div className="rounded-lg bg-white px-3 py-2 text-xs text-[#808080]">
        {t('filter.no_presets', 'No saved filters yet.')}
      </div>
    );
  }

  return (
    <div className="flex max-h-32 flex-col gap-1 overflow-y-auto">
      {presets.map((p) => (
        <PresetRow
          key={p.uuid}
          name={p.name}
          onLoad={() => onLoad(p.uuid)}
          onDelete={() => onDelete(p.uuid)}
        />
      ))}
    </div>
  );
}

function PresetRow({
  name,
  onLoad,
  onDelete,
}: {
  name: string;
  onLoad: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="group flex items-center justify-between gap-2 rounded-lg border border-[#e5e5e5] bg-white px-3 py-1.5">
      <Button
        type="button"
        variant="link"
        size="inline"
        onClick={onLoad}
        title={name}
        className="flex-1 justify-start truncate text-[#1a1a1a] hover:text-[#f7941d] hover:no-underline"
      >
        {name}
      </Button>
      <Button
        type="button"
        variant="icon"
        size="icon"
        onClick={onDelete}
        title={t('filter.delete_preset', 'Delete saved filter')}
        aria-label="Delete"
        className="shrink-0 text-[#808080] opacity-0 hover:text-[#ff4343] hover:opacity-100 group-hover:opacity-100"
      >
        <DasIcon name="trash-2" size={14} />
      </Button>
    </div>
  );
}
