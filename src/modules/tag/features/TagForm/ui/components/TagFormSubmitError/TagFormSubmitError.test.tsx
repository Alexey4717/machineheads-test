import { screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { TextField } from '@/core/ui/TextField/TextField';

import { tagInitialState, tagReducer } from '../../../../../model/reducer';
import type { TagState } from '../../../../../model/types';
import { TagFormSubmitError } from './TagFormSubmitError';

vi.mock('./TagFormSubmitError.styles', () => ({
  useStyles: () => ({
    styles: { alert: 'alert' },
  }),
}));

function renderWithStore(preloaded?: TagState) {
  const initialTag = preloaded ?? tagInitialState;

  return componentRender(
    <Form>
      <TagFormSubmitError />
      <TextField name="name" data-testid="tagForm_input_name" />
    </Form>,
    {
      reducers: { tag: tagReducer },
      preloadedState: { tag: initialTag },
    },
  );
}

describe('TagFormSubmitError', () => {
  it('ничего не рендерит без ошибки', () => {
    const { container } = renderWithStore();

    expect(container.querySelector('.ant-alert')).toBeNull();
  });

  it('показывает Alert для system/unknown ошибки', () => {
    renderWithStore({
      ...tagInitialState,
      submitError: { kind: 'unknown', message: 'Сервер недоступен' },
    });

    expect(screen.getByText('Сервер недоступен')).toBeInTheDocument();
  });

  it('не показывает Alert для validation и проставляет field errors', async () => {
    renderWithStore({
      ...tagInitialState,
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
