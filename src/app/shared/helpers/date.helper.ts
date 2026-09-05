export function parseUtcDate(value: string | null | undefined): Date | null {
  if (!value) return null;

  const alreadyHasTimezone = /Z$|[+-]\d{2}:?\d{2}$/.test(value);
  const isoString = alreadyHasTimezone ? value : `${value}Z`;

  const parsed = new Date(isoString);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
