import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { postActions } from '../../../model/actions';
import { postInitialState, postReducer } from '../../../model/reducer';
import type { PostFormValues, PostState } from '../../../model/types';
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
  props: {
    mode: 'create' | 'edit';
    postId?: number;
    initialValues?: Partial<PostFormValues>;
  } = { mode: 'create' },
  preloaded?: PostState,
  dispatchSpy?: (action: unknown) => void,
) {
  const initialPost = preloaded ?? postInitialState;

  return componentRender(<PostForm {...props} />, {
    reducers: { post: postReducer },
    preloadedState: { post: initialPost },
    dispatchSpy,
    initialEntries: ['/posts/new'],
  });
}

describe('PostForm', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('не диспатчит create при пустой форме', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    renderPostForm({ mode: 'create' }, undefined, dispatchSpy);

    const submit = screen.getByTestId('postForm_button_submit');
    expect(submit).toHaveTextContent('Создать');
    await user.click(submit);

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

    await user.type(screen.getByTestId('postForm_input_title'), 'Заголовок');
    await user.type(screen.getByTestId('postForm_input_code'), 'my-post');
    await user.type(screen.getByTestId('postForm_input_text'), 'Текст поста');

    await user.click(screen.getByTestId('postForm_select_authorId'));
    await user.click(await screen.findByText('Иванов Иван Иванович'));

    await user.click(screen.getByTestId('postForm_select_tagIds'));
    await user.click(await screen.findByText('Новости'));

    await user.click(screen.getByTestId('postForm_button_submit'));

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

    renderPostForm({ mode: 'create' }, undefined, dispatchSpy);

    await user.type(screen.getByTestId('postForm_input_title'), 'Заголовок');
    await user.type(screen.getByTestId('postForm_input_code'), 'my-post');
    await user.type(screen.getByTestId('postForm_input_text'), 'Текст поста');

    await user.click(screen.getByTestId('postForm_select_authorId'));
    await user.click(await screen.findByText('Иванов Иван Иванович'));

    await user.click(screen.getByTestId('postForm_select_tagIds'));
    await user.click(await screen.findByText('Новости'));

    const input = screen
      .getByTestId('postForm_upload_previewPicture')
      .closest('.ant-form-item')
      ?.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).toBeTruthy();

    const file = new File(['image-bytes'], 'preview.png', {
      type: 'image/png',
    });
    await user.upload(input!, file);

    await user.click(screen.getByTestId('postForm_button_submit'));

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

  it('в mode=edit диспатчит updateRequest, кнопка «Сохранить»', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    const initialValues: PostFormValues = {
      title: 'Заголовок',
      code: 'my-post',
      authorId: 1,
      tagIds: [2],
      text: 'Текст поста',
      previewPicture: [
        {
          uid: '1',
          name: 'preview.png',
          url: '/old.png',
          status: 'done',
        },
      ],
    };

    renderPostForm(
      { mode: 'edit', postId: 5, initialValues },
      undefined,
      dispatchSpy,
    );

    const submit = screen.getByTestId('postForm_button_submit');
    expect(submit).toHaveTextContent('Сохранить');
    await user.click(submit);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        postActions.updateRequest({
          id: 5,
          values: expect.objectContaining({
            title: 'Заголовок',
            code: 'my-post',
            authorId: 1,
            tagIds: [2],
            text: 'Текст поста',
          }),
        }),
      );
    });
  });
});
