import type { NormalizedApiError } from '@/core/api/errorTypes';

import type { Tag, TagFormValues } from './types';

export const TAG_LIST_REQUEST = 'tag/LIST_REQUEST' as const;
export const TAG_LIST_SUCCESS = 'tag/LIST_SUCCESS' as const;
export const TAG_LIST_FAILURE = 'tag/LIST_FAILURE' as const;

export const TAG_DETAIL_REQUEST = 'tag/DETAIL_REQUEST' as const;
export const TAG_DETAIL_SUCCESS = 'tag/DETAIL_SUCCESS' as const;
export const TAG_DETAIL_FAILURE = 'tag/DETAIL_FAILURE' as const;

export const TAG_CREATE_REQUEST = 'tag/CREATE_REQUEST' as const;
export const TAG_CREATE_SUCCESS = 'tag/CREATE_SUCCESS' as const;
export const TAG_CREATE_FAILURE = 'tag/CREATE_FAILURE' as const;

export const TAG_UPDATE_REQUEST = 'tag/UPDATE_REQUEST' as const;
export const TAG_UPDATE_SUCCESS = 'tag/UPDATE_SUCCESS' as const;
export const TAG_UPDATE_FAILURE = 'tag/UPDATE_FAILURE' as const;

export const TAG_REMOVE_REQUEST = 'tag/REMOVE_REQUEST' as const;
export const TAG_REMOVE_SUCCESS = 'tag/REMOVE_SUCCESS' as const;
export const TAG_REMOVE_FAILURE = 'tag/REMOVE_FAILURE' as const;

export const tagActions = {
  listRequest: () => ({
    type: TAG_LIST_REQUEST,
  }),
  listSuccess: (tags: Tag[]) => ({
    type: TAG_LIST_SUCCESS,
    payload: tags,
  }),
  listFailure: (error: NormalizedApiError) => ({
    type: TAG_LIST_FAILURE,
    payload: error,
  }),

  detailRequest: (id: number) => ({
    type: TAG_DETAIL_REQUEST,
    payload: id,
  }),
  detailSuccess: (tag: Tag) => ({
    type: TAG_DETAIL_SUCCESS,
    payload: tag,
  }),
  detailFailure: (error: NormalizedApiError) => ({
    type: TAG_DETAIL_FAILURE,
    payload: error,
  }),

  createRequest: (values: TagFormValues) => ({
    type: TAG_CREATE_REQUEST,
    payload: values,
  }),
  createSuccess: (tag: Tag) => ({
    type: TAG_CREATE_SUCCESS,
    payload: tag,
  }),
  createFailure: (error: NormalizedApiError) => ({
    type: TAG_CREATE_FAILURE,
    payload: error,
  }),

  updateRequest: (payload: { id: number; values: TagFormValues }) => ({
    type: TAG_UPDATE_REQUEST,
    payload,
  }),
  updateSuccess: (tag: Tag) => ({
    type: TAG_UPDATE_SUCCESS,
    payload: tag,
  }),
  updateFailure: (error: NormalizedApiError) => ({
    type: TAG_UPDATE_FAILURE,
    payload: error,
  }),

  removeRequest: (id: number) => ({
    type: TAG_REMOVE_REQUEST,
    payload: id,
  }),
  removeSuccess: (id: number) => ({
    type: TAG_REMOVE_SUCCESS,
    payload: id,
  }),
  removeFailure: (error: NormalizedApiError) => ({
    type: TAG_REMOVE_FAILURE,
    payload: error,
  }),
};

export type TagAction =
  | ReturnType<typeof tagActions.listRequest>
  | ReturnType<typeof tagActions.listSuccess>
  | ReturnType<typeof tagActions.listFailure>
  | ReturnType<typeof tagActions.detailRequest>
  | ReturnType<typeof tagActions.detailSuccess>
  | ReturnType<typeof tagActions.detailFailure>
  | ReturnType<typeof tagActions.createRequest>
  | ReturnType<typeof tagActions.createSuccess>
  | ReturnType<typeof tagActions.createFailure>
  | ReturnType<typeof tagActions.updateRequest>
  | ReturnType<typeof tagActions.updateSuccess>
  | ReturnType<typeof tagActions.updateFailure>
  | ReturnType<typeof tagActions.removeRequest>
  | ReturnType<typeof tagActions.removeSuccess>
  | ReturnType<typeof tagActions.removeFailure>;
