import { PATHS } from '@/core/config/router/paths';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { AuthorForm } from '../../../features/AuthorForm/ui/AuthorForm';
import { getAuthorModule } from '../../../module';

const AuthorCreatePage = () => {
  return (
    <DynamicModuleLoader modules={[getAuthorModule()]}>
      <Page title="Создание автора" backTo={PATHS.AUTHORS}>
        <AuthorForm mode="create" />
      </Page>
    </DynamicModuleLoader>
  );
};

export default AuthorCreatePage;
