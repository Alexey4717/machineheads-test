import { createSelector } from 'reselect';

import type { Post } from './types';

export const selectPostState = (state: RootState) => state.post;

export const selectPostEntities = createSelector(
  selectPostState,
  (post) => post.entities,
);

export const selectPostListIds = createSelector(
  selectPostState,
  (post) => post.listIds,
);

export const selectPostList = createSelector(
  [selectPostListIds, selectPostEntities],
  (listIds, entities): Post[] =>
    listIds
      .map((id) => entities[id])
      .filter((post): post is Post => Boolean(post)),
);

export const selectPostById = (id: number | null | undefined) =>
  createSelector(selectPostEntities, (entities): Post | undefined =>
    id == null ? undefined : entities[id],
  );

export const selectCurrentPost = createSelector(
  selectPostState,
  (post): Post | undefined => {
    const id = post.currentDetailId;
    return id == null ? undefined : post.entities[id];
  },
);

export const selectPostPagination = createSelector(
  selectPostState,
  (post) => post.pagination,
);

export const selectPostDetailFetchedAtMap = createSelector(
  selectPostState,
  (post) => post.detailFetchedAt,
);

export const selectPostDetailFetchedAt = (id: number | null | undefined) =>
  createSelector(
    selectPostDetailFetchedAtMap,
    (detailFetchedAt): number | undefined =>
      id == null ? undefined : detailFetchedAt[id],
  );

export const selectPostListCacheByPage = createSelector(
  selectPostState,
  (post) => post.listCacheByPage,
);

export const selectPostListStatus = createSelector(
  selectPostState,
  (post) => post.listStatus,
);

export const selectPostListError = createSelector(
  selectPostState,
  (post) => post.listError,
);

export const selectPostDetailStatus = createSelector(
  selectPostState,
  (post) => post.detailStatus,
);

export const selectPostDetailError = createSelector(
  selectPostState,
  (post) => post.detailError,
);

export const selectPostSubmitStatus = createSelector(
  selectPostState,
  (post) => post.submitStatus,
);

export const selectPostSubmitError = createSelector(
  selectPostState,
  (post) => post.submitError,
);

export const selectPostRemoveStatus = createSelector(
  selectPostState,
  (post) => post.removeStatus,
);

export const selectPostRemoveError = createSelector(
  selectPostState,
  (post) => post.removeError,
);

export const selectPostIsSubmitting = createSelector(
  selectPostSubmitStatus,
  (submitStatus) => submitStatus === 'loading',
);

export const selectPostIsRemoving = createSelector(
  selectPostRemoveStatus,
  (removeStatus) => removeStatus === 'loading',
);
