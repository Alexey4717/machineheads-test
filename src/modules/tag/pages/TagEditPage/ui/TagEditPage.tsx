import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { TagFormSkeleton } from '../../../features/TagForm/ui/components/TagFormSkeleton/TagFormSkeleton';
import { getTagModule } from '../../../module';
import { useTagEditPage } from '../lib/useTagEditPage';
import { TagEditForm } from './components/TagEditForm/TagEditForm';

const TagEditPageContent = () => {
  const { tagId, isLoading, pageError } = useTagEditPage();

  return (
    <Page
      title="Редактирование тега"
      backTo={
        Number.isFinite(tagId)
          ? getPath(PATHS.TAG_DETAIL, { id: tagId })
          : undefined
      }
      loading={isLoading}
      skeleton={<TagFormSkeleton />}
      error={pageError}
    >
      <TagEditForm />
    </Page>
  );
};

const TagEditPage = () => {
  return (
    <DynamicModuleLoader modules={[getTagModule()]}>
      <TagEditPageContent />
    </DynamicModuleLoader>
  );
};

export default TagEditPage;
