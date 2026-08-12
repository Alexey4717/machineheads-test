import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import { describe, expect, it, vi } from 'vitest';

import { Field } from './Field';

describe('Field', () => {
  it('прокидывает data-testid на интерактивный контрол', () => {
    render(
      <Form>
        <Field name="email" label="E-mail" testId="login-email" />
      </Form>,
    );

    expect(screen.getByTestId('login-email')).toBeInTheDocument();
  });

  it('в режиме без name работает controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Form layout="vertical" component="div">
        <Field
          label="Поиск"
          testId="search"
          aria-label="Поиск"
          value=""
          onChange={onChange}
        />
      </Form>,
    );

    await user.type(screen.getByTestId('search'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('type=password рендерит password input', () => {
    const { container } = render(
      <Form>
        <Field
          name="password"
          label="Пароль"
          type="password"
          testId="login-password"
        />
      </Form>,
    );

    const input = screen.getByTestId('login-password');
    expect(input).toHaveAttribute('type', 'password');
    expect(container.querySelector('input[type="password"]')).toBeTruthy();
  });
});
