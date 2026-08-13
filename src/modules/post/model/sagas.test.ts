import { push } from 'connected-react-router';
import { expectSaga } from 'redux-saga-test-plan';
import { call, select } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { describe, it, vi } from 'vitest';

import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import * as appMessage from '@/core/lib/message/appMessage';
import { selectRouterSearch } from '@/core/lib/router/selectRouterSearch';

import * as postsApi from '../api/postsApi';
import { postActions } from './actions';
import { postSaga } from './sagas';
import type { Post, PostFormValues } from './types';

vi.mock('../api/postsApi', () => ({
  fetchPosts: vi.fn(),
  fetchPostDetail: vi.fn(),
  addPost: vi.fn(),
  editPost: vi.fn(),
  removePost: vi.fn(),
}));

vi.mock('@/core/lib/message/appMessage', () => ({
  appMessageSuccess: vi.fn(),
  appMessageError: vi.fn(),
}));

const post: Post = {
  id: 5,
  title: 'Пост',
  code: 'post',
  previewPicture: null,
  text: 'Текст',
  author: { id: 1, fullName: 'Автор', avatar: null },
  tags: [{ id: 2, name: 'tag', code: 'tag' }],
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

const values: PostFormValues = {
  title: 'Пост',
  code: 'post',
  authorId: 1,
  tagIds: [2],
  text: 'Текст',
};

const listResult = {
  items: [post],
  pagination: {
    currentPage: 2,
    pageCount: 3,
    perPage: 10,
    totalCount: 25,
  },
};

describe('postSaga', () => {
  it('list success: читает page из router location', async () => {
    await expectSaga(postSaga)
      .provide([
        [select.selector(selectRouterSearch), '?page=2'],
        [call.fn(postsApi.fetchPosts), listResult],
      ])
      .put(postActions.listSuccess(listResult))
      .call(postsApi.fetchPosts, 2)
      .dispatch(postActions.listRequest())
      .silentRun();
  });

  it('list failure', async () => {
    const apiError = Object.assign(new Error('fail'), {
      isAxiosError: true,
      response: {
        status: 500,
        data: { message: 'Ошибка списка' },
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    });

    await expectSaga(postSaga)
      .provide([
        [select.selector(selectRouterSearch), ''],
        [call.fn(postsApi.fetchPosts), throwError(apiError)],
      ])
      .put(
        postActions.listFailure({
          kind: 'system',
          status: 500,
          error: { message: 'Ошибка списка' },
        }),
      )
      .dispatch(postActions.listRequest())
      .silentRun();
  });

  it('detail success', async () => {
    await expectSaga(postSaga)
      .provide([[call.fn(postsApi.fetchPostDetail), post]])
      .put(postActions.detailSuccess(post))
      .dispatch(postActions.detailRequest(5))
      .silentRun();
  });

  it('create success: createSuccess + toast + redirect detail', async () => {
    await expectSaga(postSaga)
      .provide([
        [call.fn(postsApi.addPost), post],
        [select.selector(selectRouterSearch), ''],
      ])
      .put(postActions.createSuccess(post))
      .call(appMessage.appMessageSuccess, 'Пост создан')
      .put(push(getPath(PATHS.POST_DETAIL, { id: post.id })))
      .dispatch(postActions.createRequest(values))
      .silentRun();
  });

  it('create success: redirect на returnTo, если он валиден', async () => {
    await expectSaga(postSaga)
      .provide([
        [call.fn(postsApi.addPost), post],
        [select.selector(selectRouterSearch), '?returnTo=%2Fauthors%2Fnew'],
      ])
      .put(postActions.createSuccess(post))
      .call(appMessage.appMessageSuccess, 'Пост создан')
      .put(push('/authors/new'))
      .dispatch(postActions.createRequest(values))
      .silentRun();
  });

  it('create success: игнорирует небезопасный returnTo', async () => {
    await expectSaga(postSaga)
      .provide([
        [call.fn(postsApi.addPost), post],
        [
          select.selector(selectRouterSearch),
          '?returnTo=https%3A%2F%2Fevil.example',
        ],
      ])
      .put(push(getPath(PATHS.POST_DETAIL, { id: post.id })))
      .dispatch(postActions.createRequest(values))
      .silentRun();
  });

  it('update success: updateSuccess + toast + redirect detail', async () => {
    await expectSaga(postSaga)
      .provide([[call.fn(postsApi.editPost), post]])
      .put(postActions.updateSuccess(post))
      .call(appMessage.appMessageSuccess, 'Пост сохранён')
      .put(push(getPath(PATHS.POST_DETAIL, { id: post.id })))
      .dispatch(postActions.updateRequest({ id: 5, values }))
      .silentRun();
  });

  it('remove success: removeSuccess + toast + redirect list', async () => {
    await expectSaga(postSaga)
      .provide([[call.fn(postsApi.removePost), undefined]])
      .put(postActions.removeSuccess(5))
      .call(appMessage.appMessageSuccess, 'Пост удалён')
      .put(push(PATHS.POSTS))
      .dispatch(postActions.removeRequest(5))
      .silentRun();
  });

  it('create failure: validation + error toast', async () => {
    const apiError = Object.assign(new Error('422'), {
      isAxiosError: true,
      response: {
        status: 422,
        data: [{ field: 'title', message: 'Занято' }],
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    });

    await expectSaga(postSaga)
      .provide([[call.fn(postsApi.addPost), throwError(apiError)]])
      .put(
        postActions.createFailure({
          kind: 'validation',
          status: 422,
          fields: [{ field: 'title', message: 'Занято' }],
        }),
      )
      .call(appMessage.appMessageError, apiError)
      .dispatch(postActions.createRequest(values))
      .silentRun();
  });

  it('detail failure', async () => {
    const apiError = Object.assign(new Error('fail'), {
      isAxiosError: true,
      response: {
        status: 404,
        data: { message: 'Пост не найден' },
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    });

    await expectSaga(postSaga)
      .provide([[call.fn(postsApi.fetchPostDetail), throwError(apiError)]])
      .put(
        postActions.detailFailure({
          kind: 'system',
          status: 404,
          error: { message: 'Пост не найден' },
        }),
      )
      .dispatch(postActions.detailRequest(5))
      .silentRun();
  });

  it('update failure: validation + error toast', async () => {
    const apiError = Object.assign(new Error('422'), {
      isAxiosError: true,
      response: {
        status: 422,
        data: [{ field: 'title', message: 'Занято' }],
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    });

    await expectSaga(postSaga)
      .provide([[call.fn(postsApi.editPost), throwError(apiError)]])
      .put(
        postActions.updateFailure({
          kind: 'validation',
          status: 422,
          fields: [{ field: 'title', message: 'Занято' }],
        }),
      )
      .call(appMessage.appMessageError, apiError)
      .dispatch(postActions.updateRequest({ id: 5, values }))
      .silentRun();
  });

  it('remove failure', async () => {
    const apiError = Object.assign(new Error('fail'), {
      isAxiosError: true,
      response: {
        status: 500,
        data: { message: 'Не удалось удалить' },
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    });

    await expectSaga(postSaga)
      .provide([[call.fn(postsApi.removePost), throwError(apiError)]])
      .put(
        postActions.removeFailure({
          kind: 'system',
          status: 500,
          error: { message: 'Не удалось удалить' },
        }),
      )
      .call(appMessage.appMessageError, apiError)
      .dispatch(postActions.removeRequest(5))
      .silentRun();
  });
});
