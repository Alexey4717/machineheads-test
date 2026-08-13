import { screen } from '@testing-library/react';
import { Form } from 'antd';
import { describe, expect, it } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { postInitialState, postReducer } from '../../../../../model/reducer';
import type { PostState } from '../../../../../model/types';
import { PostFormSubmitButton } from './PostFormSubmitButton';

function renderButton(mode: 'create' | 'edit', preloaded?: PostState) {
  const initialPost = preloaded ?? postInitialState;

  return componentRender(
    <Form>
      <PostFormSubmitButton mode={mode} />
    </Form>,
    {
      reducers: { post: postReducer },
      preloadedState: { post: initialPost },
    },
  );
}

describe('PostFormSubmitButton', () => {
  it('в create показывает «Создать»', () => {
    renderButton('create');

    expect(screen.getByTestId('postForm_button_submit')).toHaveTextContent(
      'Создать',
    );
  });

  it('в edit показывает «Сохранить»', () => {
    renderButton('edit');

    expect(screen.getByTestId('postForm_button_submit')).toHaveTextContent(
      'Сохранить',
    );
  });

  it('ставит loading при submitStatus=loading', () => {
    renderButton('create', {
      ...postInitialState,
      submitStatus: 'loading',
    });

    expect(screen.getByTestId('postForm_button_submit')).toHaveClass(
      'ant-btn-loading',
    );
  });
});
