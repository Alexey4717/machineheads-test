import { screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { TextField } from '@/core/ui/TextField/TextField';

import { postInitialState, postReducer } from '../../../../../model/reducer';
import type { PostState } from '../../../../../model/types';
import { PostFormSubmitError } from './PostFormSubmitError';

vi.mock('./PostFormSubmitError.styles', () => ({
  useStyles: () => ({
    styles: { alert: 'alert' },
  }),
}));

function renderError(preloaded?: PostState) {
  const initialPost = preloaded ?? postInitialState;

  return componentRender(
    <Form>
      <PostFormSubmitError />
      <TextField name="title" data-testid="postForm_input_title" />
    </Form>,
    {
      reducers: { post: postReducer },
      preloadedState: { post: initialPost },
    },
  );
}

describe('PostFormSubmitError', () => {
  it('не рендерит Alert без ошибки', () => {
    const { container } = renderError();
    expect(container.querySelector('.ant-alert')).toBeNull();
  });

  it('показывает system/unknown ошибку', () => {
    renderError({
      ...postInitialState,
      submitError: { kind: 'unknown', message: 'Сервер недоступен' },
    });

    expect(screen.getByText('Сервер недоступен')).toBeInTheDocument();
  });

  it('не показывает Alert для validation', () => {
    const { container } = renderError({
      ...postInitialState,
      submitError: {
        kind: 'validation',
        status: 422,
        fields: [{ field: 'title', message: 'Занято' }],
      },
    });

    expect(container.querySelector('.ant-alert')).toBeNull();
  });

  it('для validation проставляет field errors', async () => {
    renderError({
      ...postInitialState,
      submitError: {
        kind: 'validation',
        status: 422,
        fields: [{ field: 'title', message: 'Занято' }],
      },
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Занято')).toBeInTheDocument();
    });
  });
});
