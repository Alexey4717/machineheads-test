import { push } from 'connected-react-router';
import { expectSaga } from 'redux-saga-test-plan';
import { call, select } from 'redux-saga-test-plan/matchers';
import {
  type StaticProvider,
  throwError,
} from 'redux-saga-test-plan/providers';
import { describe, it, vi } from 'vitest';

import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import { DEFAULT_STALE_TIME_MS } from '@/core/lib/cache/isFresh';
import * as appMessage from '@/core/lib/message/appMessage';
import { selectRouterSearch } from '@/core/lib/router/selectRouterSearch';

import * as authorsApi from '../api/authorsApi';
import { authorActions } from './actions';
import { authorSaga } from './sagas';
import {
  selectAuthorDetailFetchedAtMap,
  selectAuthorEntities,
  selectAuthorList,
  selectAuthorListFetchedAt,
} from './selectors';
import type { Author, AuthorFormValues } from './types';

vi.mock('../api/authorsApi', () => ({
  fetchAuthors: vi.fn(),
  fetchAuthorDetail: vi.fn(),
  addAuthor: vi.fn(),
  editAuthor: vi.fn(),
  removeAuthor: vi.fn(),
}));

vi.mock('@/core/lib/message/appMessage', () => ({
  appMessageSuccess: vi.fn(),
  appMessageError: vi.fn(),
}));

