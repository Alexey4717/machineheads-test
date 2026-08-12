import { Typography } from 'antd';

import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getTagModule } from '../../../module';

const TagDetailPage = () => {
  return (
    <DynamicModuleLoader modules={[getTagModule()]}>
      <Page title="Тег">
        <Typography.Text>Тег</Typography.Text>
      </Page>
    </DynamicModuleLoader>
  );
};

export default TagDetailPage;
