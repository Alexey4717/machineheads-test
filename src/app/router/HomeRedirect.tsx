import { Redirect } from 'react-router-dom';

import { PATHS } from '@/core/config/router/paths';

export function HomeRedirect() {
  return <Redirect to={PATHS.POSTS} />;
}
