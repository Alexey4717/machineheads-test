import { describe, expect, it } from 'vitest';

import {
  selectCurrentPost,
  selectPostList,
  selectPostPagination,
  selectPostState,
} from './selectors';
import type { Post, PostState } from './types';

const postA: Post = {
  id: 1,
  title: 'Первый',
  code: 'first',
  authorName: 'Иванов',
  previewPicture: null,
  tagNames: [],
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

const postB: Post = {
  id: 2,
  title: 'Второй',
  code: 'second',
  authorName: 'Петров',
  previewPicture: null,
  tagNames: ['a'],
  createdAt: '2024-01-03T00:00:00+00:00',
  updatedAt: '2024-01-04T00:00:00+00:00',
};

const pagination = {
  currentPage: 2,
  pageCount: 3,
  perPage: 10,
  totalCount: 25,
};

const state = {
  post: {
    entities: { 1: postA, 2: postB },
    listIds: [2, 1],
    pagination,
    listStatus: 'success',
    listError: null,
    detailStatus: 'success',
    detailError: null,
    currentDetailId: 1,
    submitStatus: 'idle',
    submitError: null,
    removeStatus: 'idle',
    removeError: null,
  } satisfies PostState,
} as unknown as RootState;

describe('post selectors', () => {
  it('selectPostState возвращает slice', () => {
    expect(selectPostState(state)).toBe(state.post);
  });

  it('selectPostList сохраняет порядок listIds', () => {
    expect(selectPostList(state)).toEqual([postB, postA]);
  });

  it('selectCurrentPost', () => {
    expect(selectCurrentPost(state)).toEqual(postA);
  });

  it('selectPostPagination', () => {
    expect(selectPostPagination(state)).toEqual(pagination);
  });
});
