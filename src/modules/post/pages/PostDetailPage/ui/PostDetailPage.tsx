import { Typography } from 'antd';

import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getPostModule } from '../../../module';

const PostDetailPage = () => {
  return (
    <DynamicModuleLoader modules={[getPostModule()]}>
      <Page title="Пост">
        <Typography.Text>Пост</Typography.Text>
      </Page>
    </DynamicModuleLoader>
  );
};

export default PostDetailPage;
