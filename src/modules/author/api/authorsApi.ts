import { apiClient } from '@/core/api/apiClient';

import type { Author, AuthorFormValues } from '../model/types';

function toAuthorFormData(payload: AuthorFormValues): FormData {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('lastName', payload.lastName);
  formData.append('secondName', payload.secondName ?? '');
  formData.append('shortDescription', payload.shortDescription ?? '');
  formData.append('description', payload.description ?? '');

  const file = payload.avatar?.[0]?.originFileObj;
  if (file) {
    formData.append('avatar', file);
  }

  if (payload.removeAvatar) {
    formData.append('removeAvatar', '1');
  }

  return formData;
}

function isSameAuthor(
  author: Author,
  payload: Pick<AuthorFormValues, 'name' | 'lastName' | 'secondName'>,
): boolean {
  return (
    author.name === payload.name &&
    author.lastName === payload.lastName &&
    author.secondName === payload.secondName
  );
}

export async function fetchAuthors(): Promise<Author[]> {
  const { data } = await apiClient.get<Author[]>('/manage/authors');
  return data;
}

export async function fetchAuthorDetail(id: number): Promise<Author> {
  const { data } = await apiClient.get<Author>('/manage/authors/detail', {
    params: { id },
  });
  return data;
}

/**
 * OpenAPI документирует `boolean`, на практике иногда приходит `id: number`.
 * Если id нет — ищем созданного автора в списке по ФИО.
 */
export async function addAuthor(payload: AuthorFormValues): Promise<Author> {
  const { data } = await apiClient.post<number | boolean>(
    '/manage/authors/add',
    toAuthorFormData(payload),
  );

  let id: number;

  if (typeof data === 'number') {
    id = data;
  } else {
    const authors = await fetchAuthors();
    const created = authors.find((author) => isSameAuthor(author, payload));

    if (!created) {
      throw new Error('Автор создан, но не найден в списке');
    }

    id = created.id;
  }

  return fetchAuthorDetail(id);
}

export async function editAuthor(
  id: number,
  payload: AuthorFormValues,
): Promise<Author> {
  await apiClient.post('/manage/authors/edit', toAuthorFormData(payload), {
    params: { id },
  });
  return fetchAuthorDetail(id);
}

export async function removeAuthor(id: number): Promise<void> {
  await apiClient.delete('/manage/authors/remove', {
    params: { id },
  });
}
