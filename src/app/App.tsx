import { AppProviders } from './providers/AppProviders/AppProviders';
import { AppRouter } from './router/AppRouter';

export const App = () => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
);
