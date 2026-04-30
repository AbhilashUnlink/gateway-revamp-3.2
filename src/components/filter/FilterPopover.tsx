import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Bookmark, CircleX, Filter, Loader2, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addRule,
  applyFilters,
  closeFilter,
  loadRules,
  removeRule,
  resetFilters,
  selectDraftRules,
  selectFilterIsOpen,
  updateRule,
  type FilterScreen,
} from '@/store/slices/filterSlice';
import {
  deletePresetFilter,
  fetchPresetFilters,
  savePresetFilter,
  selectPresetFilters,
  selectPresetFiltersSaving,
} from '@/store/slices/presetFiltersSlice';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { FilterRuleRow } from './FilterRuleRow';
import { inferOperator } from './operators';
import { buildPresetSavePayload, deserializeFromPreset } from './serializers';
import type { FilterField, FilterRule, FilterValue } from './types';

interface Props {
  screen: FilterScreen;
  fields: FilterField[];
  /** Anchor element — popover positions itself just below + right-aligned. */
  anchorRef: RefObject<HTMLElement | null>;
}

const newId = () => `r_${Math.random().toString(36).slice(2, 10)}`;

const blankValueFor = (type: FilterField['type']): FilterValue =>
  type === 'multiSelect' ? [] : type === 'dateRange' ? {} : '';

/** A rule is "complete" when its value is non-empty for its type. */
function isRuleComplete(rule: FilterRule, fields: FilterField[]): boolean {
  if (!rule.field) return false;
  const field = fields.find((f) => f.id === rule.field);
  if (!field) return false;
  const v = rule.value;
  switch (field.type) {
    case 'text':
    case 'select':
      return typeof v === 'string' && v.trim().length > 0;
    case 'number':
      return v !== '' && v !== null && v !== undefined;
    case 'multiSelect':
      return Array.isArray(v) && v.length > 0;
    case 'dateRange':
      return !!v && typeof v === 'object' && !Array.isArray(v) && !!v.from && !!v.to;
    default:
      return false;
  }
}

