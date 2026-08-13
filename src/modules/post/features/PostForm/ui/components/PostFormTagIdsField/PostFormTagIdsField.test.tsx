import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import { push } from 'connected-react-router';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

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

  return {
    dispatchSpy,
    ...componentRender(
      <Form>
        <PostFormTagIdsField />
      </Form>,
      {
        store,
        dispatchSpy,
        initialEntries: ['/posts/3/edit'],
      },
    ),
  };
}

describe('PostFormTagIdsField', () => {
  it('показывает Alert и ведёт на создание тега с returnTo при пустом списке', async () => {
    const user = userEvent.setup();
    const { dispatchSpy } = renderField({ options: [], listStatus: 'success' });

    expect(
      screen.getByText('Отсутствуют теги, необходимые для создания поста'),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('postForm_button_onCreateTag'));

    expect(dispatchSpy).toHaveBeenCalledWith(
      push(withReturnTo(PATHS.TAG_CREATE, '/posts/3/edit')),
    );
  });

  it('не показывает Alert во время загрузки', () => {
    renderField({ options: [], listStatus: 'loading' });

    expect(
      screen.queryByText('Отсутствуют теги, необходимые для создания поста'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('postForm_select_tagIds')).toHaveClass(
      'ant-select-disabled',
    );
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
