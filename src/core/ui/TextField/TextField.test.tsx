import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { TextField } from './TextField';

describe('TextField', () => {
  it('прокидывает data-testid на интерактивный контрол', () => {
    componentRender(
      <Form>
        <TextField
          name="email"
          label="E-mail"
          data-testid="loginForm_input_email"
        />
      </Form>,
    );

    expect(screen.getByTestId('loginForm_input_email')).toBeInTheDocument();
  });

  it('в режиме без name работает controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    componentRender(
      <Form layout="vertical" component="div">
        <TextField
          label="Поиск"
          data-testid="search"
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
    const { container } = componentRender(
      <Form>
        <TextField
          name="password"
          label="Пароль"
          type="password"
          data-testid="loginForm_input_password"
        />
      </Form>,
    );

    const input = screen.getByTestId('loginForm_input_password');
    expect(input).toHaveAttribute('type', 'password');
    expect(container.querySelector('input[type="password"]')).toBeTruthy();
  });
});
