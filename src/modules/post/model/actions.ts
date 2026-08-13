import type { NormalizedApiError } from '@/core/api/errorTypes';

import type { Post, PostFormValues, PostsListResult } from './types';

export const POST_LIST_REQUEST = 'post/LIST_REQUEST' as const;
export const POST_LIST_SUCCESS = 'post/LIST_SUCCESS' as const;
export const POST_LIST_RESTORE = 'post/LIST_RESTORE' as const;
export const POST_LIST_FAILURE = 'post/LIST_FAILURE' as const;

export const POST_DETAIL_REQUEST = 'post/DETAIL_REQUEST' as const;
export const POST_DETAIL_SUCCESS = 'post/DETAIL_SUCCESS' as const;
export const POST_DETAIL_FAILURE = 'post/DETAIL_FAILURE' as const;

export const POST_CREATE_REQUEST = 'post/CREATE_REQUEST' as const;
export const POST_CREATE_SUCCESS = 'post/CREATE_SUCCESS' as const;
export const POST_CREATE_FAILURE = 'post/CREATE_FAILURE' as const;

export const POST_UPDATE_REQUEST = 'post/UPDATE_REQUEST' as const;
export const POST_UPDATE_SUCCESS = 'post/UPDATE_SUCCESS' as const;
export const POST_UPDATE_FAILURE = 'post/UPDATE_FAILURE' as const;

export const POST_REMOVE_REQUEST = 'post/REMOVE_REQUEST' as const;
export const POST_REMOVE_SUCCESS = 'post/REMOVE_SUCCESS' as const;
export const POST_REMOVE_FAILURE = 'post/REMOVE_FAILURE' as const;

export const postActions = {
  listRequest: () => ({
    type: POST_LIST_REQUEST,
  }),
  listSuccess: (result: PostsListResult) => ({
    type: POST_LIST_SUCCESS,
    payload: result,
  }),
  listRestore: (payload: { page: number }) => ({
    type: POST_LIST_RESTORE,
    payload,
  }),
  listFailure: (error: NormalizedApiError) => ({
    type: POST_LIST_FAILURE,
    payload: error,
  }),

  detailRequest: (id: number) => ({
    type: POST_DETAIL_REQUEST,
    payload: id,
  }),
  detailSuccess: (post: Post) => ({
    type: POST_DETAIL_SUCCESS,
    payload: post,
  }),
  detailFailure: (error: NormalizedApiError) => ({
    type: POST_DETAIL_FAILURE,
    payload: error,
  }),

  createRequest: (values: PostFormValues) => ({
    type: POST_CREATE_REQUEST,
    payload: values,
  }),
  createSuccess: (post: Post) => ({
    type: POST_CREATE_SUCCESS,
    payload: post,
  }),
  createFailure: (error: NormalizedApiError) => ({
    type: POST_CREATE_FAILURE,
    payload: error,
  }),

  updateRequest: (payload: { id: number; values: PostFormValues }) => ({
    type: POST_UPDATE_REQUEST,
    payload,
  }),
  updateSuccess: (post: Post) => ({
    type: POST_UPDATE_SUCCESS,
    payload: post,
  }),
  updateFailure: (error: NormalizedApiError) => ({
    type: POST_UPDATE_FAILURE,
    payload: error,
  }),

  removeRequest: (id: number) => ({
    type: POST_REMOVE_REQUEST,
    payload: id,
  }),
  removeSuccess: (id: number) => ({
    type: POST_REMOVE_SUCCESS,
    payload: id,
  }),
  removeFailure: (error: NormalizedApiError) => ({
    type: POST_REMOVE_FAILURE,
    payload: error,
  }),
};

export type PostAction =
  | ReturnType<typeof postActions.listRequest>
  | ReturnType<typeof postActions.listSuccess>
  | ReturnType<typeof postActions.listRestore>
  | ReturnType<typeof postActions.listFailure>
  | ReturnType<typeof postActions.detailRequest>
  | ReturnType<typeof postActions.detailSuccess>
  | ReturnType<typeof postActions.detailFailure>
  | ReturnType<typeof postActions.createRequest>
  | ReturnType<typeof postActions.createSuccess>
  | ReturnType<typeof postActions.createFailure>
  | ReturnType<typeof postActions.updateRequest>
  | ReturnType<typeof postActions.updateSuccess>
  | ReturnType<typeof postActions.updateFailure>
  | ReturnType<typeof postActions.removeRequest>
  | ReturnType<typeof postActions.removeSuccess>
  | ReturnType<typeof postActions.removeFailure>;
