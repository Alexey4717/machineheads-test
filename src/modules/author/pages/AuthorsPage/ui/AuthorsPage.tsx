import { Typography } from 'antd';

import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getAuthorModule } from '../../../module';

const AuthorsPage = () => {
  return (
    <DynamicModuleLoader modules={[getAuthorModule()]}>
      <Page title="Авторы">
        <Typography.Text>Авторы</Typography.Text>
      </Page>
    </DynamicModuleLoader>
  );
};

export default AuthorsPage;
