import { Typography } from 'antd';

import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getTagModule } from '../../module';

export default function TagCreatePage() {
  return (
    <DynamicModuleLoader modules={[getTagModule()]}>
      <Page title="Создание тега">
        <Typography.Text>Создание тега</Typography.Text>
      </Page>
    </DynamicModuleLoader>
  );
}
