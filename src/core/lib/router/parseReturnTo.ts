/** Query-параметр для возврата после создания связанной сущности. */
export const RETURN_TO_QUERY_PARAM = 'returnTo';

/**
 * Читает безопасный путь возврата из `location.search` (`?returnTo=...`).
 * Разрешены только relative path, начинающиеся с `/` (не `//` — open redirect).
 */
export function parseReturnTo(search: string): string | null {
  const normalized = search.startsWith('?') ? search.slice(1) : search;
  const raw = new URLSearchParams(normalized).get(RETURN_TO_QUERY_PARAM);

  if (raw == null || raw.trim() === '') {
    return null;
  }

  if (!raw.startsWith('/') || raw.startsWith('//')) {
    return null;
  }

  return raw;
}

/** Собирает URL с `?returnTo=` (значение кодируется). */
export function withReturnTo(path: string, returnTo: string): string {
  const params = new URLSearchParams({
    [RETURN_TO_QUERY_PARAM]: returnTo,
  });
  return `${path}?${params.toString()}`;
}
