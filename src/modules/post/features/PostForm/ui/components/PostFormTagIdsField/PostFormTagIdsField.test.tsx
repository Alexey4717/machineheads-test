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

import { PostFormTagIdsField } from './PostFormTagIdsField';

const listRequest = vi.fn(() => ({ type: 'tag/LIST_REQUEST' }));

vi.mock('@/modules/tag', () => ({
  tagActions: {
    listRequest: () => listRequest(),
  },
  selectTagOptions: (state: { options: unknown[] }) => state.options,
  selectTagListStatus: (state: { listStatus: string }) => state.listStatus,
}));

vi.mock('./PostFormTagIdsField.styles', () => ({
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
      <MemoryRouter initialEntries={['/posts/3/edit']}>
        <ConfigProvider>
          <Form>
            <PostFormTagIdsField />
          </Form>
        </ConfigProvider>
      </MemoryRouter>
    </Provider>,
  );

  return { dispatchSpy };
}

describe('PostFormTagIdsField', () => {
  it('показывает Alert и ведёт на создание тега с returnTo при пустом списке', async () => {
    const user = userEvent.setup();
    const { dispatchSpy } = renderField({ options: [], listStatus: 'success' });

    expect(
      screen.getByText('Отсутствуют теги, необходимые для создания поста'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Создать' }));

    expect(dispatchSpy).toHaveBeenCalledWith(
      push(withReturnTo(PATHS.TAG_CREATE, '/posts/3/edit')),
    );
  });

  it('не показывает Alert во время загрузки', () => {
    renderField({ options: [], listStatus: 'loading' });

    expect(
      screen.queryByText('Отсутствуют теги, необходимые для создания поста'),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Теги/i })).toBeDisabled();
  });

  it('не показывает Alert, если есть опции', () => {
    renderField({
      options: [{ value: 2, label: 'Новости' }],
      listStatus: 'success',
    });

    expect(
      screen.queryByText('Отсутствуют теги, необходимые для создания поста'),
    ).not.toBeInTheDocument();
  });
});
