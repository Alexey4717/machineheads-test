export const DEFAULT_STALE_TIME_MS = 60_000;

export function isFresh(
  fetchedAt: number | undefined,
  staleTime = DEFAULT_STALE_TIME_MS,
): boolean {
  return fetchedAt != null && Date.now() - fetchedAt < staleTime;
}
