import type { AuthorAction } from './actions';
import {
  AUTHOR_CREATE_FAILURE,
  AUTHOR_CREATE_REQUEST,
  AUTHOR_CREATE_SUCCESS,
  AUTHOR_DETAIL_FAILURE,
  AUTHOR_DETAIL_REQUEST,
  AUTHOR_DETAIL_SUCCESS,
  AUTHOR_LIST_FAILURE,
  AUTHOR_LIST_REQUEST,
  AUTHOR_LIST_SUCCESS,
  AUTHOR_REMOVE_FAILURE,
  AUTHOR_REMOVE_REQUEST,
  AUTHOR_REMOVE_SUCCESS,
  AUTHOR_UPDATE_FAILURE,
  AUTHOR_UPDATE_REQUEST,
  AUTHOR_UPDATE_SUCCESS,
} from './actions';
import type { Author, AuthorState } from './types';

export const authorInitialState: AuthorState = {
  entities: {},
  listIds: [],
  detailFetchedAt: {},
  listFetchedAt: null,
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
  entities: Record<number, Author>,
  author: Author,
): Record<number, Author> {
  return {
    ...entities,
    [author.id]: author,
  };
}

function ensureListId(listIds: number[], id: number): number[] {
  return listIds.includes(id) ? listIds : [...listIds, id];
}

function omitFetchedAt(
  detailFetchedAt: Record<number, number>,
  id: number,
): Record<number, number> {
  const next = { ...detailFetchedAt };
  delete next[id];
  return next;
}

export function authorReducer(
  state: AuthorState = authorInitialState,
  action: AuthorAction | { type: string },
): AuthorState {
  switch (action.type) {
    case AUTHOR_LIST_REQUEST:
      return {
        ...state,
        listStatus: 'loading',
        listError: null,
      };

    case AUTHOR_LIST_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const authors = action.payload as Author[];
      const entities = { ...state.entities };
      const listIds: number[] = [];
      const now = Date.now();

      for (const author of authors) {
        const prev = entities[author.id];
        entities[author.id] = prev ? { ...prev, ...author } : author;
        listIds.push(author.id);
      }

      return {
        ...state,
        entities,
        listIds,
        listFetchedAt: now,
        listStatus: 'success',
        listError: null,
      };
    }

    case AUTHOR_LIST_FAILURE:
      return {
        ...state,
        listStatus: 'error',
        listError: 'payload' in action ? action.payload : state.listError,
      };

    case AUTHOR_DETAIL_REQUEST:
      return {
        ...state,
        detailStatus: 'loading',
        detailError: null,
        currentDetailId: 'payload' in action ? action.payload : null,
      };

    case AUTHOR_DETAIL_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const author = action.payload as Author;
      const now = Date.now();

      return {
        ...state,
        entities: upsertEntity(state.entities, author),
        detailFetchedAt: { ...state.detailFetchedAt, [author.id]: now },
        detailStatus: 'success',
        detailError: null,
        currentDetailId: author.id,
      };
    }

    case AUTHOR_DETAIL_FAILURE:
      return {
        ...state,
        detailStatus: 'error',
        detailError: 'payload' in action ? action.payload : state.detailError,
      };

    case AUTHOR_CREATE_REQUEST:
    case AUTHOR_UPDATE_REQUEST:
      return {
        ...state,
        submitStatus: 'loading',
        submitError: null,
      };

    case AUTHOR_CREATE_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const author = action.payload as Author;
      const now = Date.now();

      return {
        ...state,
        entities: upsertEntity(state.entities, author),
        listIds: ensureListId(state.listIds, author.id),
        detailFetchedAt: { ...state.detailFetchedAt, [author.id]: now },
        listFetchedAt: now,
        submitStatus: 'success',
        submitError: null,
        currentDetailId: author.id,
      };
    }

    case AUTHOR_UPDATE_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const author = action.payload as Author;
      const now = Date.now();

      return {
        ...state,
        entities: upsertEntity(state.entities, author),
        detailFetchedAt: { ...state.detailFetchedAt, [author.id]: now },
        listFetchedAt: now,
        submitStatus: 'success',
        submitError: null,
        currentDetailId: author.id,
      };
    }

    case AUTHOR_CREATE_FAILURE:
    case AUTHOR_UPDATE_FAILURE:
      return {
        ...state,
        submitStatus: 'error',
        submitError: 'payload' in action ? action.payload : state.submitError,
      };

    case AUTHOR_REMOVE_REQUEST:
      return {
        ...state,
        removeStatus: 'loading',
        removeError: null,
      };

    case AUTHOR_REMOVE_SUCCESS: {
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
        detailFetchedAt: omitFetchedAt(state.detailFetchedAt, id),
        listFetchedAt: Date.now(),
        removeStatus: 'success',
        removeError: null,
        currentDetailId:
          state.currentDetailId === id ? null : state.currentDetailId,
      };
    }

    case AUTHOR_REMOVE_FAILURE:
      return {
        ...state,
        removeStatus: 'error',
        removeError: 'payload' in action ? action.payload : state.removeError,
      };

    default:
      return state;
  }
}
