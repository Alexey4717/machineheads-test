import { Provider } from 'react-redux';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigProvider } from 'antd';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it, vi } from 'vitest';

import { authActions } from '../../../model/actions';
import { authReducer } from '../../../model/reducer';
import type { AuthState } from '../../../model/types';
import { LoginForm } from './LoginForm';

vi.mock('./LoginForm.styles', () => ({
  useStyles: () => ({
    styles: { form: 'form', alert: 'alert' },
  }),
}));

function renderLoginForm(
  preloaded?: AuthState,
  dispatchSpy?: (action: unknown) => void,
) {
  const initialAuth: AuthState = preloaded ?? {
    isAuthenticated: false,
    isSubmitting: false,
    error: null,
  };

  const store = createStore(
    (
      state: { auth: AuthState } = { auth: initialAuth },
      action: { type: string },
    ) => ({
      auth: authReducer(state.auth, action),
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
        <LoginForm />
      </ConfigProvider>
    </Provider>,
  );
}

describe('LoginForm', () => {
  it('не диспатчит login при пустой форме', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    renderLoginForm(undefined, dispatchSpy);

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(screen.getByText('Укажите e-mail')).toBeInTheDocument();
    });

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'auth/LOGIN_REQUEST' }),
    );
  });

  it('диспатчит loginRequest с валидными значениями', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    renderLoginForm(undefined, dispatchSpy);

    await user.type(screen.getByTestId('login-email'), 'test@test.ru');
    await user.type(screen.getByTestId('login-password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        authActions.loginRequest({
          email: 'test@test.ru',
          password: 'secret',
        }),
      );
    });
  });

  it('показывает server error из store', () => {
    renderLoginForm({
      isAuthenticated: false,
      isSubmitting: false,
      error: { kind: 'unknown', message: 'Неверный логин или пароль' },
    });

    expect(screen.getByText('Неверный логин или пароль')).toBeInTheDocument();
  });
});
