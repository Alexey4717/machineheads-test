import { describe, expect, it } from 'vitest';

import {
  selectAuthorList,
  selectAuthorOptions,
  selectAuthorState,
  selectCurrentAuthor,
} from './selectors';
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
  avatar: null,
  createdAt: '2024-01-03T00:00:00+00:00',
  updatedAt: '2024-01-04T00:00:00+00:00',
};

const state = {
  author: {
    entities: { 1: authorA, 2: authorB },
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
  } satisfies AuthorState,
};

describe('author selectors', () => {
  it('selectAuthorState возвращает slice', () => {
    expect(selectAuthorState(state)).toBe(state.author);
  });

  it('selectAuthorList сохраняет порядок listIds', () => {
    expect(selectAuthorList(state)).toEqual([authorB, authorA]);
  });

  it('selectCurrentAuthor', () => {
    expect(selectCurrentAuthor(state)).toEqual(authorA);
  });

  it('selectAuthorOptions: value=id, label=ФИО', () => {
    expect(selectAuthorOptions(state)).toEqual([
      { value: 2, label: 'Петров Пётр Петрович' },
      { value: 1, label: 'Иванов Иван Иванович' },
    ]);
  });
});
