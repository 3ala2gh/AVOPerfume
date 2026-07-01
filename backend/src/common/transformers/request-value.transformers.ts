export function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export function normalizeLowercaseString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

export function toNumber(value: unknown): number {
  return Number(value);
}
