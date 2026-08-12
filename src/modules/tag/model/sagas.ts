import { push } from 'connected-react-router';
import { call, put, takeLatest } from 'redux-saga/effects';

import { normalizeApiError } from '@/core/api/errorParsers';
import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import {
  appMessageError,
  appMessageSuccess,
} from '@/core/lib/message/appMessage';

import {
  addTag,
  editTag,
  fetchTagDetail,
  fetchTags,
  removeTag,
} from '../api/tagsApi';
import {
  TAG_CREATE_REQUEST,
  TAG_DETAIL_REQUEST,
  TAG_LIST_REQUEST,
  TAG_REMOVE_REQUEST,
  TAG_UPDATE_REQUEST,
  type TagAction,
  tagActions,
} from './actions';
import type { Tag } from './types';

function* listSaga() {
  try {
    const tags: Tag[] = yield call(fetchTags);
    yield put(tagActions.listSuccess(tags));
  } catch (error) {
    yield put(tagActions.listFailure(normalizeApiError(error)));
  }
}

function* detailSaga(
  action: Extract<TagAction, { type: typeof TAG_DETAIL_REQUEST }>,
) {
  try {
    const tag: Tag = yield call(fetchTagDetail, action.payload);
    yield put(tagActions.detailSuccess(tag));
  } catch (error) {
    yield put(tagActions.detailFailure(normalizeApiError(error)));
  }
}

function* createSaga(
  action: Extract<TagAction, { type: typeof TAG_CREATE_REQUEST }>,
) {
  try {
    const tag: Tag = yield call(addTag, action.payload);
    yield put(tagActions.createSuccess(tag));
    yield call(appMessageSuccess, 'Тег создан');
    yield put(push(getPath(PATHS.TAG_DETAIL, { id: tag.id })));
  } catch (error) {
    yield put(tagActions.createFailure(normalizeApiError(error)));
    yield call(appMessageError, error);
  }
}

function* updateSaga(
  action: Extract<TagAction, { type: typeof TAG_UPDATE_REQUEST }>,
) {
  try {
    const tag: Tag = yield call(
      editTag,
      action.payload.id,
      action.payload.values,
    );
    yield put(tagActions.updateSuccess(tag));
    yield call(appMessageSuccess, 'Тег сохранён');
    yield put(push(getPath(PATHS.TAG_DETAIL, { id: tag.id })));
  } catch (error) {
    yield put(tagActions.updateFailure(normalizeApiError(error)));
    yield call(appMessageError, error);
  }
}

function* removeSaga(
  action: Extract<TagAction, { type: typeof TAG_REMOVE_REQUEST }>,
) {
  try {
    yield call(removeTag, action.payload);
    yield put(tagActions.removeSuccess(action.payload));
    yield call(appMessageSuccess, 'Тег удалён');
    yield put(push(PATHS.TAGS));
  } catch (error) {
    yield put(tagActions.removeFailure(normalizeApiError(error)));
    yield call(appMessageError, error);
  }
}

export function* tagSaga() {
  yield takeLatest(TAG_LIST_REQUEST, listSaga);
  yield takeLatest(TAG_DETAIL_REQUEST, detailSaga);
  yield takeLatest(TAG_CREATE_REQUEST, createSaga);
  yield takeLatest(TAG_UPDATE_REQUEST, updateSaga);
  yield takeLatest(TAG_REMOVE_REQUEST, removeSaga);
}
