import { push } from 'connected-react-router';
import { expectSaga } from 'redux-saga-test-plan';
import { call, select } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { describe, it, vi } from 'vitest';

import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import * as appMessage from '@/core/lib/message/appMessage';
import { selectRouterSearch } from '@/core/lib/router/selectRouterSearch';

import * as tagsApi from '../api/tagsApi';
import { tagActions } from './actions';
import { tagSaga } from './sagas';
import type { Tag } from './types';

vi.mock('../api/tagsApi', () => ({
  fetchTags: vi.fn(),
  fetchTagDetail: vi.fn(),
  addTag: vi.fn(),
  editTag: vi.fn(),
  removeTag: vi.fn(),
}));

vi.mock('@/core/lib/message/appMessage', () => ({
  appMessageSuccess: vi.fn(),
  appMessageError: vi.fn(),
}));

const tag: Tag = {
  id: 5,
  name: 'Тег',
  code: 'tag',
  sort: 1,
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

describe('tagSaga', () => {
  it('list success', async () => {
    await expectSaga(tagSaga)
      .provide([[call.fn(tagsApi.fetchTags), [tag]]])
      .put(tagActions.listSuccess([tag]))
      .dispatch(tagActions.listRequest())
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

    await expectSaga(tagSaga)
      .provide([[call.fn(tagsApi.fetchTags), throwError(apiError)]])
      .put(
        tagActions.listFailure({
          kind: 'system',
          status: 500,
          error: { message: 'Ошибка списка' },
        }),
      )
      .dispatch(tagActions.listRequest())
      .silentRun();
  });

  it('detail success', async () => {
    await expectSaga(tagSaga)
      .provide([[call.fn(tagsApi.fetchTagDetail), tag]])
      .put(tagActions.detailSuccess(tag))
      .dispatch(tagActions.detailRequest(5))
      .silentRun();
  });

  it('create success: createSuccess + toast + redirect detail', async () => {
    const values = { name: 'Тег', code: 'tag', sort: 1 };

    await expectSaga(tagSaga)
      .provide([
        [call.fn(tagsApi.addTag), tag],
        [select.selector(selectRouterSearch), ''],
      ])
      .put(tagActions.createSuccess(tag))
      .call(appMessage.appMessageSuccess, 'Тег создан')
      .put(push(getPath(PATHS.TAG_DETAIL, { id: tag.id })))
      .dispatch(tagActions.createRequest(values))
      .silentRun();
  });

  it('create success: redirect на returnTo, если он валиден', async () => {
    const values = { name: 'Тег', code: 'tag', sort: 1 };

    await expectSaga(tagSaga)
      .provide([
        [call.fn(tagsApi.addTag), tag],
        [select.selector(selectRouterSearch), '?returnTo=%2Fposts%2F5%2Fedit'],
      ])
      .put(tagActions.createSuccess(tag))
      .call(appMessage.appMessageSuccess, 'Тег создан')
      .put(push('/posts/5/edit'))
      .dispatch(tagActions.createRequest(values))
      .silentRun();
  });

  it('create success: игнорирует небезопасный returnTo', async () => {
    const values = { name: 'Тег', code: 'tag', sort: 1 };

    await expectSaga(tagSaga)
      .provide([
        [call.fn(tagsApi.addTag), tag],
        [select.selector(selectRouterSearch), '?returnTo=//evil.example'],
      ])
      .put(push(getPath(PATHS.TAG_DETAIL, { id: tag.id })))
      .dispatch(tagActions.createRequest(values))
      .silentRun();
  });

  it('update success: updateSuccess + toast + redirect detail', async () => {
    const values = { name: 'Тег', code: 'tag', sort: 1 };

    await expectSaga(tagSaga)
      .provide([[call.fn(tagsApi.editTag), tag]])
      .put(tagActions.updateSuccess(tag))
      .call(appMessage.appMessageSuccess, 'Тег сохранён')
      .put(push(getPath(PATHS.TAG_DETAIL, { id: tag.id })))
      .dispatch(tagActions.updateRequest({ id: 5, values }))
      .silentRun();
  });

  it('remove success: removeSuccess + toast + redirect list', async () => {
    await expectSaga(tagSaga)
      .provide([[call.fn(tagsApi.removeTag), undefined]])
      .put(tagActions.removeSuccess(5))
      .call(appMessage.appMessageSuccess, 'Тег удалён')
      .put(push(PATHS.TAGS))
      .dispatch(tagActions.removeRequest(5))
      .silentRun();
  });

  it('create failure: validation + error toast', async () => {
    const values = { name: 'Тег', code: 'tag', sort: 1 };
    const apiError = Object.assign(new Error('422'), {
      isAxiosError: true,
      response: {
        status: 422,
        data: [{ field: 'code', message: 'Занят' }],
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    });

    await expectSaga(tagSaga)
      .provide([[call.fn(tagsApi.addTag), throwError(apiError)]])
      .put(
        tagActions.createFailure({
          kind: 'validation',
          status: 422,
          fields: [{ field: 'code', message: 'Занят' }],
        }),
      )
      .call(appMessage.appMessageError, apiError)
      .dispatch(tagActions.createRequest(values))
      .silentRun();
  });

  it('detail failure', async () => {
    const apiError = Object.assign(new Error('fail'), {
      isAxiosError: true,
      response: {
        status: 404,
        data: { message: 'Тег не найден' },
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    });

    await expectSaga(tagSaga)
      .provide([[call.fn(tagsApi.fetchTagDetail), throwError(apiError)]])
      .put(
        tagActions.detailFailure({
          kind: 'system',
          status: 404,
          error: { message: 'Тег не найден' },
        }),
      )
      .dispatch(tagActions.detailRequest(5))
      .silentRun();
  });

  it('update failure: validation + error toast', async () => {
    const values = { name: 'Тег', code: 'tag', sort: 1 };
    const apiError = Object.assign(new Error('422'), {
      isAxiosError: true,
      response: {
        status: 422,
        data: [{ field: 'code', message: 'Занят' }],
      },
      toJSON: () => ({}),
      name: 'AxiosError',
    });

    await expectSaga(tagSaga)
      .provide([[call.fn(tagsApi.editTag), throwError(apiError)]])
      .put(
        tagActions.updateFailure({
          kind: 'validation',
          status: 422,
          fields: [{ field: 'code', message: 'Занят' }],
        }),
      )
      .call(appMessage.appMessageError, apiError)
      .dispatch(tagActions.updateRequest({ id: 5, values }))
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

    await expectSaga(tagSaga)
      .provide([[call.fn(tagsApi.removeTag), throwError(apiError)]])
      .put(
        tagActions.removeFailure({
          kind: 'system',
          status: 500,
          error: { message: 'Не удалось удалить' },
        }),
      )
      .call(appMessage.appMessageError, apiError)
      .dispatch(tagActions.removeRequest(5))
      .silentRun();
  });
});
