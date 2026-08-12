import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it, vi } from 'vitest';

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

  const store = createStore(
    (
      state: { author: AuthorState } = { author: initialAuthor },
      action: { type: string },
    ) => ({
      author: authorReducer(state.author, action),
    }),
  );

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ConfigProvider>
          <AuthorsList />
        </ConfigProvider>
      </MemoryRouter>
    </Provider>,
  );
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
    expect(screen.getByTestId('authors-list-card-1')).toHaveTextContent(
      'Иванов Иван Иванович',
    );
    expect(screen.getByTestId('authors-list-card-1')).toHaveAttribute(
      'href',
      '/authors/1',
    );
  });
});
