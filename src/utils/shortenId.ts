export function shortenId(id: string): string {
  if (!id) return '—';
  if (id.length <= 18) return id;
  return `${id.slice(0, 9)}....${id.slice(-7)}`;
}
