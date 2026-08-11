import { lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

const HomePage = lazy(() => import('@/pages/HomePage/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage/LoginPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage/NotFoundPage'));

export function AppRouter() {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}
