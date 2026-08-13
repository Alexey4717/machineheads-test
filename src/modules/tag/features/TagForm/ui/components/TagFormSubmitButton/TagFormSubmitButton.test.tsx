import { screen } from '@testing-library/react';
import { Form } from 'antd';
import { describe, expect, it } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { tagInitialState, tagReducer } from '../../../../../model/reducer';
import type { TagState } from '../../../../../model/types';
import { TagFormSubmitButton } from './TagFormSubmitButton';

function renderButton(mode: 'create' | 'edit', preloaded?: TagState) {
  const initialTag = preloaded ?? tagInitialState;

  return componentRender(
    <Form>
      <TagFormSubmitButton mode={mode} />
    </Form>,
    {
      reducers: { tag: tagReducer },
      preloadedState: { tag: initialTag },
    },
  );
}

describe('TagFormSubmitButton', () => {
  it('в create показывает «Создать»', () => {
    renderButton('create');

    expect(screen.getByTestId('tagForm_button_submit')).toHaveTextContent(
      'Создать',
    );
  });

  it('в edit показывает «Сохранить»', () => {
    renderButton('edit');

    expect(screen.getByTestId('tagForm_button_submit')).toHaveTextContent(
      'Сохранить',
    );
  });

  it('ставит loading при submitStatus=loading', () => {
    renderButton('create', {
      ...tagInitialState,
      submitStatus: 'loading',
    });

    expect(screen.getByTestId('tagForm_button_submit')).toHaveClass(
      'ant-btn-loading',
    );
  });
});
