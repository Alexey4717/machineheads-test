import { Typography } from 'antd';

import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getTagModule } from '../../../module';

const TagEditPage = () => {
  return (
    <DynamicModuleLoader modules={[getTagModule()]}>
      <Page title="Редактирование тега">
        <Typography.Text>Редактирование тега</Typography.Text>
      </Page>
    </DynamicModuleLoader>
  );
};

export default TagEditPage;
