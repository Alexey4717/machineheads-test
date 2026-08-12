import { Typography } from 'antd';

import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getAuthorModule } from '../../../module';

const AuthorCreatePage = () => {
  return (
    <DynamicModuleLoader modules={[getAuthorModule()]}>
      <Page title="Создание автора">
        <Typography.Text>Создание автора</Typography.Text>
      </Page>
    </DynamicModuleLoader>
  );
};

export default AuthorCreatePage;
