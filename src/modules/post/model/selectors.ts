import type { Post, PostState } from './types';

interface StateWithPost {
  post: PostState;
}

export const selectPostState = (state: StateWithPost) => state.post;

export const selectPostEntities = (state: StateWithPost) => state.post.entities;

export const selectPostListIds = (state: StateWithPost) => state.post.listIds;

export const selectPostList = (state: StateWithPost): Post[] =>
  state.post.listIds
    .map((id) => state.post.entities[id])
    .filter((post): post is Post => Boolean(post));

export const selectPostById =
  (id: number | null | undefined) =>
  (state: StateWithPost): Post | undefined =>
    id == null ? undefined : state.post.entities[id];

export const selectCurrentPost = (state: StateWithPost): Post | undefined => {
  const id = state.post.currentDetailId;
  return id == null ? undefined : state.post.entities[id];
};

export const selectPostPagination = (state: StateWithPost) =>
  state.post.pagination;

export const selectPostListStatus = (state: StateWithPost) =>
  state.post.listStatus;

export const selectPostListError = (state: StateWithPost) =>
  state.post.listError;

export const selectPostDetailStatus = (state: StateWithPost) =>
  state.post.detailStatus;

export const selectPostDetailError = (state: StateWithPost) =>
  state.post.detailError;

export const selectPostSubmitStatus = (state: StateWithPost) =>
  state.post.submitStatus;

export const selectPostSubmitError = (state: StateWithPost) =>
  state.post.submitError;

export const selectPostRemoveStatus = (state: StateWithPost) =>
  state.post.removeStatus;

export const selectPostRemoveError = (state: StateWithPost) =>
  state.post.removeError;

export const selectPostIsSubmitting = (state: StateWithPost) =>
  state.post.submitStatus === 'loading';

export const selectPostIsRemoving = (state: StateWithPost) =>
  state.post.removeStatus === 'loading';
