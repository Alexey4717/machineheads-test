import { ConnectedRouter } from 'connected-react-router';
import { Spin } from 'antd';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Provider } from 'react-redux';

import { configureStore, history } from '@/app/store/configureStore';

const store = configureStore();

const suspenseFallback = (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    }}
  >
    <Spin size="large" />
  </div>
);

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Suspense fallback={suspenseFallback}>{children}</Suspense>
      </ConnectedRouter>
    </Provider>
  );
}
