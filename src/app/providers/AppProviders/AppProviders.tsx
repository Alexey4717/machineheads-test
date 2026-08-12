import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Provider } from 'react-redux';

import { Spin } from 'antd';
import { ConnectedRouter } from 'connected-react-router';

import { configureStore, history } from '../../store/configureStore';
import { useStyles } from './AppProviders.styles';

const store = configureStore();

function SuspenseFallback() {
  const { styles } = useStyles();

  return (
    <div className={styles.fallback}>
      <Spin size="large" />
    </div>
  );
}

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Suspense fallback={<SuspenseFallback />}>{children}</Suspense>
      </ConnectedRouter>
    </Provider>
  );
}
