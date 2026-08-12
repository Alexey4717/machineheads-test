import { apiClient } from '@/core/api/apiClient';

import type { Tag, TagFormValues } from '../model/types';

function toTagFormData(payload: TagFormValues): FormData {
  const formData = new FormData();
  formData.append('code', payload.code);
  formData.append('name', payload.name);
  formData.append('sort', String(payload.sort));
  return formData;
}

export async function fetchTags(): Promise<Tag[]> {
  const { data } = await apiClient.get<Tag[]>('/manage/tags');
  return data;
}

export async function fetchTagDetail(id: number): Promise<Tag> {
  const { data } = await apiClient.get<Tag>('/manage/tags/detail', {
    params: { id },
  });
  return data;
}

/**
 * OpenAPI документирует `boolean`, на практике иногда приходит `id: number`.
 * Если id нет — ищем созданный тег в списке по `code`.
 */
export async function addTag(payload: TagFormValues): Promise<Tag> {
  const { data } = await apiClient.post<number | boolean>(
    '/manage/tags/add',
    toTagFormData(payload),
  );

  let id: number;

  if (typeof data === 'number') {
    id = data;
  } else {
    const tags = await fetchTags();
    const created = tags.find((tag) => tag.code === payload.code);

    if (!created) {
      throw new Error('Тег создан, но не найден в списке');
    }

    id = created.id;
  }

  return fetchTagDetail(id);
}

export async function editTag(
  id: number,
  payload: TagFormValues,
): Promise<Tag> {
  await apiClient.post('/manage/tags/edit', toTagFormData(payload), {
    params: { id },
  });
  return fetchTagDetail(id);
}

export async function removeTag(id: number): Promise<void> {
  await apiClient.delete('/manage/tags/remove', {
    params: { id },
  });
}
