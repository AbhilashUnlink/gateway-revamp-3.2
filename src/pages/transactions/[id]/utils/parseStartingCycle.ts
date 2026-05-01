export function parseStartingCycle(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : undefined;
}
