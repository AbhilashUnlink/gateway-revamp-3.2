export interface StatusStyle {
  bg: string;
  text: string;
}

const statusStyleMap: Record<string, StatusStyle> = {
  authorization: { bg: 'bg-[#c6f3da]', text: 'text-[#1e8f1f]' },
  approved: { bg: 'bg-[#c6f3da]', text: 'text-[#1e8f1f]' },
  success: { bg: 'bg-[#c6f3da]', text: 'text-[#1e8f1f]' },
  capture: { bg: 'bg-[#c6f3da]', text: 'text-[#1e8f1f]' },
  settled: { bg: 'bg-[#c6f3da]', text: 'text-[#1e8f1f]' },
  failed: { bg: 'bg-[#fde8e8]', text: 'text-[#c53030]' },
  declined: { bg: 'bg-[#fde8e8]', text: 'text-[#c53030]' },
  error: { bg: 'bg-[#fde8e8]', text: 'text-[#c53030]' },
  rejected: { bg: 'bg-[#fde8e8]', text: 'text-[#c53030]' },
  pending: { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  processing: { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  refund: { bg: 'bg-[#dbeafe]', text: 'text-[#1e40af]' },
  refunded: { bg: 'bg-[#dbeafe]', text: 'text-[#1e40af]' },
  void: { bg: 'bg-[#f3f4f6]', text: 'text-[#4b5563]' },
  voided: { bg: 'bg-[#f3f4f6]', text: 'text-[#4b5563]' },
  cancelled: { bg: 'bg-[#f3f4f6]', text: 'text-[#4b5563]' },
  chargeback: { bg: 'bg-[#ede9fe]', text: 'text-[#5b21b6]' },
};

export function getStatusStyle(status: string): StatusStyle {
  return statusStyleMap[status.toLowerCase()] ?? { bg: 'bg-[#f3f4f6]', text: 'text-[#4b5563]' };
}

export { statusStyleMap };
