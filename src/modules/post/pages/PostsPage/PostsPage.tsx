import { Typography } from 'antd';

import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getPostModule } from '../../module';

export default function PostsPage() {
  return (
    <DynamicModuleLoader modules={[getPostModule()]}>
      <Page title="Посты">
        <Typography.Text>Посты</Typography.Text>
      </Page>
    </DynamicModuleLoader>
  );
}
