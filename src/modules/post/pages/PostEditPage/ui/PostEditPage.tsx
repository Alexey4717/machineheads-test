import { Typography } from 'antd';

import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getPostModule } from '../../../module';

const PostEditPage = () => {
  return (
    <DynamicModuleLoader modules={[getPostModule()]}>
      <Page title="Редактирование поста">
        <Typography.Text>Редактирование поста</Typography.Text>
      </Page>
    </DynamicModuleLoader>
  );
};

export default PostEditPage;
