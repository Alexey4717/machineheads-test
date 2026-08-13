import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import { push } from 'connected-react-router';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

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

  return {
    dispatchSpy,
    ...componentRender(
      <Form>
        <PostFormAuthorField />
      </Form>,
      {
        store,
        dispatchSpy,
        initialEntries: ['/posts/new'],
      },
    ),
  };
}

describe('PostFormAuthorField', () => {
  it('показывает Alert и ведёт на создание автора с returnTo при пустом списке', async () => {
    const user = userEvent.setup();
    const { dispatchSpy } = renderField({ options: [], listStatus: 'success' });

    expect(
      screen.getByText('Отсутствуют авторы, необходимые для создания поста'),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('postForm_button_onCreateAuthor'));

    expect(dispatchSpy).toHaveBeenCalledWith(
      push(withReturnTo(PATHS.AUTHOR_CREATE, '/posts/new')),
    );
  });

  it('не показывает Alert во время загрузки', () => {
    renderField({ options: [], listStatus: 'loading' });

    expect(
      screen.queryByText('Отсутствуют авторы, необходимые для создания поста'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('postForm_select_authorId')).toHaveClass(
      'ant-select-disabled',
    );
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
