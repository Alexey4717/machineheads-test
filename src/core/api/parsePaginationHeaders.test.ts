import { AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { parsePaginationHeaders } from './parsePaginationHeaders';

describe('parsePaginationHeaders', () => {
  it('парсит строковые заголовки из plain-объекта', () => {
    expect(
      parsePaginationHeaders({
        'X-Pagination-Current-Page': '2',
        'X-Pagination-Page-Count': '10',
        'X-Pagination-Per-Page': '20',
        'X-Pagination-Total-Count': '195',
      }),
    ).toEqual({
      currentPage: 2,
      pageCount: 10,
      perPage: 20,
      totalCount: 195,
    });
  });

  it('парсит lowercase-заголовки (как у axios)', () => {
    expect(
      parsePaginationHeaders({
        'x-pagination-current-page': '1',
        'x-pagination-page-count': '3',
        'x-pagination-per-page': '15',
        'x-pagination-total-count': '40',
      }),
    ).toEqual({
      currentPage: 1,
      pageCount: 3,
      perPage: 15,
      totalCount: 40,
    });
  });

  it('парсит числовые значения заголовков', () => {
    expect(
      parsePaginationHeaders({
        'x-pagination-current-page': 1,
        'x-pagination-page-count': 1,
        'x-pagination-per-page': 10,
        'x-pagination-total-count': 5,
      }),
    ).toEqual({
      currentPage: 1,
      pageCount: 1,
      perPage: 10,
      totalCount: 5,
    });
  });

  it('читает заголовки через AxiosHeaders.get', () => {
    const headers = new AxiosHeaders();
    headers.set('X-Pagination-Current-Page', '4');
    headers.set('X-Pagination-Page-Count', '8');
    headers.set('X-Pagination-Per-Page', '25');
    headers.set('X-Pagination-Total-Count', '200');

    expect(parsePaginationHeaders(headers)).toEqual({
      currentPage: 4,
      pageCount: 8,
      perPage: 25,
      totalCount: 200,
    });
  });

  it('бросает при отсутствии обязательного заголовка', () => {
    expect(() =>
      parsePaginationHeaders({
        'x-pagination-current-page': '1',
        'x-pagination-page-count': '1',
        'x-pagination-per-page': '10',
      }),
    ).toThrow(/x-pagination-total-count/);
  });

  it('бросает при нечисловом значении', () => {
    expect(() =>
      parsePaginationHeaders({
        'x-pagination-current-page': 'abc',
        'x-pagination-page-count': '1',
        'x-pagination-per-page': '10',
        'x-pagination-total-count': '5',
      }),
    ).toThrow(/x-pagination-current-page/);
  });
});
