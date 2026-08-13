import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { authorInitialState, authorReducer } from '../../../model/reducer';
import type { Author, AuthorState } from '../../../model/types';
import { AuthorsList } from './AuthorsList';

vi.mock('./AuthorsList.styles', () => ({
  useStyles: () => ({
    styles: {
      root: 'root',
    },
  }),
}));

vi.mock('./components/AuthorsListHeader/AuthorsListHeader.styles', () => ({
  useStyles: () => ({
    styles: {
      header: 'header',
    },
  }),
}));

vi.mock('./components/AuthorsListCard/AuthorsListCard.styles', () => ({
  useStyles: () => ({
    styles: {
      card: 'card',
      cell: 'cell',
    },
  }),
}));

vi.mock('./components/AuthorsListEmpty/AuthorsListEmpty.styles', () => ({
  useStyles: () => ({
    styles: {
      empty: 'empty',
    },
  }),
}));

const author: Author = {
  id: 1,
  name: 'Иван',
  lastName: 'Иванов',
  secondName: 'Иванович',
  avatar: null,
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

function renderAuthorsList(preloaded?: AuthorState) {
  const initialAuthor = preloaded ?? authorInitialState;

  return componentRender(<AuthorsList />, {
    reducers: { author: authorReducer },
    preloadedState: { author: initialAuthor },
  });
}

describe('AuthorsList', () => {
  it('показывает empty при пустом списке', () => {
    renderAuthorsList();

    expect(screen.getByTestId('authors-list-empty')).toBeInTheDocument();
    expect(screen.getByText('Авторов пока нет')).toBeInTheDocument();
  });

  it('рендерит карточки авторов', () => {
    renderAuthorsList({
      ...authorInitialState,
      entities: { [author.id]: author },
      listIds: [author.id],
    });

    expect(screen.getByTestId('authors-list')).toBeInTheDocument();
    expect(
      screen.getByTestId('authorsList_link_AUTHOR_DETAIL_1'),
    ).toHaveTextContent('Иванов Иван Иванович');
    expect(
      screen.getByTestId('authorsList_link_AUTHOR_DETAIL_1'),
    ).toHaveAttribute('href', '/authors/1');
  });
});
