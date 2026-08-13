import { Route, Switch } from 'react-router-dom';

import { AdminLayout } from '../layouts/AdminLayout/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout/AuthLayout';
import { RequireAuth, RequireGuest } from './guards';
import { type AppRouteProps, routeConfig } from './routeConfig';

function renderRouteContent(route: AppRouteProps) {
  const Element = route.element;
  let content = <Element />;

  if (route.layout === 'admin') {
    content = <AdminLayout>{content}</AdminLayout>;
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

export const AppRouter = () => {
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
          render={() => renderRouteContent(route)}
        />
      ))}
      <Route render={() => renderRouteContent(notFoundRoute)} />
    </Switch>
  );
};
