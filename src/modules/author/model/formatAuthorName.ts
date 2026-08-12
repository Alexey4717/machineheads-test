import type { Author } from './types';

/** ФИО: фамилия, имя, отчество. */
export function formatAuthorName(
  author: Pick<Author, 'name' | 'lastName' | 'secondName'>,
): string {
  return [author.lastName, author.name, author.secondName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ');
}
