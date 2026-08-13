import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { TextAreaField } from './TextAreaField';

describe('TextAreaField', () => {
  it('прокидывает data-testid на интерактивный контрол', () => {
    componentRender(
      <Form>
        <TextAreaField
          name="description"
          label="Описание"
          data-testid="authorForm_input_description"
        />
      </Form>,
    );

    expect(
      screen.getByTestId('authorForm_input_description'),
    ).toBeInTheDocument();
  });

  it('в режиме без name работает controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    componentRender(
      <Form layout="vertical" component="div">
        <TextAreaField
          label="Комментарий"
          data-testid="comment"
          aria-label="Комментарий"
          value=""
          onChange={onChange}
        />
      </Form>,
    );

    await user.type(screen.getByTestId('comment'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('прокидывает rows на textarea', () => {
    componentRender(
      <Form>
        <TextAreaField name="bio" label="Био" data-testid="bio" rows={5} />
      </Form>,
    );

    expect(screen.getByTestId('bio')).toHaveAttribute('rows', '5');
  });
});
