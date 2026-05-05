import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadRules, type FilterScreen } from '@/store/slices/filterSlice';
import {
  deletePresetFilter,
  fetchPresetFilters,
  savePresetFilter,
  selectPresetFilters,
  selectPresetFiltersSaving,
} from '@/store/slices/presetFiltersSlice';
import { inferOperator } from '../operators';
import { buildPresetSavePayload, deserializeFromPreset } from '../serializers';
import type { FilterField, FilterRule } from '../types';

interface UsePresetFiltersInput {
  screen: FilterScreen;
  fields: FilterField[];
  draftRules: FilterRule[];
  allRulesComplete: boolean;
}

/**
 * Owns saved-preset state: the list, the inline "save" form, and the
 * load/save/delete flows. Lazy-fetches once on mount (panel opens).
 */
export function usePresetFilters({
  screen,
  fields,
  draftRules,
  allRulesComplete,
}: UsePresetFiltersInput) {
  const dispatch = useAppDispatch();
  const presets = useAppSelector(selectPresetFilters);
  const saving = useAppSelector(selectPresetFiltersSaving);

  const saveInputRef = useRef<HTMLInputElement>(null);
  const [savingMode, setSavingMode] = useState(false);
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    void dispatch(fetchPresetFilters());
  }, [dispatch]);

  // Map field id → operator for preset deserialization.
  const operatorByField = useMemo(() => {
    const map: Record<string, string> = {};
    for (const f of fields) map[f.id] = inferOperator(f.type);
    return map;
  }, [fields]);

  const canSave = draftRules.length > 0 && allRulesComplete && !saving;

  const enterSaveMode = () => {
    if (!canSave) return;
    setSavingMode(true);
    setTimeout(() => saveInputRef.current?.focus(), 0);
  };

  const exitSaveMode = () => {
    setSavingMode(false);
    setPresetName('');
  };

  const loadPreset = (uuid: string) => {
    const preset = presets.find((p) => p.uuid === uuid);
    if (!preset) return;
    const rules = deserializeFromPreset(preset.filter_json, operatorByField);
    if (rules.length === 0) return;
    dispatch(loadRules({ screen, rules }));
  };

  const deletePreset = (uuid: string) => {
    void dispatch(deletePresetFilter(uuid));
  };

  const submitSave = async () => {
    const name = presetName.trim();
    if (!name || !allRulesComplete || draftRules.length === 0) return;
    const { filter_json, raw_transformed_filter } = buildPresetSavePayload(draftRules);
    await dispatch(savePresetFilter({ name, filter_json, raw_transformed_filter }));
    exitSaveMode();
  };

  return {
    presets,
    saving,
    canSave,
    savingMode,
    presetName,
    setPresetName,
    saveInputRef,
    enterSaveMode,
    exitSaveMode,
    submitSave,
    loadPreset,
    deletePreset,
  };
}
