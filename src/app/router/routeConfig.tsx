import type { ComponentType } from 'react';

import { PATHS, type RouteName } from '@/core/config/router/paths';

import { LoginPageAsync, NotFoundPageAsync } from '@/modules/auth';
import {
  AuthorCreatePageAsync,
  AuthorEditPageAsync,
  AuthorsPageAsync,
} from '@/modules/author';
import {
  PostCreatePageAsync,
  PostEditPageAsync,
  PostsPageAsync,
} from '@/modules/post';
import {
  TagCreatePageAsync,
  TagEditPageAsync,
  TagsPageAsync,
} from '@/modules/tag';

import { HomeRedirect } from './HomeRedirect';

export type AppLayoutType = 'admin' | 'auth' | 'none';

export interface AppRouteProps {
  path?: string;
  exact?: boolean;
  authOnly?: boolean;
  guestOnly?: boolean;
  layout?: AppLayoutType;
  element: ComponentType;
}

export const routeConfig: Record<RouteName, AppRouteProps> = {
  LOGIN: {
    path: PATHS.LOGIN,
    exact: true,
    guestOnly: true,
    layout: 'auth',
    element: LoginPageAsync,
  },
  HOME: {
    path: PATHS.HOME,
    exact: true,
    authOnly: true,
    layout: 'none',
    element: HomeRedirect,
  },
  POSTS: {
    path: PATHS.POSTS,
    exact: true,
    authOnly: true,
    layout: 'admin',
    element: PostsPageAsync,
  },
  POST_CREATE: {
    path: PATHS.POST_CREATE,
    exact: true,
    authOnly: true,
    layout: 'admin',
    element: PostCreatePageAsync,
  },
  POST_EDIT: {
    path: PATHS.POST_EDIT,
    exact: true,
    authOnly: true,
    layout: 'admin',
    element: PostEditPageAsync,
  },
  AUTHORS: {
    path: PATHS.AUTHORS,
    exact: true,
    authOnly: true,
    layout: 'admin',
    element: AuthorsPageAsync,
  },
  AUTHOR_CREATE: {
    path: PATHS.AUTHOR_CREATE,
    exact: true,
    authOnly: true,
    layout: 'admin',
    element: AuthorCreatePageAsync,
  },
  AUTHOR_EDIT: {
    path: PATHS.AUTHOR_EDIT,
    exact: true,
    authOnly: true,
    layout: 'admin',
    element: AuthorEditPageAsync,
  },
  TAGS: {
    path: PATHS.TAGS,
    exact: true,
    authOnly: true,
    layout: 'admin',
    element: TagsPageAsync,
  },
  TAG_CREATE: {
    path: PATHS.TAG_CREATE,
    exact: true,
    authOnly: true,
    layout: 'admin',
    element: TagCreatePageAsync,
  },
  TAG_EDIT: {
    path: PATHS.TAG_EDIT,
    exact: true,
    authOnly: true,
    layout: 'admin',
    element: TagEditPageAsync,
  },
  notFound: {
    authOnly: true,
    layout: 'admin',
    element: NotFoundPageAsync,
  },
};