const author: Author = {
  id: 5,
  name: 'Иван',
  lastName: 'Иванов',
  secondName: 'Иванович',
  avatar: null,
  shortDescription: 'Кратко',
  description: 'Полное',
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

const values: AuthorFormValues = {
  name: 'Иван',
  lastName: 'Иванов',
  secondName: 'Иванович',
  shortDescription: 'Кратко',
  description: 'Полное',
  removeAvatar: false,
};

const listCacheMiss: StaticProvider[] = [
  [select.selector(selectAuthorListFetchedAt), null],
];

const detailCacheMiss: StaticProvider[] = [
  [select.selector(selectAuthorEntities), {}],
  [select.selector(selectAuthorDetailFetchedAtMap), {}],
];

describe('authorSaga', () => {
  it('list success', async () => {
    await expectSaga(authorSaga)
      .provide([...listCacheMiss, [call.fn(authorsApi.fetchAuthors), [author]]])
      .put(authorActions.listSuccess([author]))
      .dispatch(authorActions.listRequest())
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

    await expectSaga(authorSaga)
      .provide([
        ...listCacheMiss,
        [call.fn(authorsApi.fetchAuthors), throwError(apiError)],
      ])
      .put(
        authorActions.listFailure({
          kind: 'system',
          status: 500,
          error: { message: 'Ошибка списка' },
        }),
      )
      .dispatch(authorActions.listRequest())
      .silentRun();
  });

  it('detail success', async () => {
    await expectSaga(authorSaga)
      .provide([
        ...detailCacheMiss,
        [call.fn(authorsApi.fetchAuthorDetail), author],
      ])
      .put(authorActions.detailSuccess(author))
      .dispatch(authorActions.detailRequest(5))
      .silentRun();
  });

  it('detail stale: вызывает fetchAuthorDetail', async () => {
    await expectSaga(authorSaga)
      .provide([
        [select.selector(selectAuthorEntities), { 5: author }],
        [
          select.selector(selectAuthorDetailFetchedAtMap),
          { 5: Date.now() - DEFAULT_STALE_TIME_MS },
        ],
        [call.fn(authorsApi.fetchAuthorDetail), author],
      ])
      .call(authorsApi.fetchAuthorDetail, 5)
      .put(authorActions.detailSuccess(author))
      .dispatch(authorActions.detailRequest(5))
      .silentRun();
  });

  it('detail fresh: без GET, put detailSuccess', async () => {
    await expectSaga(authorSaga)
      .provide([
        [select.selector(selectAuthorEntities), { 5: author }],
        [select.selector(selectAuthorDetailFetchedAtMap), { 5: Date.now() }],
      ])
      .put(authorActions.detailSuccess(author))
      .not.call.fn(authorsApi.fetchAuthorDetail)
      .dispatch(authorActions.detailRequest(5))
      .silentRun();
  });

  it('list stale: вызывает fetchAuthors', async () => {
    await expectSaga(authorSaga)
      .provide([
        [
          select.selector(selectAuthorListFetchedAt),
          Date.now() - DEFAULT_STALE_TIME_MS,
        ],
        [call.fn(authorsApi.fetchAuthors), [author]],
      ])
      .call(authorsApi.fetchAuthors)
      .put(authorActions.listSuccess([author]))
      .dispatch(authorActions.listRequest())
      .silentRun();
  });

  it('list fresh: без GET, put listSuccess', async () => {
    await expectSaga(authorSaga)
      .provide([
        [select.selector(selectAuthorListFetchedAt), Date.now()],
        [select.selector(selectAuthorList), [author]],
      ])
      .put(authorActions.listSuccess([author]))
      .not.call.fn(authorsApi.fetchAuthors)
      .dispatch(authorActions.listRequest())
      .silentRun();
  });

  it('create success: createSuccess + toast + redirect detail', async () => {
    await expectSaga(authorSaga)
      .provide([
        [call.fn(authorsApi.addAuthor), author],
        [select.selector(selectRouterSearch), ''],
      ])
      .put(authorActions.createSuccess(author))
      .call(appMessage.appMessageSuccess, 'Автор создан')
      .put(push(getPath(PATHS.AUTHOR_DETAIL, { id: author.id })))
      .dispatch(authorActions.createRequest(values))
      .silentRun();
  });

  it('create success: redirect на returnTo, если он валиден', async () => {
    await expectSaga(authorSaga)
      .provide([
        [call.fn(authorsApi.addAuthor), author],
        [select.selector(selectRouterSearch), '?returnTo=%2Fposts%2Fnew'],
      ])
      .put(authorActions.createSuccess(author))
      .call(appMessage.appMessageSuccess, 'Автор создан')
      .put(push('/posts/new'))
      .dispatch(authorActions.createRequest(values))
      .silentRun();
  });

  it('create success: игнорирует небезопасный returnTo', async () => {
    await expectSaga(authorSaga)
      .provide([
        [call.fn(authorsApi.addAuthor), author],
        [
          select.selector(selectRouterSearch),
          '?returnTo=https%3A%2F%2Fevil.example',
        ],
      ])
      .put(push(getPath(PATHS.AUTHOR_DETAIL, { id: author.id })))
      .dispatch(authorActions.createRequest(values))
      .silentRun();
  });

  it('update success: updateSuccess + toast + redirect detail', async () => {
    await expectSaga(authorSaga)
      .provide([[call.fn(authorsApi.editAuthor), author]])
      .put(authorActions.updateSuccess(author))
      .call(appMessage.appMessageSuccess, 'Автор сохранён')
      .put(push(getPath(PATHS.AUTHOR_DETAIL, { id: author.id })))
      .dispatch(authorActions.updateRequest({ id: 5, values }))
      .silentRun();
  });

  it('remove success: removeSuccess + toast + redirect list', async () => {
    await expectSaga(authorSaga)
      .provide([[call.fn(authorsApi.removeAuthor), undefined]])
      .put(authorActions.removeSuccess(5))
      .call(appMessage.appMessageSuccess, 'Автор удалён')
      .put(push(PATHS.AUTHORS))
      .dispatch(authorActions.removeRequest(5))
      .silentRun();
  });

  it('create failure: validation + error toast', async () => {
    const apiError = Object.assign(new Error('422'), {
      isAxiosError: true,
      response: {
        status: 422,
        data: [{ field: 'name', message: 'Занято' }],
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    });

    await expectSaga(authorSaga)
      .provide([[call.fn(authorsApi.addAuthor), throwError(apiError)]])
      .put(
        authorActions.createFailure({
          kind: 'validation',
          status: 422,
          fields: [{ field: 'name', message: 'Занято' }],
        }),
      )
      .call(appMessage.appMessageError, apiError)
      .dispatch(authorActions.createRequest(values))
      .silentRun();
  });

  it('detail failure', async () => {
    const apiError = Object.assign(new Error('fail'), {
      isAxiosError: true,
      response: {
        status: 404,
        data: { message: 'Автор не найден' },
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    });

    await expectSaga(authorSaga)
      .provide([
        ...detailCacheMiss,
        [call.fn(authorsApi.fetchAuthorDetail), throwError(apiError)],
      ])
      .put(
        authorActions.detailFailure({
          kind: 'system',
          status: 404,
          error: { message: 'Автор не найден' },
        }),
      )
      .dispatch(authorActions.detailRequest(5))
      .silentRun();
  });

  it('update failure: validation + error toast', async () => {
    const apiError = Object.assign(new Error('422'), {
      isAxiosError: true,
      response: {
        status: 422,
        data: [{ field: 'name', message: 'Занято' }],
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    });

    await expectSaga(authorSaga)
      .provide([[call.fn(authorsApi.editAuthor), throwError(apiError)]])
      .put(
        authorActions.updateFailure({
          kind: 'validation',
          status: 422,
          fields: [{ field: 'name', message: 'Занято' }],
        }),
      )
      .call(appMessage.appMessageError, apiError)
      .dispatch(authorActions.updateRequest({ id: 5, values }))
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

    await expectSaga(authorSaga)
      .provide([[call.fn(authorsApi.removeAuthor), throwError(apiError)]])
      .put(
        authorActions.removeFailure({
          kind: 'system',
          status: 500,
          error: { message: 'Не удалось удалить' },
        }),
      )
      .call(appMessage.appMessageError, apiError)
      .dispatch(authorActions.removeRequest(5))
      .silentRun();
  });
});
