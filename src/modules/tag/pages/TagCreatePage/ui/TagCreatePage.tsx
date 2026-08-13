import { useLocation } from 'react-router-dom';

import { PATHS } from '@/core/config/router/paths';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { parseReturnTo } from '@/core/lib/router/parseReturnTo';
import { Page } from '@/core/ui/Page/Page';

import { TagForm } from '../../../features/TagForm/ui/TagForm';
import { getTagModule } from '../../../module';

const TagCreatePage = () => {
  const { search } = useLocation();
  const returnTo = parseReturnTo(search);

  return (
    <DynamicModuleLoader modules={[getTagModule()]}>
      <Page title="Создание тега" backTo={returnTo ?? PATHS.TAGS}>
        <TagForm mode="create" />
      </Page>
    </DynamicModuleLoader>
  );
};

export default TagCreatePage;
