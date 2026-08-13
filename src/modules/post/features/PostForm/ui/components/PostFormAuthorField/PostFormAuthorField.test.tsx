import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigProvider, Form } from 'antd';
import { push } from 'connected-react-router';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it, vi } from 'vitest';

import { PATHS } from '@/core/config/router/paths';
import { withReturnTo } from '@/core/lib/router/parseReturnTo';

import { PostFormAuthorField } from './PostFormAuthorField';

const listRequest = vi.fn(() => ({ type: 'author/LIST_REQUEST' }));

vi.mock('@/modules/author', () => ({
  authorActions: {
    listRequest: () => listRequest(),
  },
  selectAuthorOptions: (state: { options: unknown[] }) => state.options,
  selectAuthorListStatus: (state: { listStatus: string }) => state.listStatus,
}));

vi.mock('./PostFormAuthorField.styles', () => ({
  useStyles: () => ({
    styles: { alert: 'alert' },
  }),
}));

function renderField(state: {
  options: { value: number; label: string }[];
  listStatus: string;
}) {
  const store = createStore(() => state);
  const dispatchSpy = vi.fn();
  const originalDispatch = store.dispatch.bind(store);
  store.dispatch = ((action: unknown) => {
    dispatchSpy(action as never);
    return originalDispatch(action as never);
  }) as typeof store.dispatch;

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/posts/new']}>
        <ConfigProvider>
          <Form>
            <PostFormAuthorField />
          </Form>
        </ConfigProvider>
      </MemoryRouter>
    </Provider>,
  );

  return { dispatchSpy };
}

describe('PostFormAuthorField', () => {
  it('показывает Alert и ведёт на создание автора с returnTo при пустом списке', async () => {
    const user = userEvent.setup();
    const { dispatchSpy } = renderField({ options: [], listStatus: 'success' });

    expect(
      screen.getByText('Отсутствуют авторы, необходимые для создания поста'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Создать' }));

    expect(dispatchSpy).toHaveBeenCalledWith(
      push(withReturnTo(PATHS.AUTHOR_CREATE, '/posts/new')),
    );
  });

  it('не показывает Alert во время загрузки', () => {
    renderField({ options: [], listStatus: 'loading' });

    expect(
      screen.queryByText('Отсутствуют авторы, необходимые для создания поста'),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Автор/i })).toBeDisabled();
  });

  it('не показывает Alert, если есть опции', () => {
    renderField({
      options: [{ value: 1, label: 'Иванов' }],
      listStatus: 'success',
    });

    expect(
      screen.queryByText('Отсутствуют авторы, необходимые для создания поста'),
    ).not.toBeInTheDocument();
  });
});
