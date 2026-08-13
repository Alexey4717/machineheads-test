import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/core/api/apiClient';

import type { Tag, TagFormValues } from '../model/types';
import { addTag, toTagFormData } from './tagsApi';

vi.mock('@/core/api/apiClient', async () => {
  const axios = (await import('axios')).default;
  return {
    apiClient: axios.create({ baseURL: 'http://api.test' }),
  };
});

function entriesOf(formData: FormData): [string, FormDataEntryValue][] {
  return Array.from(formData.entries());
}

const values: TagFormValues = {
  name: 'Новости',
  code: 'news',
  sort: 3,
};

const tag: Tag = {
  id: 7,
  name: 'Новости',
  code: 'news',
  sort: 3,
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

describe('toTagFormData', () => {
  it('сериализует code, name и sort строкой', () => {
    const formData = toTagFormData(values);
    const record = Object.fromEntries(entriesOf(formData));

    expect(record).toEqual({
      code: 'news',
      name: 'Новости',
      sort: '3',
    });
  });
});

describe('addTag', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('если ответ — number, загружает detail по id', async () => {
    mock.onPost('/manage/tags/add').reply(200, 7);
    mock.onGet('/manage/tags/detail').reply((config) => {
      expect(config.params).toEqual({ id: 7 });
      return [200, tag];
    });

    await expect(addTag(values)).resolves.toEqual(tag);
  });

  it('если ответ — boolean, ищет тег в списке по code', async () => {
    mock.onPost('/manage/tags/add').reply(200, true);
    mock.onGet('/manage/tags').reply(200, [tag]);
    mock.onGet('/manage/tags/detail').reply(200, tag);

    await expect(addTag(values)).resolves.toEqual(tag);
  });

  it('если boolean и тег не найден в списке — бросает ошибку', async () => {
    mock.onPost('/manage/tags/add').reply(200, true);
    mock.onGet('/manage/tags').reply(200, []);

    await expect(addTag(values)).rejects.toThrow(
      'Тег создан, но не найден в списке',
    );
  });
});
