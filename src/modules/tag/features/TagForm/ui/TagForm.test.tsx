import { Provider } from 'react-redux';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigProvider } from 'antd';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it, vi } from 'vitest';

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

  const store = createStore(
    (
      state: { tag: TagState } = { tag: initialTag },
      action: { type: string },
    ) => ({
      tag: tagReducer(state.tag, action),
    }),
  );

  if (dispatchSpy) {
    const originalDispatch = store.dispatch.bind(store);
    store.dispatch = ((action: unknown) => {
      dispatchSpy(action as never);
      return originalDispatch(action as never);
    }) as typeof store.dispatch;
  }

  return render(
    <Provider store={store}>
      <ConfigProvider>
        <TagForm {...props} />
      </ConfigProvider>
    </Provider>,
  );
}

describe('TagForm', () => {
  it('не диспатчит create при пустой форме', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();
    renderTagForm({ mode: 'create' }, undefined, dispatchSpy);

    await user.click(screen.getByRole('button', { name: 'Создать' }));

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

    await user.type(screen.getByTestId('tag-name'), 'Новости');
    await user.type(screen.getByTestId('tag-code'), 'news');
    await user.type(screen.getByTestId('tag-sort'), '0');
    await user.click(screen.getByRole('button', { name: 'Создать' }));

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

    const sortInput = screen.getByTestId('tag-sort');
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
