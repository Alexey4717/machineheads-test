import type { Page, Route } from '@playwright/test';

/** Креды только для e2e-моков, не демо-пароль из README. */
export const E2E_EMAIL = 'e2e@example.com';
export const E2E_PASSWORD = 'e2e-playwright-secret';

const TOKENS = {
  access_token: 'e2e-access-token',
  refresh_token: 'e2e-refresh-token',
};

interface AuthorRecord {
  id: number;
  name: string;
  lastName: string;
  secondName: string;
  avatar: null;
  shortDescription: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface TagRecord {
  id: number;
  name: string;
  code: string;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

interface PostFile {
  id: number;
  name: string;
  url: string;
}

interface PostRecord {
  id: number;
  title: string;
  code: string;
  previewPicture: PostFile | null;
  text: string;
  author: { id: number; fullName: string; avatar: null };
  tags: { id: number; name: string; code: string }[];
  createdAt: string;
  updatedAt: string;
}

const STAMP = '2024-01-01T00:00:00+00:00';

function createAuthor(
  partial: Partial<AuthorRecord> & { id: number },
): AuthorRecord {
  return {
    name: 'Иван',
    lastName: 'Иванов',
    secondName: 'Иванович',
    avatar: null,
    shortDescription: 'Кратко об авторе',
    description: 'Полное описание',
    createdAt: STAMP,
    updatedAt: STAMP,
    ...partial,
  };
}

function createTag(partial: Partial<TagRecord> & { id: number }): TagRecord {
  return {
    name: 'Новости',
    code: 'news',
    sort: 1,
    createdAt: STAMP,
    updatedAt: STAMP,
    ...partial,
  };
}

function formatAuthorName(author: AuthorRecord): string {
  return [author.lastName, author.name, author.secondName]
    .filter(Boolean)
    .join(' ');
}

function createPost(
  partial: Partial<PostRecord> & { id: number },
  author: AuthorRecord,
  tags: TagRecord[],
): PostRecord {
  return {
    title: 'Первый пост',
    code: 'first-post',
    previewPicture: {
      id: 100,
      name: 'preview.png',
      url: '/preview.png',
    },
    text: 'Текст первого поста',
    author: {
      id: author.id,
      fullName: formatAuthorName(author),
      avatar: null,
    },
    tags: tags.map((tag) => ({ id: tag.id, name: tag.name, code: tag.code })),
    createdAt: STAMP,
    updatedAt: STAMP,
    ...partial,
  };
}

function toListPost(post: PostRecord) {
  return {
    id: post.id,
    title: post.title,
    code: post.code,
    previewPicture: post.previewPicture,
    authorName: post.author.fullName,
    tagNames: post.tags.map((tag) => tag.name),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function parseMultipartFields(body: string | null): Record<string, string> {
  if (!body) {
    return {};
  }

  const fields: Record<string, string> = {};
  const marker = /name="([^"]+)"/g;
  let match = marker.exec(body);

  while (match) {
    const name = match[1];
    const after = body.slice(match.index + match[0].length);
    const sep = after.match(/\r?\n\r?\n/);

    if (name && sep && sep.index != null) {
      const rest = after.slice(sep.index + sep[0].length);
      const end = rest.match(/\r?\n--/);
      fields[name] = (end ? rest.slice(0, end.index) : rest).trim();
    }

    match = marker.exec(body);
  }

  return fields;
}

function json(
  route: Route,
  status: number,
  data: unknown,
  headers: Record<string, string> = {},
) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    headers,
    body: JSON.stringify(data),
  });
}

function apiPath(url: URL): string {
  return url.pathname.replace(/^\/api/, '') || url.pathname;
}

