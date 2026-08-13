import { Provider } from 'react-redux';

import { render, screen } from '@testing-library/react';
import { ConfigProvider, Form } from 'antd';
import { legacy_createStore as createStore } from 'redux';
import { describe, expect, it, vi } from 'vitest';

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

  const store = createStore(
    (
      state: { post: PostState } = { post: initialPost },
      action: { type: string },
    ) => ({
      post: postReducer(state.post, action),
    }),
  );

  return render(
    <Provider store={store}>
      <ConfigProvider>
        <Form>
          <PostFormSubmitError />
        </Form>
      </ConfigProvider>
    </Provider>,
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
});
