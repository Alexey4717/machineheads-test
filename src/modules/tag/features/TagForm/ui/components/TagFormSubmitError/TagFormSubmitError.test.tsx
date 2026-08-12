import { Provider } from 'react-redux';

import { render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider, Form } from 'antd';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it, vi } from 'vitest';

import { tagInitialState, tagReducer } from '../../../../../model/reducer';
import type { TagState } from '../../../../../model/types';
import { TagFormSubmitError } from './TagFormSubmitError';

vi.mock('./TagFormSubmitError.styles', () => ({
  useStyles: () => ({
    styles: { alert: 'alert' },
  }),
}));

function renderWithStore(preloaded?: TagState) {
  const initialTag = preloaded ?? tagInitialState;

  const store = createStore(
    (
      state: { tag: TagState } = { tag: initialTag },
      action: { type: string },
    ) => ({
      tag: tagReducer(state.tag, action),
    }),
  );

  return render(
    <Provider store={store}>
      <ConfigProvider>
        <Form>
          <TagFormSubmitError />
          <Form.Item name="name">
            <input data-testid="name-field" />
          </Form.Item>
        </Form>
      </ConfigProvider>
    </Provider>,
  );
}

describe('TagFormSubmitError', () => {
  it('ничего не рендерит без ошибки', () => {
    const { container } = renderWithStore();

    expect(container.querySelector('.ant-alert')).toBeNull();
  });

  it('показывает Alert для system/unknown ошибки', () => {
    renderWithStore({
      ...tagInitialState,
      submitError: { kind: 'unknown', message: 'Сервер недоступен' },
    });

    expect(screen.getByText('Сервер недоступен')).toBeInTheDocument();
  });

  it('не показывает Alert для validation и проставляет field errors', async () => {
    renderWithStore({
      ...tagInitialState,
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
