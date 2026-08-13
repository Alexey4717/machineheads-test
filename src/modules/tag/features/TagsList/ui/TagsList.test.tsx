import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { tagInitialState, tagReducer } from '../../../model/reducer';
import type { Tag, TagState } from '../../../model/types';
import { TagsList } from './TagsList';

vi.mock('./TagsList.styles', () => ({
  useStyles: () => ({
    styles: {
      root: 'root',
    },
  }),
}));

vi.mock('./components/TagsListHeader/TagsListHeader.styles', () => ({
  useStyles: () => ({
    styles: {
      header: 'header',
    },
  }),
}));

vi.mock('./components/TagsListCard/TagsListCard.styles', () => ({
  useStyles: () => ({
    styles: {
      card: 'card',
      cell: 'cell',
    },
  }),
}));

vi.mock('./components/TagsListEmpty/TagsListEmpty.styles', () => ({
  useStyles: () => ({
    styles: {
      empty: 'empty',
    },
  }),
}));

const tag: Tag = {
  id: 1,
  name: 'Новости',
  code: 'news',
  sort: 10,
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

function renderTagsList(preloaded?: TagState) {
  const initialTag = preloaded ?? tagInitialState;

  return componentRender(<TagsList />, {
    reducers: { tag: tagReducer },
    preloadedState: { tag: initialTag },
  });
}

describe('TagsList', () => {
  it('показывает empty при пустом списке', () => {
    renderTagsList();

    expect(screen.getByTestId('tags-list-empty')).toBeInTheDocument();
    expect(screen.getByText('Тегов пока нет')).toBeInTheDocument();
  });

  it('рендерит карточки тегов', () => {
    renderTagsList({
      ...tagInitialState,
      entities: { [tag.id]: tag },
      listIds: [tag.id],
    });

    expect(screen.getByTestId('tags-list')).toBeInTheDocument();
    expect(screen.getByTestId('tagsList_link_TAG_DETAIL_1')).toHaveTextContent(
      'Новости',
    );
    expect(screen.getByTestId('tagsList_link_TAG_DETAIL_1')).toHaveAttribute(
      'href',
      '/tags/1',
    );
  });
});
