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
  addAuthor,
  editAuthor,
  fetchAuthorDetail,
  fetchAuthors,
  removeAuthor,
} from '../api/authorsApi';
import {
  AUTHOR_CREATE_REQUEST,
  AUTHOR_DETAIL_REQUEST,
  AUTHOR_LIST_REQUEST,
  AUTHOR_REMOVE_REQUEST,
  AUTHOR_UPDATE_REQUEST,
  type AuthorAction,
  authorActions,
} from './actions';
import type { Author } from './types';

function* listSaga() {
  try {
    const authors: Author[] = yield call(fetchAuthors);
    yield put(authorActions.listSuccess(authors));
  } catch (error) {
    yield put(authorActions.listFailure(normalizeApiError(error)));
  }
}

function* detailSaga(
  action: Extract<AuthorAction, { type: typeof AUTHOR_DETAIL_REQUEST }>,
) {
  try {
    const author: Author = yield call(fetchAuthorDetail, action.payload);
    yield put(authorActions.detailSuccess(author));
  } catch (error) {
    yield put(authorActions.detailFailure(normalizeApiError(error)));
  }
}

function* createSaga(
  action: Extract<AuthorAction, { type: typeof AUTHOR_CREATE_REQUEST }>,
) {
  try {
    const author: Author = yield call(addAuthor, action.payload);
    yield put(authorActions.createSuccess(author));
    yield call(appMessageSuccess, 'Автор создан');
    yield put(push(getPath(PATHS.AUTHOR_DETAIL, { id: author.id })));
  } catch (error) {
    yield put(authorActions.createFailure(normalizeApiError(error)));
    yield call(appMessageError, error);
  }
}

function* updateSaga(
  action: Extract<AuthorAction, { type: typeof AUTHOR_UPDATE_REQUEST }>,
) {
  try {
    const author: Author = yield call(
      editAuthor,
      action.payload.id,
      action.payload.values,
    );
    yield put(authorActions.updateSuccess(author));
    yield call(appMessageSuccess, 'Автор сохранён');
    yield put(push(getPath(PATHS.AUTHOR_DETAIL, { id: author.id })));
  } catch (error) {
    yield put(authorActions.updateFailure(normalizeApiError(error)));
    yield call(appMessageError, error);
  }
}

function* removeSaga(
  action: Extract<AuthorAction, { type: typeof AUTHOR_REMOVE_REQUEST }>,
) {
  try {
    yield call(removeAuthor, action.payload);
    yield put(authorActions.removeSuccess(action.payload));
    yield call(appMessageSuccess, 'Автор удалён');
    yield put(push(PATHS.AUTHORS));
  } catch (error) {
    yield put(authorActions.removeFailure(normalizeApiError(error)));
    yield call(appMessageError, error);
  }
}

export function* authorSaga() {
  yield takeLatest(AUTHOR_LIST_REQUEST, listSaga);
  yield takeLatest(AUTHOR_DETAIL_REQUEST, detailSaga);
  yield takeLatest(AUTHOR_CREATE_REQUEST, createSaga);
  yield takeLatest(AUTHOR_UPDATE_REQUEST, updateSaga);
  yield takeLatest(AUTHOR_REMOVE_REQUEST, removeSaga);
}
