import type { NormalizedApiError } from '@/core/api/errorTypes';

import type { Author, AuthorFormValues } from './types';

export const AUTHOR_LIST_REQUEST = 'author/LIST_REQUEST' as const;
export const AUTHOR_LIST_SUCCESS = 'author/LIST_SUCCESS' as const;
export const AUTHOR_LIST_FAILURE = 'author/LIST_FAILURE' as const;

export const AUTHOR_DETAIL_REQUEST = 'author/DETAIL_REQUEST' as const;
export const AUTHOR_DETAIL_SUCCESS = 'author/DETAIL_SUCCESS' as const;
export const AUTHOR_DETAIL_FAILURE = 'author/DETAIL_FAILURE' as const;

export const AUTHOR_CREATE_REQUEST = 'author/CREATE_REQUEST' as const;
export const AUTHOR_CREATE_SUCCESS = 'author/CREATE_SUCCESS' as const;
export const AUTHOR_CREATE_FAILURE = 'author/CREATE_FAILURE' as const;

export const AUTHOR_UPDATE_REQUEST = 'author/UPDATE_REQUEST' as const;
export const AUTHOR_UPDATE_SUCCESS = 'author/UPDATE_SUCCESS' as const;
export const AUTHOR_UPDATE_FAILURE = 'author/UPDATE_FAILURE' as const;

export const AUTHOR_REMOVE_REQUEST = 'author/REMOVE_REQUEST' as const;
export const AUTHOR_REMOVE_SUCCESS = 'author/REMOVE_SUCCESS' as const;
export const AUTHOR_REMOVE_FAILURE = 'author/REMOVE_FAILURE' as const;

export const authorActions = {
  listRequest: () => ({
    type: AUTHOR_LIST_REQUEST,
  }),
  listSuccess: (authors: Author[]) => ({
    type: AUTHOR_LIST_SUCCESS,
    payload: authors,
  }),
  listFailure: (error: NormalizedApiError) => ({
    type: AUTHOR_LIST_FAILURE,
    payload: error,
  }),

  detailRequest: (id: number) => ({
    type: AUTHOR_DETAIL_REQUEST,
    payload: id,
  }),
  detailSuccess: (author: Author) => ({
    type: AUTHOR_DETAIL_SUCCESS,
    payload: author,
  }),
  detailFailure: (error: NormalizedApiError) => ({
    type: AUTHOR_DETAIL_FAILURE,
    payload: error,
  }),

  createRequest: (values: AuthorFormValues) => ({
    type: AUTHOR_CREATE_REQUEST,
    payload: values,
  }),
  createSuccess: (author: Author) => ({
    type: AUTHOR_CREATE_SUCCESS,
    payload: author,
  }),
  createFailure: (error: NormalizedApiError) => ({
    type: AUTHOR_CREATE_FAILURE,
    payload: error,
  }),

  updateRequest: (payload: { id: number; values: AuthorFormValues }) => ({
    type: AUTHOR_UPDATE_REQUEST,
    payload,
  }),
  updateSuccess: (author: Author) => ({
    type: AUTHOR_UPDATE_SUCCESS,
    payload: author,
  }),
  updateFailure: (error: NormalizedApiError) => ({
    type: AUTHOR_UPDATE_FAILURE,
    payload: error,
  }),

  removeRequest: (id: number) => ({
    type: AUTHOR_REMOVE_REQUEST,
    payload: id,
  }),
  removeSuccess: (id: number) => ({
    type: AUTHOR_REMOVE_SUCCESS,
    payload: id,
  }),
  removeFailure: (error: NormalizedApiError) => ({
    type: AUTHOR_REMOVE_FAILURE,
    payload: error,
  }),
};

export type AuthorAction =
  | ReturnType<typeof authorActions.listRequest>
  | ReturnType<typeof authorActions.listSuccess>
  | ReturnType<typeof authorActions.listFailure>
  | ReturnType<typeof authorActions.detailRequest>
  | ReturnType<typeof authorActions.detailSuccess>
  | ReturnType<typeof authorActions.detailFailure>
  | ReturnType<typeof authorActions.createRequest>
  | ReturnType<typeof authorActions.createSuccess>
  | ReturnType<typeof authorActions.createFailure>
  | ReturnType<typeof authorActions.updateRequest>
  | ReturnType<typeof authorActions.updateSuccess>
  | ReturnType<typeof authorActions.updateFailure>
  | ReturnType<typeof authorActions.removeRequest>
  | ReturnType<typeof authorActions.removeSuccess>
  | ReturnType<typeof authorActions.removeFailure>;
