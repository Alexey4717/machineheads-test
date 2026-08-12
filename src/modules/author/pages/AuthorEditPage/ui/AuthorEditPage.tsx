import { Typography } from 'antd';

import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getAuthorModule } from '../../../module';

export default function AuthorEditPage() {
  return (
    <DynamicModuleLoader modules={[getAuthorModule()]}>
      <Page title="Редактирование автора">
        <Typography.Text>Редактирование автора</Typography.Text>
      </Page>
    </DynamicModuleLoader>
  );
}
