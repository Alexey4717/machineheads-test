import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { AuthorFormSkeleton } from '../../../features/AuthorForm/ui/components/AuthorFormSkeleton/AuthorFormSkeleton';
import { getAuthorModule } from '../../../module';
import { useAuthorEditPage } from '../lib/useAuthorEditPage';
import { AuthorEditForm } from './components/AuthorEditForm/AuthorEditForm';

const AuthorEditPageContent = () => {
  const { authorId, isLoading, pageError } = useAuthorEditPage();

  return (
    <Page
      title="Редактирование автора"
      backTo={
        Number.isFinite(authorId)
          ? getPath(PATHS.AUTHOR_DETAIL, { id: authorId })
          : undefined
      }
      loading={isLoading}
      skeleton={<AuthorFormSkeleton />}
      error={pageError}
    >
      <AuthorEditForm />
    </Page>
  );
};

const AuthorEditPage = () => {
  return (
    <DynamicModuleLoader modules={[getAuthorModule()]}>
      <AuthorEditPageContent />
    </DynamicModuleLoader>
  );
};

export default AuthorEditPage;
