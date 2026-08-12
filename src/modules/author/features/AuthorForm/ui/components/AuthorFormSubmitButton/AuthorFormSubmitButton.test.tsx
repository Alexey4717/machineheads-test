import { Provider } from 'react-redux';

import { render, screen } from '@testing-library/react';
import { ConfigProvider, Form } from 'antd';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it } from 'vitest';

import {
  authorInitialState,
  authorReducer,
} from '../../../../../model/reducer';
import type { AuthorState } from '../../../../../model/types';
import { AuthorFormSubmitButton } from './AuthorFormSubmitButton';

function renderButton(mode: 'create' | 'edit', preloaded?: AuthorState) {
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
          <AuthorFormSubmitButton mode={mode} />
        </Form>
      </ConfigProvider>
    </Provider>,
  );
}

describe('AuthorFormSubmitButton', () => {
  it('в create показывает «Создать»', () => {
    renderButton('create');

    expect(screen.getByRole('button', { name: 'Создать' })).toBeInTheDocument();
  });

  it('в edit показывает «Сохранить»', () => {
    renderButton('edit');

    expect(
      screen.getByRole('button', { name: 'Сохранить' }),
    ).toBeInTheDocument();
  });

  it('ставит loading при submitStatus=loading', () => {
    renderButton('create', {
      ...authorInitialState,
      submitStatus: 'loading',
    });

    expect(screen.getByRole('button', { name: /Создать/ })).toHaveClass(
      'ant-btn-loading',
    );
  });
});
