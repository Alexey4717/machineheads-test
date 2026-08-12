import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { PATHS } from '@/core/config/router/paths';

import { selectIsAuthenticated } from '@/modules/auth';

interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Redirect to={PATHS.LOGIN} />;
  }

  return <>{children}</>;
};

interface RequireGuestProps {
  children: ReactNode;
}

export const RequireGuest = ({ children }: RequireGuestProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Redirect to={PATHS.POSTS} />;
  }

  return <>{children}</>;
};
