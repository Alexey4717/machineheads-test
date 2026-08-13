import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { tagActions } from '../../../model/actions';
import { tagInitialState, tagReducer } from '../../../model/reducer';
import type { TagState } from '../../../model/types';
import { TagForm } from './TagForm';

vi.mock('./TagForm.styles', () => ({
  useStyles: () => ({
    styles: { form: 'form', sortInput: 'sortInput' },
  }),
}));

vi.mock('./components/TagFormSubmitError/TagFormSubmitError.styles', () => ({
  useStyles: () => ({
    styles: { alert: 'alert' },
  }),
}));

function renderTagForm(
  props: { mode: 'create' | 'edit'; tagId?: number } = { mode: 'create' },
  preloaded?: TagState,
  dispatchSpy?: (action: unknown) => void,
) {
  const initialTag = preloaded ?? tagInitialState;

  return componentRender(<TagForm {...props} />, {
    reducers: { tag: tagReducer },
    preloadedState: { tag: initialTag },
    dispatchSpy,
  });
}

describe('TagForm', () => {
  it('не диспатчит create при пустой форме', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    renderTagForm({ mode: 'create' }, undefined, dispatchSpy);

    const submit = screen.getByTestId('tagForm_button_submit');
    expect(submit).toHaveTextContent('Создать');
    await user.click(submit);

    await waitFor(() => {
      expect(screen.getByText('Укажите название')).toBeInTheDocument();
    });

    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'tag/CREATE_REQUEST' }),
    );
  });

  it('диспатчит createRequest с валидными значениями', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    renderTagForm({ mode: 'create' }, undefined, dispatchSpy);

    await user.type(screen.getByTestId('tagForm_input_name'), 'Новости');
    await user.type(screen.getByTestId('tagForm_input_code'), 'news');
    await user.type(screen.getByTestId('tagForm_input_sort'), '0');
    await user.click(screen.getByTestId('tagForm_button_submit'));

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        tagActions.createRequest({
          name: 'Новости',
          code: 'news',
          sort: 0,
        }),
      );
    });
  });

  it('поле sort пустое по умолчанию (не 0)', () => {
    renderTagForm({ mode: 'create' });

    const sortInput = screen.getByTestId('tagForm_input_sort');
    expect(sortInput).not.toHaveValue(0);
    expect(String((sortInput as HTMLInputElement).value)).toBe('');
  });

  it('показывает system error из store', () => {
    renderTagForm(
      { mode: 'create' },
      {
        ...tagInitialState,
        submitError: { kind: 'unknown', message: 'Сервер недоступен' },
      },
    );

    expect(screen.getByText('Сервер недоступен')).toBeInTheDocument();
  });
});
