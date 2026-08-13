import type { PostAction } from './actions';
import {
  POST_CREATE_FAILURE,
  POST_CREATE_REQUEST,
  POST_CREATE_SUCCESS,
  POST_DETAIL_FAILURE,
  POST_DETAIL_REQUEST,
  POST_DETAIL_SUCCESS,
  POST_LIST_FAILURE,
  POST_LIST_REQUEST,
  POST_LIST_SUCCESS,
  POST_REMOVE_FAILURE,
  POST_REMOVE_REQUEST,
  POST_REMOVE_SUCCESS,
  POST_UPDATE_FAILURE,
  POST_UPDATE_REQUEST,
  POST_UPDATE_SUCCESS,
} from './actions';
import type { Post, PostsListResult, PostState } from './types';

export const postInitialState: PostState = {
  entities: {},
  listIds: [],
  pagination: null,
  listStatus: 'idle',
  listError: null,
  detailStatus: 'idle',
  detailError: null,
  currentDetailId: null,
  submitStatus: 'idle',
  submitError: null,
  removeStatus: 'idle',
  removeError: null,
};

function upsertEntity(
  entities: Record<number, Post>,
  post: Post,
): Record<number, Post> {
  const prev = entities[post.id];
  return {
    ...entities,
    [post.id]: prev ? { ...prev, ...post } : post,
  };
}

function ensureListId(listIds: number[], id: number): number[] {
  return listIds.includes(id) ? listIds : [...listIds, id];
}

export function postReducer(
  state: PostState = postInitialState,
  action: PostAction | { type: string },
): PostState {
  switch (action.type) {
    case POST_LIST_REQUEST:
      return {
        ...state,
        listStatus: 'loading',
        listError: null,
      };

    case POST_LIST_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const { items, pagination } = action.payload as PostsListResult;
      let entities = { ...state.entities };
      const listIds: number[] = [];

      for (const post of items) {
        entities = upsertEntity(entities, post);
        listIds.push(post.id);
      }

      return {
        ...state,
        entities,
        listIds,
        pagination,
        listStatus: 'success',
        listError: null,
      };
    }

    case POST_LIST_FAILURE:
      return {
        ...state,
        listStatus: 'error',
        listError: 'payload' in action ? action.payload : state.listError,
      };

    case POST_DETAIL_REQUEST:
      return {
        ...state,
        detailStatus: 'loading',
        detailError: null,
        currentDetailId: 'payload' in action ? action.payload : null,
      };

    case POST_DETAIL_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const post = action.payload as Post;

      return {
        ...state,
        entities: upsertEntity(state.entities, post),
        detailStatus: 'success',
        detailError: null,
        currentDetailId: post.id,
      };
    }

    case POST_DETAIL_FAILURE:
      return {
        ...state,
        detailStatus: 'error',
        detailError: 'payload' in action ? action.payload : state.detailError,
      };

    case POST_CREATE_REQUEST:
    case POST_UPDATE_REQUEST:
      return {
        ...state,
        submitStatus: 'loading',
        submitError: null,
      };

    case POST_CREATE_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const post = action.payload as Post;

      return {
        ...state,
        entities: upsertEntity(state.entities, post),
        listIds: ensureListId(state.listIds, post.id),
        submitStatus: 'success',
        submitError: null,
        currentDetailId: post.id,
      };
    }

    case POST_UPDATE_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const post = action.payload as Post;

      return {
        ...state,
        entities: upsertEntity(state.entities, post),
        submitStatus: 'success',
        submitError: null,
        currentDetailId: post.id,
      };
    }

    case POST_CREATE_FAILURE:
    case POST_UPDATE_FAILURE:
      return {
        ...state,
        submitStatus: 'error',
        submitError: 'payload' in action ? action.payload : state.submitError,
      };

    case POST_REMOVE_REQUEST:
      return {
        ...state,
        removeStatus: 'loading',
        removeError: null,
      };

    case POST_REMOVE_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const id = action.payload as number;
      const entities = { ...state.entities };
      delete entities[id];

      return {
        ...state,
        entities,
        listIds: state.listIds.filter((listId) => listId !== id),
        removeStatus: 'success',
        removeError: null,
        currentDetailId:
          state.currentDetailId === id ? null : state.currentDetailId,
      };
    }

    case POST_REMOVE_FAILURE:
      return {
        ...state,
        removeStatus: 'error',
        removeError: 'payload' in action ? action.payload : state.removeError,
      };

    default:
      return state;
  }
}
