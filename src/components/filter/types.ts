export type FilterFieldType = 'text' | 'select' | 'multiSelect' | 'number' | 'dateRange';

export type GatewayConfigKey =
  | 'merchantData'
  | 'dasmidOptions'
  | 'acquirers'
  | 'acquirerMIDData'
  | 'chargebackReasonCode'
  | 'businessLocations'
  | 'transactionTypes'
  | 'statuses'
  | 'paymentSchemes'
  | 'paymentTypes'
  | 'currencies';

export interface FilterFieldOption {
  label: string;
  value: string;
}

/** A single, flat filter field (one per filterable attribute, no grouping). */
export interface FilterField {
  /** Stable id used as `field` on the backend payload. */
  id: string;
  /** i18n key for the displayed label in the field-picker dropdown. */
  labelKey: string;
  /** Type of value control to render (and how to infer the operator). */
  type: FilterFieldType;
  /** When set, the value control is a select/multiSelect populated from gatewayConfig. */
  optionsFromConfig?: GatewayConfigKey;
  /** Static options for select/multiSelect when no gatewayConfig key applies. */
  options?: FilterFieldOption[];
  /** Filter-only synthetic fields (date range, etc.) that don't appear in the table. */
  filterOnly?: boolean;
}

export type FilterValue = string | string[] | number | { from?: string; to?: string };

export interface FilterRule {
  /** Stable client id (uuid-ish) — used as React key, never sent to server. */
  id: string;
  /** Matches FilterField.id */
  field: string;
  /** Implicit per field type — stored so serializers don't have to re-derive. */
  operator: string;
  value: FilterValue;
}

export interface SerializedFilterEntry {
  field: string;
  operator: string;
  value: unknown;
  operand?: 'AND' | 'OR';
}
