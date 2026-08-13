import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { App as AntApp } from 'antd';
import { ConnectedRouter } from 'connected-react-router';

import { appMessageConfig } from '@/core/lib/message/appMessageConfig';
import { AppMessageHolder } from '@/core/lib/message/AppMessageHolder';
import { ConfirmModalProvider } from '@/core/ui/ConfirmModal/ConfirmModalProvider';

import { configureStore, history } from '../../store/configureStore';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';

const store = configureStore();

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ThemeProvider>
          <AntApp component={false} message={appMessageConfig}>
            <AppMessageHolder />
            <ConfirmModalProvider>{children}</ConfirmModalProvider>
          </AntApp>
        </ThemeProvider>
      </ConnectedRouter>
    </Provider>
  );
};
