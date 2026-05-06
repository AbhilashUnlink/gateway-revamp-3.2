export interface StatusStyle {
  bg: string;
  text: string;
}

const GREEN: StatusStyle = { bg: 'bg-[#c6f3da]', text: 'text-[#1e8f1f]' };
const RED: StatusStyle = { bg: 'bg-[#ffe2e2]', text: 'text-[#ff4343]' };
const ORANGE: StatusStyle = { bg: 'bg-[#fff1d6]', text: 'text-[#f7941d]' };
const BLUE: StatusStyle = { bg: 'bg-[#dbeafe]', text: 'text-[#1e40af]' };
const GRAY: StatusStyle = { bg: 'bg-[#f3f4f6]', text: 'text-[#4b5563]' };
const PURPLE: StatusStyle = { bg: 'bg-[#ede9fe]', text: 'text-[#5b21b6]' };

const statusStyleMap: Record<string, StatusStyle> = {
  // Success
  successful: GREEN,
  success: GREEN,
  approved: GREEN,
  authorization: GREEN,
  authorized: GREEN,
  purchase: GREEN,
  purchased: GREEN,
  capture: GREEN,
  captured: GREEN,
  settled: GREEN,
  refund: GREEN,
  refunded: GREEN,
  // Failure
  failed: RED,
  declined: RED,
  error: RED,
  rejected: RED,
  notsuccessful: RED,
  not_successful: RED,
  unsuccessful: RED,
  // Pending / In Progress
  pending: ORANGE,
  processing: ORANGE,
  inprogress: ORANGE,
  in_progress: ORANGE,
  review: ORANGE,
  incomplete: ORANGE,
  submitted: ORANGE,
  // Completed / Info
  completed: BLUE,
  // Closed / Terminated
  closed: GRAY,
  terminated: RED,
  active: GREEN,
  // Void
  void: ORANGE,
  voided: GRAY,
  cancelled: GRAY,
  void_authorization: ORANGE,
  'void authorization': ORANGE,
  voidauthorization: ORANGE,
  // Refund (alt blue tone) — kept aliasable if needed
  refund_initiated: BLUE,
  partiallyrefunded: BLUE,
  partially_refunded: BLUE,
  // Chargeback
  chargeback: PURPLE,
  disputed: PURPLE,
};

function normalize(status: string): string {
  return status.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getStatusStyle(status: string): StatusStyle {
  if (!status) return GRAY;
  const key = normalize(status);
  return (
    statusStyleMap[key] ??
    statusStyleMap[key.replace(/\s+/g, '')] ??
    statusStyleMap[key.replace(/\s+/g, '_')] ??
    GRAY
  );
}

export { statusStyleMap };
