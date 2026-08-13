import { apiClient } from '@/core/api/apiClient';
import { parsePaginationHeaders } from '@/core/api/parsePaginationHeaders';

import type { Post, PostFormValues, PostsListResult } from '../model/types';

/** Yii2 multipart: массивы как `tagIds[]`, не повторяющийся `tagIds`. */
export function toPostFormData(payload: PostFormValues): FormData {
  const formData = new FormData();
  formData.append('code', payload.code);
  formData.append('title', payload.title);
  formData.append('authorId', String(payload.authorId));
  formData.append('text', payload.text);

  for (const tagId of payload.tagIds ?? []) {
    formData.append('tagIds[]', String(tagId));
  }

  const file = payload.previewPicture?.[0]?.originFileObj;
  if (file) {
    formData.append('previewPicture', file);
  }

  return formData;
}

export async function fetchPosts(page = 1): Promise<PostsListResult> {
  const response = await apiClient.get<Post[]>('/manage/posts', {
    params: { page },
  });

  return {
    items: response.data,
    pagination: parsePaginationHeaders(response.headers),
  };
}

export async function fetchPostDetail(id: number): Promise<Post> {
  const { data } = await apiClient.get<Post>('/manage/posts/detail', {
    params: { id },
  });
  return data;
}

/**
 * OpenAPI документирует `id` в ответе; на практике иногда приходит boolean.
 * Если id нет — ищем созданный пост в первой странице списка по `code`.
 */
export async function addPost(payload: PostFormValues): Promise<Post> {
  const { data } = await apiClient.post<number | boolean>(
    '/manage/posts/add',
    toPostFormData(payload),
  );

  let id: number;

  if (typeof data === 'number') {
    id = data;
  } else {
    const { items } = await fetchPosts(1);
    const created = items.find((post) => post.code === payload.code);

    if (!created) {
      throw new Error('Пост создан, но не найден в списке');
    }

    id = created.id;
  }

  return fetchPostDetail(id);
}

export async function editPost(
  id: number,
  payload: PostFormValues,
): Promise<Post> {
  await apiClient.post('/manage/posts/edit', toPostFormData(payload), {
    params: { id },
  });
  return fetchPostDetail(id);
}

export async function removePost(id: number): Promise<void> {
  await apiClient.delete('/manage/posts/remove', {
    params: { id },
  });
}
