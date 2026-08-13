import { useLocation } from 'react-router-dom';

import { PATHS } from '@/core/config/router/paths';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { parseReturnTo } from '@/core/lib/router/parseReturnTo';
import { Page } from '@/core/ui/Page/Page';

import { AuthorForm } from '../../../features/AuthorForm/ui/AuthorForm';
import { getAuthorModule } from '../../../module';

const AuthorCreatePage = () => {
  const { search } = useLocation();
  const returnTo = parseReturnTo(search);

  return (
    <DynamicModuleLoader modules={[getAuthorModule()]}>
      <Page title="Создание автора" backTo={returnTo ?? PATHS.AUTHORS}>
        <AuthorForm mode="create" />
      </Page>
    </DynamicModuleLoader>
  );
};

export default AuthorCreatePage;
