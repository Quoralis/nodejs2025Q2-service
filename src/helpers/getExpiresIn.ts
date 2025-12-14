export function getExpiresIn(
  value: string | undefined,
  fallback: number,
): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}
