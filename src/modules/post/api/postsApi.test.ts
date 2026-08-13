import type { RcFile } from 'antd/es/upload/interface';
import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/core/api/apiClient';

import type { Post, PostFormValues } from '../model/types';
import { addPost, fetchPosts, toPostFormData } from './postsApi';

vi.mock('@/core/api/apiClient', async () => {
  const axios = (await import('axios')).default;
  return {
    apiClient: axios.create({ baseURL: 'http://api.test' }),
  };
});

function entriesOf(formData: FormData): [string, FormDataEntryValue][] {
  return Array.from(formData.entries());
}

const basePayload: PostFormValues = {
  code: 'post-code',
  title: 'Post title',
  authorId: 42,
  tagIds: [116, 109],
  text: 'Body',
};

const post: Post = {
  id: 7,
  title: 'Post title',
  code: 'post-code',
  previewPicture: null,
  text: 'Body',
  author: { id: 42, fullName: 'Автор', avatar: null },
  tags: [{ id: 116, name: 'tag', code: 'tag' }],
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

const paginationHeaders = {
  'x-pagination-current-page': '1',
  'x-pagination-page-count': '1',
  'x-pagination-per-page': '10',
  'x-pagination-total-count': '1',
};

describe('toPostFormData', () => {
  it('сериализует tagIds как tagIds[] (Yii2 multipart)', () => {
    const formData = toPostFormData(basePayload);
    const tagEntries = entriesOf(formData).filter(([key]) =>
      key.startsWith('tagIds'),
    );

    expect(tagEntries).toEqual([
      ['tagIds[]', '116'],
      ['tagIds[]', '109'],
    ]);
  });

  it('отправляет authorId строкой целого числа', () => {
    const formData = toPostFormData(basePayload);
    expect(formData.get('authorId')).toBe('42');
  });

  it('аппендит File из previewPicture[0].originFileObj', () => {
    const file = new File(['img'], 'preview.png', {
      type: 'image/png',
    }) as RcFile;
    const formData = toPostFormData({
      ...basePayload,
      previewPicture: [
        {
          uid: '1',
          name: 'preview.png',
          originFileObj: file,
        },
      ],
    });

    expect(formData.get('previewPicture')).toBe(file);
  });

  it('не аппендит previewPicture без originFileObj', () => {
    const formData = toPostFormData({
      ...basePayload,
      previewPicture: [{ uid: '1', name: 'preview.png', url: '/old.png' }],
    });

    expect(formData.get('previewPicture')).toBeNull();
  });
});

describe('fetchPosts', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('читает пагинацию из заголовков ответа', async () => {
    mock.onGet('/manage/posts').reply(200, [post], {
      'x-pagination-current-page': '2',
      'x-pagination-page-count': '3',
      'x-pagination-per-page': '10',
      'x-pagination-total-count': '25',
    });

    const result = await fetchPosts(2);

    expect(result.items).toEqual([post]);
    expect(result.pagination).toEqual({
      currentPage: 2,
      pageCount: 3,
      perPage: 10,
      totalCount: 25,
    });
    expect(mock.history.get[0]?.params).toEqual({ page: 2 });
  });
});

describe('addPost', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it('если ответ — boolean, ищет пост на первой странице списка по code', async () => {
    mock.onPost('/manage/posts/add').reply(200, true);
    mock.onGet('/manage/posts').reply(200, [post], paginationHeaders);
    mock.onGet('/manage/posts/detail').reply((config) => {
      expect(config.params).toEqual({ id: 7 });
      return [200, post];
    });

    await expect(addPost(basePayload)).resolves.toEqual(post);
    expect(mock.history.get[0]?.params).toEqual({ page: 1 });
  });

  it('если boolean и пост не найден в списке — бросает ошибку', async () => {
    mock.onPost('/manage/posts/add').reply(200, true);
    mock.onGet('/manage/posts').reply(200, [], paginationHeaders);

    await expect(addPost(basePayload)).rejects.toThrow(
      'Пост создан, но не найден в списке',
    );
  });
});
