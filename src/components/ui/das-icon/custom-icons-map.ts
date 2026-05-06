import { DeleteButtonIcon, EditButtonIcon } from './custom-icons';

/**
 * Map of custom (non-lucide) SVG components keyed by their DasIcon name.
 * Kept separate from `custom-icons.tsx` so that file only exports React
 * components — required by the `react-refresh/only-export-components` rule.
 */
export const CUSTOM_ICONS = {
  'edit-button': EditButtonIcon,
  'delete-button': DeleteButtonIcon,
} as const;

export type CustomIconName = keyof typeof CUSTOM_ICONS;
