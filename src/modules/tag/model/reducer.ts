import type { TagAction } from './actions';
import {
  TAG_CREATE_FAILURE,
  TAG_CREATE_REQUEST,
  TAG_CREATE_SUCCESS,
  TAG_DETAIL_FAILURE,
  TAG_DETAIL_REQUEST,
  TAG_DETAIL_SUCCESS,
  TAG_LIST_FAILURE,
  TAG_LIST_REQUEST,
  TAG_LIST_SUCCESS,
  TAG_REMOVE_FAILURE,
  TAG_REMOVE_REQUEST,
  TAG_REMOVE_SUCCESS,
  TAG_UPDATE_FAILURE,
  TAG_UPDATE_REQUEST,
  TAG_UPDATE_SUCCESS,
} from './actions';
import type { Tag, TagState } from './types';

export const tagInitialState: TagState = {
  entities: {},
  listIds: [],
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
  entities: Record<number, Tag>,
  tag: Tag,
): Record<number, Tag> {
  return {
    ...entities,
    [tag.id]: tag,
  };
}

function ensureListId(listIds: number[], id: number): number[] {
  return listIds.includes(id) ? listIds : [...listIds, id];
}

export function tagReducer(
  state: TagState = tagInitialState,
  action: TagAction | { type: string },
): TagState {
  switch (action.type) {
    case TAG_LIST_REQUEST:
      return {
        ...state,
        listStatus: 'loading',
        listError: null,
      };

    case TAG_LIST_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const tags = action.payload as Tag[];
      const entities = { ...state.entities };
      const listIds: number[] = [];

      for (const tag of tags) {
        entities[tag.id] = tag;
        listIds.push(tag.id);
      }

      return {
        ...state,
        entities,
        listIds,
        listStatus: 'success',
        listError: null,
      };
    }

    case TAG_LIST_FAILURE:
      return {
        ...state,
        listStatus: 'error',
        listError: 'payload' in action ? action.payload : state.listError,
      };

    case TAG_DETAIL_REQUEST:
      return {
        ...state,
        detailStatus: 'loading',
        detailError: null,
        currentDetailId: 'payload' in action ? action.payload : null,
      };

    case TAG_DETAIL_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const tag = action.payload as Tag;

      return {
        ...state,
        entities: upsertEntity(state.entities, tag),
        detailStatus: 'success',
        detailError: null,
        currentDetailId: tag.id,
      };
    }

    case TAG_DETAIL_FAILURE:
      return {
        ...state,
        detailStatus: 'error',
        detailError: 'payload' in action ? action.payload : state.detailError,
      };

    case TAG_CREATE_REQUEST:
    case TAG_UPDATE_REQUEST:
      return {
        ...state,
        submitStatus: 'loading',
        submitError: null,
      };

    case TAG_CREATE_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const tag = action.payload as Tag;

      return {
        ...state,
        entities: upsertEntity(state.entities, tag),
        listIds: ensureListId(state.listIds, tag.id),
        submitStatus: 'success',
        submitError: null,
        currentDetailId: tag.id,
      };
    }

    case TAG_UPDATE_SUCCESS: {
      if (!('payload' in action)) {
        return state;
      }

      const tag = action.payload as Tag;

      return {
        ...state,
        entities: upsertEntity(state.entities, tag),
        submitStatus: 'success',
        submitError: null,
        currentDetailId: tag.id,
      };
    }

    case TAG_CREATE_FAILURE:
    case TAG_UPDATE_FAILURE:
      return {
        ...state,
        submitStatus: 'error',
        submitError: 'payload' in action ? action.payload : state.submitError,
      };

    case TAG_REMOVE_REQUEST:
      return {
        ...state,
        removeStatus: 'loading',
        removeError: null,
      };

    case TAG_REMOVE_SUCCESS: {
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

    case TAG_REMOVE_FAILURE:
      return {
        ...state,
        removeStatus: 'error',
        removeError: 'payload' in action ? action.payload : state.removeError,
      };

    default:
      return state;
  }
}
