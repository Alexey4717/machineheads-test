import { Route, Switch } from 'react-router-dom';

import type { ThemeMode } from '@/core/ui/ThemeSwitch/ThemeSwitch';

import { AdminLayout } from '../layouts/AdminLayout/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout/AuthLayout';
import { RequireAuth, RequireGuest } from './guards';
import { type AppRouteProps, routeConfig } from './routeConfig';

interface AppRouterProps {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
}

function renderRouteContent(
  route: AppRouteProps,
  themeMode: ThemeMode,
  onThemeChange: (mode: ThemeMode) => void,
) {
  const Element = route.element;
  let content = <Element />;

  if (route.layout === 'admin') {
    content = (
      <AdminLayout themeMode={themeMode} onThemeChange={onThemeChange}>
        {content}
      </AdminLayout>
    );
  }

  if (route.layout === 'auth') {
    content = <AuthLayout>{content}</AuthLayout>;
  }

  if (route.authOnly) {
    content = <RequireAuth>{content}</RequireAuth>;
  }

  if (route.guestOnly) {
    content = <RequireGuest>{content}</RequireGuest>;
  }

  return content;
}

export function AppRouter({ themeMode, onThemeChange }: AppRouterProps) {
  const matchedRoutes = Object.entries(routeConfig).filter(
    ([key]) => key !== 'notFound',
  );
  const notFoundRoute = routeConfig.notFound;

  return (
    <Switch>
      {matchedRoutes.map(([key, route]) => (
        <Route
          key={key}
          path={route.path}
          exact={route.exact}
          render={() => renderRouteContent(route, themeMode, onThemeChange)}
        />
      ))}
      <Route
        render={() =>
          renderRouteContent(notFoundRoute, themeMode, onThemeChange)
        }
      />
    </Switch>
  );
}
