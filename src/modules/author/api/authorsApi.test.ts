import type { RcFile } from 'antd/es/upload/interface';
import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/core/api/apiClient';

import type { Author, AuthorFormValues } from '../model/types';
import { addAuthor, toAuthorFormData } from './authorsApi';

vi.mock('@/core/api/apiClient', async () => {
  const axios = (await import('axios')).default;
  return {
    apiClient: axios.create({ baseURL: 'http://api.test' }),
  };
});

function entriesOf(formData: FormData): [string, FormDataEntryValue][] {
  return Array.from(formData.entries());
}

const values: AuthorFormValues = {
  name: 'Иван',
  lastName: 'Иванов',
  secondName: 'Иванович',
  shortDescription: 'Кратко',
  description: 'Полное',
  removeAvatar: false,
};

const author: Author = {
  id: 7,
  name: 'Иван',
  lastName: 'Иванов',
  secondName: 'Иванович',
  avatar: null,
  shortDescription: 'Кратко',
  description: 'Полное',
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

describe('toAuthorFormData', () => {
  it('сериализует текстовые поля', () => {
    const formData = toAuthorFormData(values);
    const record = Object.fromEntries(entriesOf(formData));

    expect(record).toMatchObject({
      name: 'Иван',
      lastName: 'Иванов',
      secondName: 'Иванович',
      shortDescription: 'Кратко',
      description: 'Полное',
    });
    expect(formData.get('removeAvatar')).toBeNull();
    expect(formData.get('avatar')).toBeNull();
  });

  it('аппендит File из avatar[0].originFileObj', () => {
    const file = new File(['img'], 'avatar.png', {
      type: 'image/png',
    }) as RcFile;
    const formData = toAuthorFormData({
      ...values,
      avatar: [{ uid: '1', name: 'avatar.png', originFileObj: file }],
    });

    expect(formData.get('avatar')).toBe(file);
  });

  it('не аппендит avatar без originFileObj', () => {
    const formData = toAuthorFormData({
      ...values,
      avatar: [{ uid: '1', name: 'avatar.png', url: '/old.png' }],
    });

    expect(formData.get('avatar')).toBeNull();
  });

  it('аппендит removeAvatar=1, если флаг включён', () => {
    const formData = toAuthorFormData({ ...values, removeAvatar: true });

    expect(formData.get('removeAvatar')).toBe('1');
  });
});

describe('addAuthor', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('если ответ — number, загружает detail по id', async () => {
    mock.onPost('/manage/authors/add').reply(200, 7);
    mock.onGet('/manage/authors/detail').reply((config) => {
      expect(config.params).toEqual({ id: 7 });
      return [200, author];
    });

    await expect(addAuthor(values)).resolves.toEqual(author);
  });

  it('если ответ — boolean, ищет автора в списке по ФИО', async () => {
    mock.onPost('/manage/authors/add').reply(200, true);
    mock.onGet('/manage/authors').reply(200, [author]);
    mock.onGet('/manage/authors/detail').reply(200, author);

    await expect(addAuthor(values)).resolves.toEqual(author);
  });

  it('если boolean и автор не найден в списке — бросает ошибку', async () => {
    mock.onPost('/manage/authors/add').reply(200, true);
    mock.onGet('/manage/authors').reply(200, []);

    await expect(addAuthor(values)).rejects.toThrow(
      'Автор создан, но не найден в списке',
    );
  });
});