export function FilterPopover({ screen, fields, anchorRef }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectFilterIsOpen(screen));
  const draftRules = useAppSelector(selectDraftRules(screen));
  const presets = useAppSelector(selectPresetFilters);
  const saving = useAppSelector(selectPresetFiltersSaving);
  const popRef = useRef<HTMLDivElement>(null);
  const saveInputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [savingMode, setSavingMode] = useState(false);
  const [presetName, setPresetName] = useState('');

  const POPOVER_WIDTH = 520;

  useLayoutEffect(() => {
    if (!isOpen) return;
    const update = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(8, rect.right - POPOVER_WIDTH),
      });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [isOpen, anchorRef]);

  // Fetch presets when the popover opens.
  useEffect(() => {
    if (!isOpen) return;
    void dispatch(fetchPresetFilters());
  }, [isOpen, dispatch]);

  // Seed an initial blank rule.
  useEffect(() => {
    if (!isOpen) return;
    if (draftRules.length > 0) return;
    const firstField = fields[0];
    if (!firstField) return;
    dispatch(
      addRule({
        screen,
        rule: {
          id: newId(),
          field: firstField.id,
          operator: inferOperator(firstField.type),
          value: blankValueFor(firstField.type),
        },
      })
    );
  }, [isOpen, draftRules.length, fields, dispatch, screen]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest('[data-filter-portal="true"]')) return;
      dispatch(closeFilter(screen));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(closeFilter(screen));
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, anchorRef, dispatch, screen]);

  const allRulesComplete = useMemo(
    () => draftRules.every((r) => isRuleComplete(r, fields)),
    [draftRules, fields]
  );
  const hasFreeField = useMemo(
    () => fields.some((f) => !draftRules.some((r) => r.field === f.id)),
    [fields, draftRules]
  );

  // Map field id → operator for preset deserialization.
  const operatorByField = useMemo(() => {
    const map: Record<string, string> = {};
    for (const f of fields) map[f.id] = inferOperator(f.type);
    return map;
  }, [fields]);

  if (!isOpen || !position) return null;

  const handleAdd = () => {
    if (!allRulesComplete) return;
    const firstFree = fields.find((f) => !draftRules.some((r) => r.field === f.id));
    if (!firstFree) return;
    dispatch(
      addRule({
        screen,
        rule: {
          id: newId(),
          field: firstFree.id,
          operator: inferOperator(firstFree.type),
          value: blankValueFor(firstFree.type),
        },
      })
    );
  };

  const handleApply = () => {
    if (!allRulesComplete) return;
    dispatch(applyFilters(screen));
  };

  const handleClose = () => {
    dispatch(closeFilter(screen));
    setSavingMode(false);
    setPresetName('');
  };

  const handleCancel = () => {
    dispatch(resetFilters(screen));
    dispatch(closeFilter(screen));
    setSavingMode(false);
    setPresetName('');
  };

  const handleLoadPreset = (uuid: string) => {
    const preset = presets.find((p) => p.uuid === uuid);
    if (!preset) return;
    const rules = deserializeFromPreset(preset.filter_json, operatorByField);
    if (rules.length === 0) return;
    dispatch(loadRules({ screen, rules }));
  };

  const handleDeletePreset = (uuid: string) => {
    void dispatch(deletePresetFilter(uuid));
  };

  const handleSavePreset = async () => {
    const name = presetName.trim();
    if (!name) return;
    if (!allRulesComplete || draftRules.length === 0) return;
    const { filter_json, raw_transformed_filter } = buildPresetSavePayload(draftRules);
    await dispatch(savePresetFilter({ name, filter_json, raw_transformed_filter }));
    setSavingMode(false);
    setPresetName('');
  };

  const enterSaveMode = () => {
    if (!allRulesComplete || draftRules.length === 0) return;
    setSavingMode(true);
    setTimeout(() => saveInputRef.current?.focus(), 0);
  };

  const takenFieldIds = draftRules.map((r) => r.field).filter(Boolean);
  const canApply = draftRules.length > 0 && allRulesComplete;
  const canAdd = allRulesComplete && hasFreeField;
  const canSave = draftRules.length > 0 && allRulesComplete && !saving;

  const activeCount = draftRules.filter((r) => isRuleComplete(r, fields)).length;

  return createPortal(
    <div
      ref={popRef}
      className={cn(
        'fixed z-[60] flex max-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-2xl bg-white drop-shadow-[0px_4px_10px_rgba(0,0,0,0.2)]'
      )}
      style={{ top: position.top, left: position.left, width: POPOVER_WIDTH }}
    >
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center gap-2 bg-gradient-to-r from-[#fce4cc] via-[#fef1e0] to-white px-4 py-1.5">
        <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
          <Filter size={14} className="text-[#1a1a1a]" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded bg-[#1a1a1a] text-[8px] font-semibold leading-none text-white">
            {activeCount}
          </span>
        </div>
        <h3 className="flex-1 text-base font-semibold text-[#1a1a1a]">
          {t('filter.title', 'Advanced Filters')}
        </h3>
        <button
          type="button"
          onClick={handleClose}
          className="text-[#1a1a1a] transition-opacity hover:opacity-70"
          aria-label={t('filter.close', 'Close')}
        >
          <CircleX size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {draftRules.length > 0 && (
          <div className="grid grid-cols-[1fr_1fr_40px] gap-4">
            <span className="text-sm font-semibold text-[#1a1a1a]">
              {t('filter.field', 'Field')}
              <span className="font-normal text-[#ff4343]">*</span>
            </span>
            <span className="text-sm font-semibold text-[#1a1a1a]">
              {t('filter.value', 'Value')}
              <span className="font-normal text-[#ff4343]">*</span>
            </span>
            <span />
          </div>
        )}

        {draftRules.map((rule) => (
          <FilterRuleRow
            key={rule.id}
            rule={rule}
            fields={fields}
            takenFieldIds={takenFieldIds}
            onChange={(patch) => dispatch(updateRule({ screen, id: rule.id, patch }))}
            onRemove={() => dispatch(removeRule({ screen, id: rule.id }))}
          />
        ))}

        <div className="border-t border-[#e5e5e5] pt-3">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            title={
              !allRulesComplete
                ? t('filter.fill_value_first', 'Fill in the current filter value first')
                : !hasFreeField
                  ? t('filter.no_more_fields', 'All fields are already in use')
                  : undefined
            }
            className="inline-flex items-center gap-2.5 text-sm font-semibold text-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t('filter.add_new', 'Add New')}
            <Plus size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 px-4 pb-4">
        <Button
          type="button"
          variant="primary"
          onClick={handleApply}
          disabled={!canApply}
          className="flex-1 rounded-2xl shadow-[0px_4px_9px_0px_rgba(0,0,0,0.1)]"
        >
          {t('filter.apply', 'Apply')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleCancel}
          className="flex-1 rounded-2xl uppercase"
        >
          {t('filter.cancel', 'Cancel')}
        </Button>
      </div>

      {/* Saved-presets bar (below the footer) */}
      <div className="border-t border-[#f0f0f0] bg-[#fafafa] px-5 py-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-[#808080]">
            {t('filter.saved_filters', 'Saved filters')}
          </span>
          {savingMode ? (
            <div className="flex flex-1 items-center gap-2">
              <input
                ref={saveInputRef}
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSavePreset();
                  if (e.key === 'Escape') {
                    setSavingMode(false);
                    setPresetName('');
                  }
                }}
                placeholder={t('filter.preset_name', 'Filter name…')}
                className="h-8 min-w-0 flex-1 rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
              />
              <button
                type="button"
                onClick={() => {
                  setSavingMode(false);
                  setPresetName('');
                }}
                disabled={saving}
                className="h-8 rounded-lg px-2.5 text-xs font-medium text-[#1a1a1a] hover:bg-white disabled:opacity-40"
              >
                {t('filter.cancel', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleSavePreset}
                disabled={!presetName.trim() || saving}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#1a1a1a] px-2.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving && <Loader2 size={12} className="animate-spin" />}
                {t('filter.save', 'Save')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={enterSaveMode}
              disabled={!canSave}
              title={
                !canSave
                  ? t(
                      'filter.save_requires_filters',
                      'Add a complete filter before saving as preset'
                    )
                  : t('filter.save_as_preset', 'Save current as preset')
              }
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#e5e5e5] bg-white px-2.5 text-xs font-medium text-[#1a1a1a] hover:border-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#e5e5e5]"
            >
              <Bookmark size={12} />
              {t('filter.save', 'Save')}
            </button>
          )}
        </div>

        {presets.length === 0 ? (
          <div className="rounded-lg bg-white px-3 py-2 text-xs text-[#808080]">
            {t('filter.no_presets', 'No saved filters yet.')}
          </div>
        ) : (
          <div className="flex max-h-32 flex-col gap-1 overflow-y-auto">
            {presets.map((p) => (
              <div
                key={p.uuid}
                className="group flex items-center justify-between gap-2 rounded-lg border border-[#e5e5e5] bg-white px-3 py-1.5"
              >
                <button
                  type="button"
                  onClick={() => handleLoadPreset(p.uuid)}
                  title={p.name}
                  className="flex-1 truncate text-left text-sm text-[#1a1a1a] hover:text-[#f7941d]"
                >
                  {p.name}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePreset(p.uuid)}
                  title={t('filter.delete_preset', 'Delete saved filter')}
                  aria-label="Delete"
                  className="shrink-0 text-[#808080] opacity-0 transition-opacity hover:text-[#ff4343] group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
