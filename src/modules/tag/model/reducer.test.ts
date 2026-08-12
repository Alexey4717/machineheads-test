import { describe, expect, it } from 'vitest';

import { tagActions } from './actions';
import { tagInitialState, tagReducer } from './reducer';
import type { Tag, TagState } from './types';

const tagA: Tag = {
  id: 1,
  name: 'Новости',
  code: 'news',
  sort: 10,
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

const tagB: Tag = {
  id: 2,
  name: 'Спорт',
  code: 'sport',
  sort: 20,
  createdAt: '2024-01-03T00:00:00+00:00',
  updatedAt: '2024-01-04T00:00:00+00:00',
};

describe('tagReducer', () => {
  it('LIST_REQUEST включает loading и сбрасывает error', () => {
    const prev: TagState = {
      ...tagInitialState,
      listError: { kind: 'unknown', message: 'old' },
    };

    expect(tagReducer(prev, tagActions.listRequest())).toEqual({
      ...prev,
      listStatus: 'loading',
      listError: null,
    });
  });

  it('LIST_SUCCESS нормализует entities и listIds', () => {
    expect(
      tagReducer(tagInitialState, tagActions.listSuccess([tagA, tagB])),
    ).toEqual({
      ...tagInitialState,
      entities: { 1: tagA, 2: tagB },
      listIds: [1, 2],
      listStatus: 'success',
      listError: null,
    });
  });

  it('DETAIL_SUCCESS upsert entity', () => {
    const prev = tagReducer(tagInitialState, tagActions.listSuccess([tagA]));

    expect(tagReducer(prev, tagActions.detailSuccess(tagB))).toMatchObject({
      entities: { 1: tagA, 2: tagB },
      detailStatus: 'success',
      currentDetailId: 2,
    });
  });

  it('CREATE_SUCCESS добавляет entity и id в listIds', () => {
    expect(
      tagReducer(tagInitialState, tagActions.createSuccess(tagA)),
    ).toMatchObject({
      entities: { 1: tagA },
      listIds: [1],
      submitStatus: 'success',
      currentDetailId: 1,
    });
  });

  it('UPDATE_SUCCESS обновляет entity', () => {
    const prev = tagReducer(tagInitialState, tagActions.listSuccess([tagA]));
    const updated = { ...tagA, name: 'Обновлён' };

    expect(tagReducer(prev, tagActions.updateSuccess(updated))).toMatchObject({
      entities: { 1: updated },
      listIds: [1],
      submitStatus: 'success',
    });
  });

  it('REMOVE_SUCCESS удаляет из entities и listIds', () => {
    const prev = tagReducer(
      tagInitialState,
      tagActions.listSuccess([tagA, tagB]),
    );

    expect(tagReducer(prev, tagActions.removeSuccess(1))).toEqual({
      ...prev,
      entities: { 2: tagB },
      listIds: [2],
      removeStatus: 'success',
      removeError: null,
      currentDetailId: null,
    });
  });

  it('CREATE_FAILURE сохраняет submitError', () => {
    const error = { kind: 'unknown' as const, message: 'fail' };

    expect(
      tagReducer(
        { ...tagInitialState, submitStatus: 'loading' },
        tagActions.createFailure(error),
      ),
    ).toEqual({
      ...tagInitialState,
      submitStatus: 'error',
      submitError: error,
    });
  });
});
