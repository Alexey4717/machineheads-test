import { Provider } from 'react-redux';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigProvider } from 'antd';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it, vi } from 'vitest';

import { authorActions } from '../../../model/actions';
import { authorInitialState, authorReducer } from '../../../model/reducer';
import type { AuthorState } from '../../../model/types';
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

vi.mock(
  './components/AuthorFormAvatarField/AuthorFormAvatarField.styles',
  () => ({
    useStyles: () => ({
      styles: { upload: 'upload', tip: 'tip' },
    }),
  }),
);

function renderAuthorForm(
  props: { mode: 'create' | 'edit'; authorId?: number } = { mode: 'create' },
  preloaded?: AuthorState,
  dispatchSpy?: (action: unknown) => void,
) {
  const initialAuthor = preloaded ?? authorInitialState;

  const store = createStore(
    (
      state: { author: AuthorState } = { author: initialAuthor },
      action: { type: string },
    ) => ({
      author: authorReducer(state.author, action),
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
      <ConfigProvider>
        <AuthorForm {...props} />
      </ConfigProvider>
    </Provider>,
  );
}

describe('AuthorForm', () => {
  it('не диспатчит create при пустой форме', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    renderAuthorForm({ mode: 'create' }, undefined, dispatchSpy);

    await user.click(screen.getByRole('button', { name: 'Создать' }));

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

    await user.type(screen.getByTestId('author-last-name'), 'Иванов');
    await user.type(screen.getByTestId('author-name'), 'Иван');
    await user.type(screen.getByTestId('author-second-name'), 'Иванович');
    await user.type(screen.getByTestId('author-short-description'), 'Кратко');
    await user.type(screen.getByTestId('author-description'), 'Полное');
    await user.click(screen.getByRole('button', { name: 'Создать' }));

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
});