/** Перехватывает `/api/**` и отдаёт фикстуры вместо живого бэкенда. */
export async function mockApi(page: Page): Promise<void> {
  const authors: AuthorRecord[] = [createAuthor({ id: 1 })];
  const tags: TagRecord[] = [createTag({ id: 1 })];
  const posts: PostRecord[] = [
    createPost(
      { id: 1, title: 'Первый пост', code: 'first-post' },
      authors[0]!,
      tags,
    ),
    createPost(
      {
        id: 2,
        title: 'Второй пост',
        code: 'second-post',
        text: 'Текст второго поста',
      },
      authors[0]!,
      tags,
    ),
  ];

  let nextAuthorId = 10;
  let nextTagId = 10;
  let nextPostId = 10;

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();
    const path = apiPath(url);
    const fields = parseMultipartFields(request.postData());

    if (method === 'POST' && path === '/auth/token-generate') {
      if (fields.email === E2E_EMAIL && fields.password === E2E_PASSWORD) {
        return json(route, 200, TOKENS);
      }

      return json(route, 401, { message: 'Неверные учётные данные' });
    }

    if (method === 'POST' && path === '/auth/token-refresh') {
      return json(route, 200, TOKENS);
    }

    if (method === 'GET' && path === '/manage/authors') {
      return json(route, 200, authors);
    }

    if (method === 'GET' && path === '/manage/authors/detail') {
      const id = Number(url.searchParams.get('id'));
      const author = authors.find((item) => item.id === id);

      if (!author) {
        return json(route, 404, { message: 'Автор не найден' });
      }

      return json(route, 200, author);
    }

    if (method === 'POST' && path === '/manage/authors/add') {
      const author = createAuthor({
        id: nextAuthorId,
        name: fields.name || 'Имя',
        lastName: fields.lastName || 'Фамилия',
        secondName: fields.secondName || '',
        shortDescription: fields.shortDescription || '',
        description: fields.description || '',
      });
      nextAuthorId += 1;
      authors.push(author);
      return json(route, 200, author.id);
    }

    if (method === 'POST' && path === '/manage/authors/edit') {
      const id = Number(url.searchParams.get('id'));
      const author = authors.find((item) => item.id === id);

      if (!author) {
        return json(route, 404, { message: 'Автор не найден' });
      }

      author.name = fields.name ?? author.name;
      author.lastName = fields.lastName ?? author.lastName;
      author.secondName = fields.secondName ?? author.secondName;
      author.shortDescription =
        fields.shortDescription ?? author.shortDescription;
      author.description = fields.description ?? author.description;
      return json(route, 200, true);
    }

    if (method === 'GET' && path === '/manage/tags') {
      return json(route, 200, tags);
    }

    if (method === 'GET' && path === '/manage/tags/detail') {
      const id = Number(url.searchParams.get('id'));
      const tag = tags.find((item) => item.id === id);

      if (!tag) {
        return json(route, 404, { message: 'Тег не найден' });
      }

      return json(route, 200, tag);
    }

    if (method === 'POST' && path === '/manage/tags/add') {
      const tag = createTag({
        id: nextTagId,
        name: fields.name || 'Тег',
        code: fields.code || `tag-${nextTagId}`,
        sort: Number(fields.sort || 0),
      });
      nextTagId += 1;
      tags.push(tag);
      return json(route, 200, tag.id);
    }

    if (method === 'POST' && path === '/manage/tags/edit') {
      const id = Number(url.searchParams.get('id'));
      const tag = tags.find((item) => item.id === id);

      if (!tag) {
        return json(route, 404, { message: 'Тег не найден' });
      }

      tag.name = fields.name ?? tag.name;
      tag.code = fields.code ?? tag.code;
      tag.sort = fields.sort != null ? Number(fields.sort) : tag.sort;
      return json(route, 200, true);
    }

    if (method === 'GET' && path === '/manage/posts') {
      const pageNumber = Number(url.searchParams.get('page') || 1);
      const perPage = 1;
      const start = (pageNumber - 1) * perPage;
      const pageItems = posts.slice(start, start + perPage);
      const pageCount = Math.max(1, Math.ceil(posts.length / perPage));

      return json(route, 200, pageItems.map(toListPost), {
        'x-pagination-current-page': String(pageNumber),
        'x-pagination-page-count': String(pageCount),
        'x-pagination-per-page': String(perPage),
        'x-pagination-total-count': String(posts.length),
      });
    }

    if (method === 'GET' && path === '/manage/posts/detail') {
      const id = Number(url.searchParams.get('id'));
      const post = posts.find((item) => item.id === id);

      if (!post) {
        return json(route, 404, { message: 'Пост не найден' });
      }

      return json(route, 200, post);
    }

    if (method === 'POST' && path === '/manage/posts/add') {
      const author =
        authors.find((item) => item.id === Number(fields.authorId)) ??
        authors[0]!;
      const selectedTags = tags.filter((tag) =>
        Object.entries(fields).some(
          ([key, value]) =>
            key.startsWith('tagIds') && Number(value) === tag.id,
        ),
      );
      const post = createPost(
        {
          id: nextPostId,
          title: fields.title || 'Новый пост',
          code: fields.code || `post-${nextPostId}`,
          text: fields.text || '',
        },
        author,
        selectedTags.length > 0 ? selectedTags : tags,
      );
      nextPostId += 1;
      posts.unshift(post);
      return json(route, 200, post.id);
    }

    if (method === 'POST' && path === '/manage/posts/edit') {
      const id = Number(url.searchParams.get('id'));
      const post = posts.find((item) => item.id === id);

      if (!post) {
        return json(route, 404, { message: 'Пост не найден' });
      }

      post.title = fields.title ?? post.title;
      post.code = fields.code ?? post.code;
      post.text = fields.text ?? post.text;

      if (fields.authorId) {
        const author = authors.find(
          (item) => item.id === Number(fields.authorId),
        );
        if (author) {
          post.author = {
            id: author.id,
            fullName: formatAuthorName(author),
            avatar: null,
          };
        }
      }

      return json(route, 200, true);
    }

    return json(route, 404, { message: `Not mocked: ${method} ${path}` });
  });
}
