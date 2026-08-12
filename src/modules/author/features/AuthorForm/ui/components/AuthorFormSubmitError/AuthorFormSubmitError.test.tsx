import { Provider } from 'react-redux';

import { render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider, Form } from 'antd';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it, vi } from 'vitest';

import {
  authorInitialState,
  authorReducer,
} from '../../../../../model/reducer';
import type { AuthorState } from '../../../../../model/types';
import { AuthorFormSubmitError } from './AuthorFormSubmitError';

vi.mock('./AuthorFormSubmitError.styles', () => ({
  useStyles: () => ({
    styles: { alert: 'alert' },
  }),
}));

function renderWithStore(preloaded?: AuthorState) {
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
      <ConfigProvider>
        <Form>
          <AuthorFormSubmitError />
          <Form.Item name="name">
            <input data-testid="name-field" />
          </Form.Item>
        </Form>
      </ConfigProvider>
    </Provider>,
  );
}

describe('AuthorFormSubmitError', () => {
  it('ничего не рендерит без ошибки', () => {
    const { container } = renderWithStore();

    expect(container.querySelector('.ant-alert')).toBeNull();
  });

  it('показывает Alert для system/unknown ошибки', () => {
    renderWithStore({
      ...authorInitialState,
      submitError: { kind: 'unknown', message: 'Сервер недоступен' },
    });

    expect(screen.getByText('Сервер недоступен')).toBeInTheDocument();
  });

  it('не показывает Alert для validation и проставляет field errors', async () => {
    renderWithStore({
      ...authorInitialState,
      submitError: {
        kind: 'validation',
        status: 422,
        fields: [{ field: 'name', message: 'Уже занято' }],
      },
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Уже занято')).toBeInTheDocument();
    });
  });
});
