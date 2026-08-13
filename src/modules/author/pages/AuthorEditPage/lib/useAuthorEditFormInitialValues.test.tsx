import { Route } from 'react-router-dom';

import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { authorInitialState, authorReducer } from '../../../model/reducer';
import type { Author } from '../../../model/types';
import { useAuthorEditFormInitialValues } from './useAuthorEditFormInitialValues';

const author: Author = {
  id: 5,
  name: 'Иван',
  lastName: 'Иванов',
  secondName: 'Иванович',
  avatar: {
    id: 10,
    name: 'photo.png',
    url: '/files/photo.png',
  },
  shortDescription: 'Кратко',
  description: 'Полное',
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

interface ProbeProps {
  onValue: (value: ReturnType<typeof useAuthorEditFormInitialValues>) => void;
}

const Probe = ({ onValue }: ProbeProps) => {
  onValue(useAuthorEditFormInitialValues());
  return null;
};

describe('useAuthorEditFormInitialValues', () => {
  it('маппит entity в поля формы, avatar → UploadFile[]', () => {
    const onValue = vi.fn();

    componentRender(
      <Route path="/authors/:id/edit">
        <Probe onValue={onValue} />
      </Route>,
      {
        initialEntries: ['/authors/5/edit'],
        reducers: { author: authorReducer },
        preloadedState: {
          author: {
            ...authorInitialState,
            entities: { [author.id]: author },
            currentDetailId: author.id,
          },
        },
      },
    );

    expect(onValue).toHaveBeenCalledWith({
      authorId: 5,
      initialValues: {
        name: 'Иван',
        lastName: 'Иванов',
        secondName: 'Иванович',
        shortDescription: 'Кратко',
        description: 'Полное',
        avatar: [
          {
            uid: '10',
            name: 'photo.png',
            status: 'done',
            url: '/files/photo.png',
          },
        ],
        removeAvatar: false,
      },
    });
  });

  it('без url аватара отдаёт пустой file list', () => {
    const onValue = vi.fn();

    componentRender(
      <Route path="/authors/:id/edit">
        <Probe onValue={onValue} />
      </Route>,
      {
        initialEntries: ['/authors/5/edit'],
        reducers: { author: authorReducer },
        preloadedState: {
          author: {
            ...authorInitialState,
            entities: { [author.id]: { ...author, avatar: null } },
            currentDetailId: author.id,
          },
        },
      },
    );

    expect(onValue).toHaveBeenCalledWith({
      authorId: 5,
      initialValues: expect.objectContaining({
        avatar: [],
      }),
    });
  });

  it('если current author не совпадает с id из URL — initialValues undefined', () => {
    const onValue = vi.fn();

    componentRender(
      <Route path="/authors/:id/edit">
        <Probe onValue={onValue} />
      </Route>,
      {
        initialEntries: ['/authors/99/edit'],
        reducers: { author: authorReducer },
        preloadedState: {
          author: {
            ...authorInitialState,
            entities: { [author.id]: author },
            currentDetailId: author.id,
          },
        },
      },
    );

    expect(onValue).toHaveBeenCalledWith({
      authorId: 99,
      initialValues: undefined,
    });
  });
});
