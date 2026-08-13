import { PATHS } from '@/core/config/router/paths';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getAuthorModule } from '@/modules/author';
import { getTagModule } from '@/modules/tag';

import { PostForm } from '../../../features/PostForm/ui/PostForm';
import { getPostModule } from '../../../module';

const PostCreatePage = () => {
  return (
    <DynamicModuleLoader
      modules={[getPostModule(), getAuthorModule(), getTagModule()]}
    >
      <Page title="Создание поста" backTo={PATHS.POSTS}>
        <PostForm mode="create" />
      </Page>
    </DynamicModuleLoader>
  );
};

export default PostCreatePage;
