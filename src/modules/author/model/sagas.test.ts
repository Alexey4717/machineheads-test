import { push } from 'connected-react-router';
import { expectSaga } from 'redux-saga-test-plan';
import { call, select } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { describe, it, vi } from 'vitest';

import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import * as appMessage from '@/core/lib/message/appMessage';
import { selectRouterSearch } from '@/core/lib/router/selectRouterSearch';

import * as authorsApi from '../api/authorsApi';
import { authorActions } from './actions';
import { authorSaga } from './sagas';
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

describe('authorSaga', () => {
  it('list success', async () => {
    await expectSaga(authorSaga)
      .provide([[call.fn(authorsApi.fetchAuthors), [author]]])
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
      .provide([[call.fn(authorsApi.fetchAuthors), throwError(apiError)]])
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
      .provide([[call.fn(authorsApi.fetchAuthorDetail), author]])
      .put(authorActions.detailSuccess(author))
      .dispatch(authorActions.detailRequest(5))
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
});
