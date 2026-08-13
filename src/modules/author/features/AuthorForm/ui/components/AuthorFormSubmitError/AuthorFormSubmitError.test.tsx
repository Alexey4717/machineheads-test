import { screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { TextField } from '@/core/ui/TextField/TextField';

import {
  authorInitialState,
  authorReducer,
} from '../../../../../model/reducer';
import type { AuthorState } from '../../../../../model/types';
import { AuthorFormSubmitError } from './AuthorFormSubmitError';

vi.mock('./AuthorFormSubmitError.styles', () => ({
  useStyles: () => ({
    styles: { alert: 'alert' },
  }),
}));

function renderWithStore(preloaded?: AuthorState) {
  const initialAuthor = preloaded ?? authorInitialState;

  return componentRender(
    <Form>
      <AuthorFormSubmitError />
      <TextField name="name" data-testid="authorForm_input_name" />
    </Form>,
    {
      reducers: { author: authorReducer },
      preloadedState: { author: initialAuthor },
    },
  );
}

describe('AuthorFormSubmitError', () => {
  it('ничего не рендерит без ошибки', () => {
    const { container } = renderWithStore();

    expect(container.querySelector('.ant-alert')).toBeNull();
  });

  it('показывает Alert для system/unknown ошибки', () => {
    renderWithStore({
      ...authorInitialState,
      submitError: { kind: 'unknown', message: 'Сервер недоступен' },
    });

    expect(screen.getByText('Сервер недоступен')).toBeInTheDocument();
  });

  it('не показывает Alert для validation и проставляет field errors', async () => {
    renderWithStore({
      ...authorInitialState,
      submitError: {
        kind: 'validation',
        status: 422,
        fields: [{ field: 'name', message: 'Уже занято' }],
      },
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Уже занято')).toBeInTheDocument();
    });
  });
});
