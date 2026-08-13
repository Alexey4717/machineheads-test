/**
 * Читает номер страницы из `location.search` (`?page=N`).
 * Без параметра / невалидное значение → 1.
 */
export function parsePageFromSearch(search: string): number {
  const normalized = search.startsWith('?') ? search.slice(1) : search;
  const raw = new URLSearchParams(normalized).get('page');

  if (raw == null || raw.trim() === '') {
    return 1;
  }

  const page = Number(raw);
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1;
}
