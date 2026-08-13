import { screen } from '@testing-library/react';
import { Form } from 'antd';
import { describe, expect, it } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import {
  authorInitialState,
  authorReducer,
} from '../../../../../model/reducer';
import type { AuthorState } from '../../../../../model/types';
import { AuthorFormSubmitButton } from './AuthorFormSubmitButton';

function renderButton(mode: 'create' | 'edit', preloaded?: AuthorState) {
  const initialAuthor = preloaded ?? authorInitialState;

  return componentRender(
    <Form>
      <AuthorFormSubmitButton mode={mode} />
    </Form>,
    {
      reducers: { author: authorReducer },
      preloadedState: { author: initialAuthor },
    },
  );
}

describe('AuthorFormSubmitButton', () => {
  it('в create показывает «Создать»', () => {
    renderButton('create');

    expect(screen.getByTestId('authorForm_button_submit')).toHaveTextContent(
      'Создать',
    );
  });

  it('в edit показывает «Сохранить»', () => {
    renderButton('edit');

    expect(screen.getByTestId('authorForm_button_submit')).toHaveTextContent(
      'Сохранить',
    );
  });

  it('ставит loading при submitStatus=loading', () => {
    renderButton('create', {
      ...authorInitialState,
      submitStatus: 'loading',
    });

    expect(screen.getByTestId('authorForm_button_submit')).toHaveClass(
      'ant-btn-loading',
    );
  });
});
