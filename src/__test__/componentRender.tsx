/* eslint-disable react-refresh/only-export-components -- хелпер тестов: и провайдер, и render-функция */
import { type ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import {
  combineReducers,
  legacy_createStore as createStore,
  type ReducersMapObject,
  type Store,
} from 'redux';

export interface ComponentRenderOptions {
  route?: string;
  initialEntries?: string[];
  reducers?: ReducersMapObject;
  preloadedState?: object;
  store?: Store;
  dispatchSpy?: (action: unknown) => void;
}

interface TestProviderProps {
  children: ReactNode;
  options?: ComponentRenderOptions;
}

function createTestStore(options: ComponentRenderOptions): Store | undefined {
  let store = options.store;

  if (!store && options.reducers) {
    store = createStore(
      combineReducers(options.reducers),
      options.preloadedState as never,
    );
  }

  if (store && options.dispatchSpy) {
    const originalDispatch = store.dispatch.bind(store);
    const spy = options.dispatchSpy;
    store.dispatch = ((action: unknown) => {
      spy(action);
      return originalDispatch(action as never);
    }) as typeof store.dispatch;
  }

  return store;
}

export const TestProvider = ({ children, options = {} }: TestProviderProps) => {
  const [store] = useState(() => createTestStore(options));
  const initialEntries = options.initialEntries ?? [options.route ?? '/'];

  const content = (
    <ConfigProvider theme={{ token: { motion: false } }}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </ConfigProvider>
  );

  if (store) {
    return <Provider store={store}>{content}</Provider>;
  }

  return content;
};

export const componentRender = (
  component: ReactNode,
  options: ComponentRenderOptions = {},
) => render(<TestProvider options={options}>{component}</TestProvider>);
