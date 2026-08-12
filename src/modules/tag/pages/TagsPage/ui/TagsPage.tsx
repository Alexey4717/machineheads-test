import { Typography } from 'antd';

import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getTagModule } from '../../../module';

const TagsPage = () => {
  return (
    <DynamicModuleLoader modules={[getTagModule()]}>
      <Page title="Теги">
        <Typography.Text>Теги</Typography.Text>
      </Page>
    </DynamicModuleLoader>
  );
};

export default TagsPage;
