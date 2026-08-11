import { Typography } from 'antd';

import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getPostModule } from '../../module';

export default function PostCreatePage() {
  return (
    <DynamicModuleLoader modules={[getPostModule()]}>
      <Page title="Создание поста">
        <Typography.Text>Создание поста</Typography.Text>
      </Page>
    </DynamicModuleLoader>
  );
}
