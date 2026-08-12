import { PATHS } from '@/core/config/router/paths';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { TagForm } from '../../../features/TagForm/ui/TagForm';
import { getTagModule } from '../../../module';

const TagCreatePage = () => {
  return (
    <DynamicModuleLoader modules={[getTagModule()]}>
      <Page title="Создание тега" backTo={PATHS.TAGS}>
        <TagForm mode="create" />
      </Page>
    </DynamicModuleLoader>
  );
};

export default TagCreatePage;
