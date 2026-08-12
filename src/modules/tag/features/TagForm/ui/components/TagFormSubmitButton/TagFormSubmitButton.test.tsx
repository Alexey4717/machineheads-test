import { Provider } from 'react-redux';

import { render, screen } from '@testing-library/react';
import { ConfigProvider, Form } from 'antd';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it } from 'vitest';

import { tagInitialState, tagReducer } from '../../../../../model/reducer';
import type { TagState } from '../../../../../model/types';
import { TagFormSubmitButton } from './TagFormSubmitButton';

function renderButton(mode: 'create' | 'edit', preloaded?: TagState) {
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
          <TagFormSubmitButton mode={mode} />
        </Form>
      </ConfigProvider>
    </Provider>,
  );
}

describe('TagFormSubmitButton', () => {
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
      ...tagInitialState,
      submitStatus: 'loading',
    });

    expect(screen.getByRole('button', { name: /Создать/ })).toHaveClass(
      'ant-btn-loading',
    );
  });
});
