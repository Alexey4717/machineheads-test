import { describe, expect, it } from 'vitest';

import { postActions } from './actions';
import { parsePageFromSearch } from './parsePageFromSearch';
import { postInitialState, postReducer } from './reducer';
import type { Post, PostState } from './types';

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
      listStatus: 'success',
      listError: null,
    });
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

  it('DETAIL_SUCCESS upsert entity', () => {
    const prev = postReducer(
      postInitialState,
      postActions.listSuccess({ items: [postA], pagination }),
    );

    expect(postReducer(prev, postActions.detailSuccess(postB))).toMatchObject({
      entities: { 1: postA, 2: postB },
      detailStatus: 'success',
      currentDetailId: 2,
    });
  });

  it('CREATE_SUCCESS добавляет entity и id в listIds', () => {
    expect(
      postReducer(postInitialState, postActions.createSuccess(postA)),
    ).toMatchObject({
      entities: { 1: postA },
      listIds: [1],
      submitStatus: 'success',
      currentDetailId: 1,
    });
  });

  it('UPDATE_SUCCESS обновляет entity', () => {
    const prev = postReducer(
      postInitialState,
      postActions.listSuccess({ items: [postA], pagination }),
    );
    const updated = { ...postA, title: 'Обновлён' };

    expect(postReducer(prev, postActions.updateSuccess(updated))).toMatchObject(
      {
        entities: { 1: updated },
        listIds: [1],
        submitStatus: 'success',
      },
    );
  });

  it('REMOVE_SUCCESS удаляет из entities и listIds', () => {
    const prev = postReducer(
      postInitialState,
      postActions.listSuccess({ items: [postA, postB], pagination }),
    );

    expect(postReducer(prev, postActions.removeSuccess(1))).toEqual({
      ...prev,
      entities: { 2: postB },
      listIds: [2],
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
