/**
 * Канонические path-шаблоны приложения.
 *
 * Статические пути — строковые литералы (`PATHS.POSTS`).
 * Динамические содержат сегмент `:id` и используются как:
 * - шаблон `Route path` — сам `PATHS.POST_EDIT`
 * - навигация — `getPath(PATHS.POST_EDIT, { id })`
 */
export const PATHS = {
  LOGIN: '/login',
  HOME: '/',
  POSTS: '/posts',
  POST_CREATE: '/posts/new',
  /** Редактирование поста (`:id` — идентификатор). */
  POST_EDIT: '/posts/:id/edit',
  AUTHORS: '/authors',
  AUTHOR_CREATE: '/authors/new',
  /** Редактирование автора (`:id` — идентификатор). */
  AUTHOR_EDIT: '/authors/:id/edit',
  TAGS: '/tags',
  TAG_CREATE: '/tags/new',
  /** Редактирование тега (`:id` — идентификатор). */
  TAG_EDIT: '/tags/:id/edit',
} as const;

export type PathName = keyof typeof PATHS;

export type AppPath = (typeof PATHS)[PathName];

export type RouteName = PathName | 'notFound';
