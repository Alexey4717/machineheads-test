import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { authorActions } from './actions';
import { authorInitialState, authorReducer } from './reducer';
import type { Author, AuthorState } from './types';

const authorA: Author = {
  id: 1,
  name: 'Иван',
  lastName: 'Иванов',
  secondName: 'Иванович',
  avatar: null,
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

const authorB: Author = {
  id: 2,
  name: 'Пётр',
  lastName: 'Петров',
  secondName: 'Петрович',
  avatar: {
    id: 10,
    name: 'avatar.png',
    url: 'https://example.com/avatar.png',
  },
  shortDescription: 'Кратко',
  description: 'Полное',
  createdAt: '2024-01-03T00:00:00+00:00',
  updatedAt: '2024-01-04T00:00:00+00:00',
};

describe('authorReducer', () => {
  const now = 1_700_000_000_000;

  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('LIST_REQUEST включает loading и сбрасывает error', () => {
    const prev: AuthorState = {
      ...authorInitialState,
      listError: { kind: 'unknown', message: 'old' },
    };

    expect(authorReducer(prev, authorActions.listRequest())).toEqual({
      ...prev,
      listStatus: 'loading',
      listError: null,
    });
  });

  it('LIST_SUCCESS нормализует entities и listIds', () => {
    expect(
      authorReducer(
        authorInitialState,
        authorActions.listSuccess([authorA, authorB]),
      ),
    ).toEqual({
      ...authorInitialState,
      entities: { 1: authorA, 2: authorB },
      listIds: [1, 2],
      listFetchedAt: now,
      listStatus: 'success',
      listError: null,
    });
  });

  it('LIST_SUCCESS не помечает detail как свежий и мержит detail-поля', () => {
    const withDetail = authorReducer(
      authorInitialState,
      authorActions.detailSuccess(authorB),
    );

    const listOnly: Author = {
      id: 2,
      name: 'Пётр',
      lastName: 'Петров',
      secondName: 'Петрович',
      avatar: authorB.avatar,
      createdAt: authorB.createdAt,
      updatedAt: authorB.updatedAt,
    };

    const next = authorReducer(
      withDetail,
      authorActions.listSuccess([listOnly]),
    );

    expect(next.detailFetchedAt).toEqual({ 2: now });
    expect(next.entities[2]).toMatchObject({
      name: 'Пётр',
      shortDescription: 'Кратко',
      description: 'Полное',
    });
  });

  it('DETAIL_SUCCESS upsert entity', () => {
    const prev = authorReducer(
      authorInitialState,
      authorActions.listSuccess([authorA]),
    );

    expect(
      authorReducer(prev, authorActions.detailSuccess(authorB)),
    ).toMatchObject({
      entities: { 1: authorA, 2: authorB },
      detailFetchedAt: { 2: now },
      detailStatus: 'success',
      currentDetailId: 2,
    });
  });

  it('CREATE_SUCCESS добавляет entity и id в listIds', () => {
    expect(
      authorReducer(authorInitialState, authorActions.createSuccess(authorA)),
    ).toMatchObject({
      entities: { 1: authorA },
      listIds: [1],
      detailFetchedAt: { 1: now },
      listFetchedAt: now,
      submitStatus: 'success',
      currentDetailId: 1,
    });
  });

  it('UPDATE_SUCCESS обновляет entity', () => {
    const prev = authorReducer(
      authorInitialState,
      authorActions.listSuccess([authorA]),
    );
    const updated = { ...authorA, name: 'Алексей' };

    expect(
      authorReducer(prev, authorActions.updateSuccess(updated)),
    ).toMatchObject({
      entities: { 1: updated },
      listIds: [1],
      detailFetchedAt: { 1: now },
      listFetchedAt: now,
      submitStatus: 'success',
    });
  });

  it('REMOVE_SUCCESS удаляет из entities и listIds', () => {
    const prev = authorReducer(
      authorInitialState,
      authorActions.listSuccess([authorA, authorB]),
    );

    expect(authorReducer(prev, authorActions.removeSuccess(1))).toEqual({
      ...prev,
      entities: { 2: authorB },
      listIds: [2],
      detailFetchedAt: {},
      listFetchedAt: now,
      removeStatus: 'success',
      removeError: null,
      currentDetailId: null,
    });
  });

  it('CREATE_FAILURE сохраняет submitError', () => {
    const error = { kind: 'unknown' as const, message: 'fail' };

    expect(
      authorReducer(
        { ...authorInitialState, submitStatus: 'loading' },
        authorActions.createFailure(error),
      ),
    ).toEqual({
      ...authorInitialState,
      submitStatus: 'error',
      submitError: error,
    });
  });
});
