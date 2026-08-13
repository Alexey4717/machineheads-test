import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { Page } from '@/core/ui/Page/Page';

import { getAuthorModule } from '@/modules/author';
import { getTagModule } from '@/modules/tag';

import { PostFormSkeleton } from '../../../features/PostForm/ui/components/PostFormSkeleton/PostFormSkeleton';
import { getPostModule } from '../../../module';
import { usePostEditPage } from '../lib/usePostEditPage';
import { PostEditForm } from './components/PostEditForm/PostEditForm';

const PostEditPageContent = () => {
  const { postId, isLoading, pageError } = usePostEditPage();

  return (
    <Page
      title="Редактирование поста"
      backTo={
        Number.isFinite(postId)
          ? getPath(PATHS.POST_DETAIL, { id: postId })
          : undefined
      }
      loading={isLoading}
      skeleton={<PostFormSkeleton />}
      error={pageError}
    >
      <PostEditForm />
    </Page>
  );
};

const PostEditPage = () => {
  return (
    <DynamicModuleLoader
      modules={[getPostModule(), getAuthorModule(), getTagModule()]}
    >
      <PostEditPageContent />
    </DynamicModuleLoader>
  );
};

export default PostEditPage;
