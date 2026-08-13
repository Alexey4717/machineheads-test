import { describe, expect, it } from 'vitest';

import {
  selectCurrentTag,
  selectTagDetailFetchedAt,
  selectTagList,
  selectTagListFetchedAt,
  selectTagOptions,
  selectTagState,
} from './selectors';
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

const state = {
  tag: {
    entities: { 1: tagA, 2: tagB },
    listIds: [2, 1],
    listStatus: 'success',
    listError: null,
    detailStatus: 'success',
    detailError: null,
    currentDetailId: 1,
    detailFetchedAt: { 1: 1_000 },
    listFetchedAt: 2_000,
    submitStatus: 'idle',
    submitError: null,
    removeStatus: 'idle',
    removeError: null,
  } satisfies TagState,
} as unknown as RootState;

describe('tag selectors', () => {
  it('selectTagState возвращает slice', () => {
    expect(selectTagState(state)).toBe(state.tag);
  });

  it('selectTagList сохраняет порядок listIds', () => {
    expect(selectTagList(state)).toEqual([tagB, tagA]);
  });

  it('selectCurrentTag', () => {
    expect(selectCurrentTag(state)).toEqual(tagA);
  });

  it('selectTagOptions: value=id, label=name', () => {
    expect(selectTagOptions(state)).toEqual([
      { value: 2, label: 'Спорт' },
      { value: 1, label: 'Новости' },
    ]);
  });

  it('selectTagListFetchedAt', () => {
    expect(selectTagListFetchedAt(state)).toBe(2_000);
  });

  it('selectTagDetailFetchedAt', () => {
    expect(selectTagDetailFetchedAt(1)(state)).toBe(1_000);
    expect(selectTagDetailFetchedAt(2)(state)).toBeUndefined();
    expect(selectTagDetailFetchedAt(null)(state)).toBeUndefined();
  });
});
