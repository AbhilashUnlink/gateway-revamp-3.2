import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addRule,
  applyFilters,
  removeRule,
  resetFilters,
  selectDraftRules,
  updateRule,
  type FilterScreen,
} from '@/store/slices/filterSlice';
import { inferOperator } from '../operators';
import type { FilterField, FilterRule } from '../types';
import { blankValueFor, isRuleComplete, newRuleId } from './isRuleComplete';

interface UseFilterDraftInput {
  screen: FilterScreen;
  fields: FilterField[];
}

/**
 * Owns the draft-rules state for one filter screen: seeding, mutations,
 * derived flags (canApply / canAdd / counts), and the apply / reset flows.
 */
export function useFilterDraft({ screen, fields }: UseFilterDraftInput) {
  const dispatch = useAppDispatch();
  const draftRules = useAppSelector(selectDraftRules(screen));

  // Seed an initial blank rule when there are none yet.
  useEffect(() => {
    if (draftRules.length > 0) return;
    const firstField = fields[0];
    if (!firstField) return;
    dispatch(
      addRule({
        screen,
        rule: {
          id: newRuleId(),
          field: firstField.id,
          operator: inferOperator(firstField.type),
          value: blankValueFor(firstField.type),
        },
      })
    );
  }, [draftRules.length, fields, dispatch, screen]);

  const allRulesComplete = useMemo(
    () => draftRules.every((r) => isRuleComplete(r, fields)),
    [draftRules, fields]
  );
  const hasFreeField = useMemo(
    () => fields.some((f) => !draftRules.some((r) => r.field === f.id)),
    [fields, draftRules]
  );
  const takenFieldIds = useMemo(() => draftRules.map((r) => r.field).filter(Boolean), [draftRules]);
  const activeCount = useMemo(
    () => draftRules.filter((r) => isRuleComplete(r, fields)).length,
    [draftRules, fields]
  );

  const canApply = draftRules.length > 0 && allRulesComplete;
  const canAdd = allRulesComplete && hasFreeField;

  const handleAdd = () => {
    if (!canAdd) return;
    const firstFree = fields.find((f) => !draftRules.some((r) => r.field === f.id));
    if (!firstFree) return;
    dispatch(
      addRule({
        screen,
        rule: {
          id: newRuleId(),
          field: firstFree.id,
          operator: inferOperator(firstFree.type),
          value: blankValueFor(firstFree.type),
        },
      })
    );
  };

  const handleUpdate = (id: string, patch: Partial<FilterRule>) =>
    dispatch(updateRule({ screen, id, patch }));

  const handleRemove = (id: string) => dispatch(removeRule({ screen, id }));

  const handleApply = () => {
    if (!canApply) return;
    dispatch(applyFilters(screen));
  };

  const handleReset = () => dispatch(resetFilters(screen));

  return {
    draftRules,
    takenFieldIds,
    allRulesComplete,
    hasFreeField,
    canAdd,
    canApply,
    activeCount,
    handleAdd,
    handleUpdate,
    handleRemove,
    handleApply,
    handleReset,
  };
}
