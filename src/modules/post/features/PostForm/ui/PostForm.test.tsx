import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigProvider } from 'antd';
import { legacy_createStore as createStore } from 'redux';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { postInitialState, postReducer } from '../../../model/reducer';
import type { PostState } from '../../../model/types';
import { PostForm } from './PostForm';

vi.mock('@/modules/author', () => ({
  authorActions: {
    listRequest: () => ({ type: 'author/LIST_REQUEST' }),
  },
  selectAuthorOptions: () => [{ value: 1, label: 'Иванов Иван Иванович' }],
  selectAuthorListStatus: () => 'success',
}));

vi.mock('@/modules/tag', () => ({
  tagActions: {
    listRequest: () => ({ type: 'tag/LIST_REQUEST' }),
  },
  selectTagOptions: () => [{ value: 2, label: 'Новости' }],
  selectTagListStatus: () => 'success',
}));

vi.mock('./PostForm.styles', () => ({
  useStyles: () => ({
    styles: { form: 'form' },
  }),
}));

vi.mock('./components/PostFormSubmitError/PostFormSubmitError.styles', () => ({
  useStyles: () => ({
    styles: { alert: 'alert' },
  }),
}));

vi.mock('./components/PostFormAuthorField/PostFormAuthorField.styles', () => ({
  useStyles: () => ({
    styles: { alert: 'alert' },
  }),
}));

vi.mock('./components/PostFormTagIdsField/PostFormTagIdsField.styles', () => ({
  useStyles: () => ({
    styles: { alert: 'alert' },
  }),
}));

vi.mock('@/core/ui/ImageUploadField/ImageUploadField.styles', () => ({
  useStyles: () => ({
    styles: { upload: 'upload', tip: 'tip' },
  }),
}));

function renderPostForm(
  props: { mode: 'create' | 'edit'; postId?: number } = { mode: 'create' },
  preloaded?: PostState,
  dispatchSpy?: (action: unknown) => void,
) {
  const initialPost = preloaded ?? postInitialState;

  const store = createStore(
    (
      state: { post: PostState } = { post: initialPost },
      action: { type: string },
    ) => ({
      post: postReducer(state.post, action),
    }),
  );

  if (dispatchSpy) {
    const originalDispatch = store.dispatch.bind(store);
    store.dispatch = ((action: unknown) => {
      dispatchSpy(action as never);
      return originalDispatch(action as never);
    }) as typeof store.dispatch;
  }

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/posts/new']}>
        <ConfigProvider>
          <PostForm {...props} />
        </ConfigProvider>
      </MemoryRouter>
    </Provider>,
  );
}

describe('PostForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('не диспатчит create при пустой форме', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    renderPostForm({ mode: 'create' }, undefined, dispatchSpy);

    await user.click(screen.getByRole('button', { name: 'Создать' }));

    await waitFor(() => {
      expect(screen.getByText('Укажите название')).toBeInTheDocument();
    });

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'post/CREATE_REQUEST' }),
    );
  });

  it('не диспатчит create без previewPicture и показывает ошибку поля', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    renderPostForm({ mode: 'create' }, undefined, dispatchSpy);

    await user.type(screen.getByTestId('post-title'), 'Заголовок');
    await user.type(screen.getByTestId('post-code'), 'my-post');
    await user.type(screen.getByTestId('post-text'), 'Текст поста');

    await user.click(screen.getByRole('combobox', { name: /Автор/i }));
    await user.click(await screen.findByText('Иванов Иван Иванович'));

    await user.click(screen.getByRole('combobox', { name: /Теги/i }));
    await user.click(await screen.findByText('Новости'));

    await user.click(screen.getByRole('button', { name: 'Создать' }));

    await waitFor(() => {
      expect(
        screen.getByText('Необходимо заполнить «Изображение».'),
      ).toBeInTheDocument();
    });

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'post/CREATE_REQUEST' }),
    );
  });

  it('диспатчит createRequest с валидными значениями', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-preview');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    const { container } = renderPostForm(
      { mode: 'create' },
      undefined,
      dispatchSpy,
    );

    await user.type(screen.getByTestId('post-title'), 'Заголовок');
    await user.type(screen.getByTestId('post-code'), 'my-post');
    await user.type(screen.getByTestId('post-text'), 'Текст поста');

    await user.click(screen.getByRole('combobox', { name: /Автор/i }));
    await user.click(await screen.findByText('Иванов Иван Иванович'));

    await user.click(screen.getByRole('combobox', { name: /Теги/i }));
    await user.click(await screen.findByText('Новости'));

    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).toBeTruthy();

    const file = new File(['image-bytes'], 'preview.png', {
      type: 'image/png',
    });
    await user.upload(input!, file);

    await user.click(screen.getByRole('button', { name: 'Создать' }));

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'post/CREATE_REQUEST',
          payload: expect.objectContaining({
            title: 'Заголовок',
            code: 'my-post',
            authorId: 1,
            tagIds: [2],
            text: 'Текст поста',
            previewPicture: [
              expect.objectContaining({
                name: 'preview.png',
                status: 'done',
                thumbUrl: 'blob:mock-preview',
              }),
            ],
          }),
        }),
      );
    });
  });

  it('показывает system error из store', () => {
    renderPostForm(
      { mode: 'create' },
      {
        ...postInitialState,
        submitError: { kind: 'unknown', message: 'Сервер недоступен' },
      },
    );

    expect(screen.getByText('Сервер недоступен')).toBeInTheDocument();
  });
});
