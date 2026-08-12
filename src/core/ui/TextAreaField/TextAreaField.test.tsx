import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import { describe, expect, it, vi } from 'vitest';

import { TextAreaField } from './TextAreaField';

describe('TextAreaField', () => {
  it('прокидывает data-testid на интерактивный контрол', () => {
    render(
      <Form>
        <TextAreaField
          name="description"
          label="Описание"
          testId="author-description"
        />
      </Form>,
    );

    expect(screen.getByTestId('author-description')).toBeInTheDocument();
  });

  it('в режиме без name работает controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Form layout="vertical" component="div">
        <TextAreaField
          label="Комментарий"
          testId="comment"
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
    render(
      <Form>
        <TextAreaField name="bio" label="Био" testId="bio" rows={5} />
      </Form>,
    );

    expect(screen.getByTestId('bio')).toHaveAttribute('rows', '5');
  });
});
