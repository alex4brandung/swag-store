export function normalizeSearchParam(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}
