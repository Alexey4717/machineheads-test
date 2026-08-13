import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { postActions } from './actions';
import { parsePageFromSearch } from './parsePageFromSearch';
import { postInitialState, postReducer } from './reducer';
import type { Post, PostListPageCache, PostState } from './types';

const postA: Post = {
  id: 1,
  title: 'Первый',
  code: 'first',
  authorName: 'Иванов',
  previewPicture: null,
  tagNames: ['news'],
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

const postB: Post = {
  id: 2,
  title: 'Второй',
  code: 'second',
  authorName: 'Петров',
  previewPicture: {
    id: 10,
    name: 'preview.png',
    url: 'https://example.com/preview.png',
  },
  tagNames: ['tech'],
  text: 'Текст',
  author: {
    id: 5,
    fullName: 'Петров Пётр',
    avatar: null,
  },
  tags: [{ id: 3, name: 'tech', code: 'tech' }],
  createdAt: '2024-01-03T00:00:00+00:00',
  updatedAt: '2024-01-04T00:00:00+00:00',
};

const pagination = {
  currentPage: 1,
  pageCount: 2,
  perPage: 10,
  totalCount: 15,
};

const paginationPage2 = {
  currentPage: 2,
  pageCount: 2,
  perPage: 10,
  totalCount: 15,
};

const page1Cache: PostListPageCache = {
  ids: [1, 2],
  fetchedAt: 1_700_000_000_000,
  pagination,
};

describe('parsePageFromSearch', () => {
  it('без page → 1', () => {
    expect(parsePageFromSearch('')).toBe(1);
    expect(parsePageFromSearch('?')).toBe(1);
  });

  it('читает валидный page', () => {
    expect(parsePageFromSearch('?page=3')).toBe(3);
    expect(parsePageFromSearch('page=2')).toBe(2);
  });

  it('невалидный page → 1', () => {
    expect(parsePageFromSearch('?page=0')).toBe(1);
    expect(parsePageFromSearch('?page=-1')).toBe(1);
    expect(parsePageFromSearch('?page=abc')).toBe(1);
  });
});

describe('postReducer', () => {
  const now = 1_700_000_000_000;

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('LIST_REQUEST включает loading и сбрасывает error', () => {
    const prev: PostState = {
      ...postInitialState,
      listError: { kind: 'unknown', message: 'old' },
    };

    expect(postReducer(prev, postActions.listRequest())).toEqual({
      ...prev,
      listStatus: 'loading',
      listError: null,
    });
  });

  it('LIST_SUCCESS нормализует entities, listIds и pagination', () => {
    expect(
      postReducer(
        postInitialState,
        postActions.listSuccess({ items: [postA, postB], pagination }),
      ),
    ).toEqual({
      ...postInitialState,
      entities: { 1: postA, 2: postB },
      listIds: [1, 2],
      pagination,
      listCacheByPage: {
        1: { ids: [1, 2], fetchedAt: now, pagination },
      },
      listStatus: 'success',
      listError: null,
    });
  });

  it('LIST_SUCCESS не помечает detail как свежий', () => {
    const next = postReducer(
      postInitialState,
      postActions.listSuccess({ items: [postA, postB], pagination }),
    );

    expect(next.detailFetchedAt).toEqual({});
  });

  it('LIST_SUCCESS page 1 затем page 2: обе страницы в кэше, текущие listIds — page 2', () => {
    const page1 = postReducer(
      postInitialState,
      postActions.listSuccess({ items: [postA], pagination }),
    );
    const page2 = postReducer(
      page1,
      postActions.listSuccess({ items: [postB], pagination: paginationPage2 }),
    );

    expect(page2.listIds).toEqual([2]);
    expect(page2.pagination).toEqual(paginationPage2);
    expect(page2.listCacheByPage).toEqual({
      1: { ids: [1], fetchedAt: now, pagination },
      2: { ids: [2], fetchedAt: now, pagination: paginationPage2 },
    });
    expect(page2.entities).toEqual({ 1: postA, 2: postB });
  });

  it('LIST_SUCCESS мержит detail-поля с list-item', () => {
    const withDetail = postReducer(
      postInitialState,
      postActions.detailSuccess(postB),
    );

    const listOnly: Post = {
      id: 2,
      title: 'Второй (list)',
      code: 'second',
      authorName: 'Петров',
      previewPicture: postB.previewPicture,
      tagNames: ['tech'],
      createdAt: postB.createdAt,
      updatedAt: postB.updatedAt,
    };

    const next = postReducer(
      withDetail,
      postActions.listSuccess({ items: [listOnly], pagination }),
    );

    expect(next.entities[2]).toMatchObject({
      title: 'Второй (list)',
      text: 'Текст',
      author: postB.author,
      tags: postB.tags,
    });
  });

  it('LIST_RESTORE копирует кэш страницы в listIds без обновления fetchedAt', () => {
    const prev: PostState = {
      ...postInitialState,
      entities: { 1: postA, 2: postB },
      listIds: [2],
      pagination: paginationPage2,
      listCacheByPage: {
        1: page1Cache,
        2: {
          ids: [2],
          fetchedAt: now,
          pagination: paginationPage2,
        },
      },
      listStatus: 'loading',
    };

    const next = postReducer(prev, postActions.listRestore({ page: 1 }));

    expect(next.listIds).toEqual([1, 2]);
    expect(next.pagination).toEqual(pagination);
    expect(next.listStatus).toBe('success');
    expect(next.listCacheByPage[1]?.fetchedAt).toBe(now);
  });

  it('LIST_RESTORE без страницы в кэше — no-op', () => {
    expect(
      postReducer(postInitialState, postActions.listRestore({ page: 3 })),
    ).toEqual(postInitialState);
  });

  it('DETAIL_SUCCESS upsert entity', () => {
    const prev = postReducer(
      postInitialState,
      postActions.listSuccess({ items: [postA], pagination }),
    );

    expect(postReducer(prev, postActions.detailSuccess(postB))).toMatchObject({
      entities: { 1: postA, 2: postB },
      detailFetchedAt: { 2: now },
      detailStatus: 'success',
      currentDetailId: 2,
    });
  });

  it('CREATE_SUCCESS добавляет entity и id в listIds и помечает страницы stale', () => {
    const prev = postReducer(
      postInitialState,
      postActions.listSuccess({ items: [postA], pagination }),
    );

    expect(postReducer(prev, postActions.createSuccess(postB))).toMatchObject({
      entities: { 1: postA, 2: postB },
      listIds: [1, 2],
      detailFetchedAt: { 2: now },
      listCacheByPage: {
        1: { ids: [1], fetchedAt: 0, pagination },
      },
      submitStatus: 'success',
      currentDetailId: 2,
    });
  });

  it('UPDATE_SUCCESS обновляет entity и помечает все страницы stale', () => {
    const withTwoPages = postReducer(
      postReducer(
        postInitialState,
        postActions.listSuccess({ items: [postA], pagination }),
      ),
      postActions.listSuccess({ items: [postB], pagination: paginationPage2 }),
    );
    const updated = { ...postA, title: 'Обновлён' };

    const next = postReducer(withTwoPages, postActions.updateSuccess(updated));

    expect(next).toMatchObject({
      entities: { 1: updated, 2: postB },
      listIds: [2],
      detailFetchedAt: { 1: now },
      submitStatus: 'success',
    });
    expect(next.listCacheByPage[1]?.fetchedAt).toBe(0);
    expect(next.listCacheByPage[2]?.fetchedAt).toBe(0);
    expect(next.listCacheByPage[1]?.ids).toEqual([1]);
    expect(next.listCacheByPage[2]?.ids).toEqual([2]);
  });

  it('REMOVE_SUCCESS удаляет из entities, listIds и всех страниц кэша', () => {
    const prev = postReducer(
      postReducer(
        postInitialState,
        postActions.listSuccess({ items: [postA, postB], pagination }),
      ),
      postActions.listSuccess({ items: [postB], pagination: paginationPage2 }),
    );

    expect(postReducer(prev, postActions.removeSuccess(2))).toEqual({
      ...prev,
      entities: { 1: postA },
      listIds: [],
      detailFetchedAt: {},
      listCacheByPage: {
        1: { ids: [1], fetchedAt: 0, pagination },
        2: { ids: [], fetchedAt: 0, pagination: paginationPage2 },
      },
      removeStatus: 'success',
      removeError: null,
      currentDetailId: null,
    });
  });

  it('CREATE_FAILURE сохраняет submitError', () => {
    const error = { kind: 'unknown' as const, message: 'fail' };

    expect(
      postReducer(
        { ...postInitialState, submitStatus: 'loading' },
        postActions.createFailure(error),
      ),
    ).toEqual({
      ...postInitialState,
      submitStatus: 'error',
      submitError: error,
    });
  });
});
