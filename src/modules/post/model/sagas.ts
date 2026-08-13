import { push } from 'connected-react-router';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { normalizeApiError } from '@/core/api/errorParsers';
import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import {
  appMessageError,
  appMessageSuccess,
} from '@/core/lib/message/appMessage';
import { parseReturnTo } from '@/core/lib/router/parseReturnTo';
import { selectRouterSearch } from '@/core/lib/router/selectRouterSearch';

import {
  addPost,
  editPost,
  fetchPostDetail,
  fetchPosts,
  removePost,
} from '../api/postsApi';
import {
  POST_CREATE_REQUEST,
  POST_DETAIL_REQUEST,
  POST_LIST_REQUEST,
  POST_REMOVE_REQUEST,
  POST_UPDATE_REQUEST,
  type PostAction,
  postActions,
} from './actions';
import { parsePageFromSearch } from './parsePageFromSearch';
import type { Post, PostsListResult } from './types';

function* listSaga() {
  try {
    const search: string = yield select(selectRouterSearch);
    const page = parsePageFromSearch(search);
    const result: PostsListResult = yield call(fetchPosts, page);
    yield put(postActions.listSuccess(result));
  } catch (error) {
    yield put(postActions.listFailure(normalizeApiError(error)));
  }
}

function* detailSaga(
  action: Extract<PostAction, { type: typeof POST_DETAIL_REQUEST }>,
) {
  try {
    const post: Post = yield call(fetchPostDetail, action.payload);
    yield put(postActions.detailSuccess(post));
  } catch (error) {
    yield put(postActions.detailFailure(normalizeApiError(error)));
  }
}

function* createSaga(
  action: Extract<PostAction, { type: typeof POST_CREATE_REQUEST }>,
) {
  try {
    const post: Post = yield call(addPost, action.payload);
    yield put(postActions.createSuccess(post));
    yield call(appMessageSuccess, 'Пост создан');
    const search: string = yield select(selectRouterSearch);
    const returnTo = parseReturnTo(search);
    yield put(push(returnTo ?? getPath(PATHS.POST_DETAIL, { id: post.id })));
  } catch (error) {
    yield put(postActions.createFailure(normalizeApiError(error)));
    yield call(appMessageError, error);
  }
}

function* updateSaga(
  action: Extract<PostAction, { type: typeof POST_UPDATE_REQUEST }>,
) {
  try {
    const post: Post = yield call(
      editPost,
      action.payload.id,
      action.payload.values,
    );
    yield put(postActions.updateSuccess(post));
    yield call(appMessageSuccess, 'Пост сохранён');
    yield put(push(getPath(PATHS.POST_DETAIL, { id: post.id })));
  } catch (error) {
    yield put(postActions.updateFailure(normalizeApiError(error)));
    yield call(appMessageError, error);
  }
}

function* removeSaga(
  action: Extract<PostAction, { type: typeof POST_REMOVE_REQUEST }>,
) {
  try {
    yield call(removePost, action.payload);
    yield put(postActions.removeSuccess(action.payload));
    yield call(appMessageSuccess, 'Пост удалён');
    yield put(push(PATHS.POSTS));
  } catch (error) {
    yield put(postActions.removeFailure(normalizeApiError(error)));
    yield call(appMessageError, error);
  }
}

export function* postSaga() {
  yield takeLatest(POST_LIST_REQUEST, listSaga);
  yield takeLatest(POST_DETAIL_REQUEST, detailSaga);
  yield takeLatest(POST_CREATE_REQUEST, createSaga);
  yield takeLatest(POST_UPDATE_REQUEST, updateSaga);
  yield takeLatest(POST_REMOVE_REQUEST, removeSaga);
}
