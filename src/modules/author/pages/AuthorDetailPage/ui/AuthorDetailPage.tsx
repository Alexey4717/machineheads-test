import { Typography } from 'antd';

import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getAuthorModule } from '../../../module';

const AuthorDetailPage = () => {
  return (
    <DynamicModuleLoader modules={[getAuthorModule()]}>
      <Page title="Автор">
        <Typography.Text>Автор</Typography.Text>
      </Page>
    </DynamicModuleLoader>
  );
};

export default AuthorDetailPage;
