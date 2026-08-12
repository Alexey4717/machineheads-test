import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { ConnectedRouter } from 'connected-react-router';

import { ConfirmModalProvider } from '@/core/ui/ConfirmModal/ConfirmModalProvider';

import { configureStore, history } from '../../store/configureStore';

const store = configureStore();

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ConfirmModalProvider>{children}</ConfirmModalProvider>
      </ConnectedRouter>
    </Provider>
  );
};
