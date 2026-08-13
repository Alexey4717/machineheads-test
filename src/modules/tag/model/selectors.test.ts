import { describe, expect, it } from 'vitest';

import {
  selectCurrentTag,
  selectTagList,
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
});
