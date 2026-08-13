import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it, vi } from 'vitest';

import { postInitialState, postReducer } from '../../../model/reducer';
import type { Post, PostState } from '../../../model/types';
import { PostsList } from './PostsList';

vi.mock('./PostsList.styles', () => ({
  useStyles: () => ({
    styles: {
      root: 'root',
    },
  }),
}));

vi.mock('./components/PostsListHeader/PostsListHeader.styles', () => ({
  useStyles: () => ({
    styles: {
      header: 'header',
    },
  }),
}));

vi.mock('./components/PostsListCard/PostsListCard.styles', () => ({
  useStyles: () => ({
    styles: {
      card: 'card',
      cell: 'cell',
    },
  }),
}));

vi.mock('./components/PostsListEmpty/PostsListEmpty.styles', () => ({
  useStyles: () => ({
    styles: {
      empty: 'empty',
    },
  }),
}));

vi.mock('./components/PostsListPagination/PostsListPagination.styles', () => ({
  useStyles: () => ({
    styles: {
      root: 'pagination',
    },
  }),
}));

const post: Post = {
  id: 1,
  title: 'Заголовок',
  code: 'code',
  authorName: 'Иванов Иван',
  previewPicture: null,
  tagNames: ['news', 'tech'],
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

function renderPostsList(preloaded?: PostState) {
  const initialPost = preloaded ?? postInitialState;

  const store = createStore(
    (
      state: { post: PostState } = { post: initialPost },
      action: { type: string },
    ) => ({
      post: postReducer(state.post, action),
    }),
  );

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ConfigProvider>
          <PostsList />
        </ConfigProvider>
      </MemoryRouter>
    </Provider>,
  );
}

describe('PostsList', () => {
  it('показывает empty при пустом списке на первой странице', () => {
    renderPostsList();

    expect(screen.getByTestId('posts-list-empty')).toBeInTheDocument();
    expect(screen.getByText('Постов пока нет')).toBeInTheDocument();
  });

  it('рендерит карточки постов', () => {
    renderPostsList({
      ...postInitialState,
      entities: { [post.id]: post },
      listIds: [post.id],
      pagination: {
        currentPage: 1,
        pageCount: 1,
        perPage: 10,
        totalCount: 1,
      },
    });

    expect(screen.getByTestId('posts-list')).toBeInTheDocument();
    expect(screen.getByTestId('posts-list-card-1')).toHaveTextContent(
      'Заголовок',
    );
    expect(screen.getByTestId('posts-list-card-1')).toHaveTextContent(
      'Иванов Иван',
    );
    expect(screen.getByTestId('posts-list-card-1')).toHaveTextContent(
      'news, tech',
    );
    expect(screen.getByTestId('posts-list-card-1')).toHaveAttribute(
      'href',
      '/posts/1',
    );
  });

  it('показывает пагинацию при pageCount > 1', () => {
    renderPostsList({
      ...postInitialState,
      entities: { [post.id]: post },
      listIds: [post.id],
      pagination: {
        currentPage: 1,
        pageCount: 3,
        perPage: 10,
        totalCount: 25,
      },
    });

    expect(screen.getByTestId('posts-list-pagination')).toBeInTheDocument();
  });
});
