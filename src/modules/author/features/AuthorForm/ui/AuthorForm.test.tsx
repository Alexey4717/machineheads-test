import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { authorActions } from '../../../model/actions';
import { authorInitialState, authorReducer } from '../../../model/reducer';
import type { AuthorFormValues, AuthorState } from '../../../model/types';
import { AuthorForm } from './AuthorForm';

vi.mock('./AuthorForm.styles', () => ({
  useStyles: () => ({
    styles: { form: 'form' },
  }),
}));

vi.mock(
  './components/AuthorFormSubmitError/AuthorFormSubmitError.styles',
  () => ({
    useStyles: () => ({
      styles: { alert: 'alert' },
    }),
  }),
);

vi.mock('@/core/ui/ImageUploadField/ImageUploadField.styles', () => ({
  useStyles: () => ({
    styles: { upload: 'upload', tip: 'tip' },
  }),
}));

function renderAuthorForm(
  props: {
    mode: 'create' | 'edit';
    authorId?: number;
    initialValues?: Partial<AuthorFormValues>;
  } = { mode: 'create' },
  preloaded?: AuthorState,
  dispatchSpy?: (action: unknown) => void,
) {
  const initialAuthor = preloaded ?? authorInitialState;

  return componentRender(<AuthorForm {...props} />, {
    reducers: { author: authorReducer },
    preloadedState: { author: initialAuthor },
    dispatchSpy,
  });
}

describe('AuthorForm', () => {
  it('не диспатчит create при пустой форме', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    renderAuthorForm({ mode: 'create' }, undefined, dispatchSpy);

    const submit = screen.getByTestId('authorForm_button_submit');
    expect(submit).toHaveTextContent('Создать');
    await user.click(submit);

    await waitFor(() => {
      expect(screen.getByText('Укажите фамилию')).toBeInTheDocument();
    });

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'author/CREATE_REQUEST' }),
    );
  });

  it('диспатчит createRequest с валидными значениями', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    renderAuthorForm({ mode: 'create' }, undefined, dispatchSpy);

    await user.type(screen.getByTestId('authorForm_input_lastName'), 'Иванов');
    await user.type(screen.getByTestId('authorForm_input_name'), 'Иван');
    await user.type(
      screen.getByTestId('authorForm_input_secondName'),
      'Иванович',
    );
    await user.type(
      screen.getByTestId('authorForm_input_shortDescription'),
      'Кратко',
    );
    await user.type(
      screen.getByTestId('authorForm_input_description'),
      'Полное',
    );
    await user.click(screen.getByTestId('authorForm_button_submit'));

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        authorActions.createRequest({
          name: 'Иван',
          lastName: 'Иванов',
          secondName: 'Иванович',
          shortDescription: 'Кратко',
          description: 'Полное',
          removeAvatar: false,
        }),
      );
    });
  });

  it('показывает system error из store', () => {
    renderAuthorForm(
      { mode: 'create' },
      {
        ...authorInitialState,
        submitError: { kind: 'unknown', message: 'Сервер недоступен' },
      },
    );

    expect(screen.getByText('Сервер недоступен')).toBeInTheDocument();
  });

  it('в mode=edit диспатчит updateRequest, кнопка «Сохранить»', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    const initialValues: AuthorFormValues = {
      name: 'Иван',
      lastName: 'Иванов',
      secondName: 'Иванович',
      shortDescription: 'Кратко',
      description: 'Полное',
      removeAvatar: false,
    };

    renderAuthorForm(
      { mode: 'edit', authorId: 5, initialValues },
      undefined,
      dispatchSpy,
    );

    const submit = screen.getByTestId('authorForm_button_submit');
    expect(submit).toHaveTextContent('Сохранить');
    await user.click(submit);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        authorActions.updateRequest({ id: 5, values: initialValues }),
      );
    });
  });
});
