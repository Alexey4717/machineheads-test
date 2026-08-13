import { Provider } from 'react-redux';

import { render, screen } from '@testing-library/react';
import { ConfigProvider, Form } from 'antd';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it } from 'vitest';

import { postInitialState, postReducer } from '../../../../../model/reducer';
import type { PostState } from '../../../../../model/types';
import { PostFormSubmitButton } from './PostFormSubmitButton';

function renderButton(mode: 'create' | 'edit', preloaded?: PostState) {
  const initialPost = preloaded ?? postInitialState;

  const store = createStore(
    (
      state: { post: PostState } = { post: initialPost },
      action: { type: string },
    ) => ({
      post: postReducer(state.post, action),
    }),
  );

  return render(
    <Provider store={store}>
      <ConfigProvider>
        <Form>
          <PostFormSubmitButton mode={mode} />
        </Form>
      </ConfigProvider>
    </Provider>,
  );
}

describe('PostFormSubmitButton', () => {
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
      ...postInitialState,
      submitStatus: 'loading',
    });

    expect(screen.getByRole('button', { name: /Создать/ })).toHaveClass(
      'ant-btn-loading',
    );
  });
});
