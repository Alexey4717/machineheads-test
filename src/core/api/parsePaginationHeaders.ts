import type { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';

export interface PaginationMeta {
  currentPage: number;
  pageCount: number;
  perPage: number;
  totalCount: number;
}

type ResponseHeaders = RawAxiosResponseHeaders | AxiosResponseHeaders;

const HEADER_CURRENT_PAGE = 'x-pagination-current-page';
const HEADER_PAGE_COUNT = 'x-pagination-page-count';
const HEADER_PER_PAGE = 'x-pagination-per-page';
const HEADER_TOTAL_COUNT = 'x-pagination-total-count';

function readHeader(headers: ResponseHeaders, name: string): unknown {
  if (
    headers &&
    typeof headers === 'object' &&
    'get' in headers &&
    typeof headers.get === 'function'
  ) {
    return headers.get(name);
  }

  const record = headers as Record<string, unknown>;
  const lowerName = name.toLowerCase();

  if (lowerName in record || name in record) {
    return record[name] ?? record[lowerName];
  }

  const matchedKey = Object.keys(record).find(
    (key) => key.toLowerCase() === lowerName,
  );

  return matchedKey ? record[matchedKey] : undefined;
}

function parseHeaderNumber(value: unknown, headerName: string): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  throw new Error(
    `Invalid pagination header "${headerName}": ${String(value)}`,
  );
}

/**
 * Читает метаданные пагинации из заголовков ответа API.
 */
export function parsePaginationHeaders(
  headers: ResponseHeaders,
): PaginationMeta {
  return {
    currentPage: parseHeaderNumber(
      readHeader(headers, HEADER_CURRENT_PAGE),
      HEADER_CURRENT_PAGE,
    ),
    pageCount: parseHeaderNumber(
      readHeader(headers, HEADER_PAGE_COUNT),
      HEADER_PAGE_COUNT,
    ),
    perPage: parseHeaderNumber(
      readHeader(headers, HEADER_PER_PAGE),
      HEADER_PER_PAGE,
    ),
    totalCount: parseHeaderNumber(
      readHeader(headers, HEADER_TOTAL_COUNT),
      HEADER_TOTAL_COUNT,
    ),
  };
}
