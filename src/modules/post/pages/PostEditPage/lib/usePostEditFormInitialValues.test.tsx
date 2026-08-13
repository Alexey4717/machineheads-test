import { Route } from 'react-router-dom';

import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { postInitialState, postReducer } from '../../../model/reducer';
import type { Post } from '../../../model/types';
import { usePostEditFormInitialValues } from './usePostEditFormInitialValues';

const post: Post = {
  id: 5,
  title: 'Пост',
  code: 'post-code',
  previewPicture: {
    id: 20,
    name: 'cover.png',
    url: '/files/cover.png',
  },
  text: 'Текст',
  author: { id: 1, fullName: 'Иванов Иван', avatar: null },
  tags: [
    { id: 2, name: 'Новости', code: 'news' },
    { id: 3, name: 'Tech', code: 'tech' },
  ],
  createdAt: '2024-01-01T00:00:00+00:00',
  updatedAt: '2024-01-02T00:00:00+00:00',
};

interface ProbeProps {
  onValue: (value: ReturnType<typeof usePostEditFormInitialValues>) => void;
}

const Probe = ({ onValue }: ProbeProps) => {
  onValue(usePostEditFormInitialValues());
  return null;
};

describe('usePostEditFormInitialValues', () => {
  it('маппит entity в поля формы, preview → UploadFile[]', () => {
    const onValue = vi.fn();

    componentRender(
      <Route path="/posts/:id/edit">
        <Probe onValue={onValue} />
      </Route>,
      {
        initialEntries: ['/posts/5/edit'],
        reducers: { post: postReducer },
        preloadedState: {
          post: {
            ...postInitialState,
            entities: { [post.id]: post },
            currentDetailId: post.id,
          },
        },
      },
    );

    expect(onValue).toHaveBeenCalledWith({
      postId: 5,
      initialValues: {
        title: 'Пост',
        code: 'post-code',
        authorId: 1,
        tagIds: [2, 3],
        text: 'Текст',
        previewPicture: [
          {
            uid: '20',
            name: 'cover.png',
            status: 'done',
            url: '/files/cover.png',
          },
        ],
      },
    });
  });

  it('без url превью отдаёт пустой file list', () => {
    const onValue = vi.fn();

    componentRender(
      <Route path="/posts/:id/edit">
        <Probe onValue={onValue} />
      </Route>,
      {
        initialEntries: ['/posts/5/edit'],
        reducers: { post: postReducer },
        preloadedState: {
          post: {
            ...postInitialState,
            entities: {
              [post.id]: { ...post, previewPicture: null },
            },
            currentDetailId: post.id,
          },
        },
      },
    );

    expect(onValue).toHaveBeenCalledWith({
      postId: 5,
      initialValues: expect.objectContaining({
        previewPicture: [],
      }),
    });
  });

  it('если нет author в detail — initialValues undefined', () => {
    const onValue = vi.fn();

    componentRender(
      <Route path="/posts/:id/edit">
        <Probe onValue={onValue} />
      </Route>,
      {
        initialEntries: ['/posts/5/edit'],
        reducers: { post: postReducer },
        preloadedState: {
          post: {
            ...postInitialState,
            entities: { [post.id]: { ...post, author: undefined } },
            currentDetailId: post.id,
          },
        },
      },
    );

    expect(onValue).toHaveBeenCalledWith({
      postId: 5,
      initialValues: undefined,
    });
  });
});
