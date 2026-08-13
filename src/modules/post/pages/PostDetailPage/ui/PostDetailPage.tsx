import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getErrorMessage } from '@/core/api/errorParsers';
import { PATHS } from '@/core/config/router/paths';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { Page } from '@/core/ui/Page/Page';

import { postActions } from '../../../model/actions';
import {
  selectCurrentPost,
  selectPostDetailError,
  selectPostDetailStatus,
} from '../../../model/selectors';
import { getPostModule } from '../../../module';
import { PostDetailActions } from './components/PostDetailActions/PostDetailActions';
import { PostDetailDescriptions } from './components/PostDetailDescriptions/PostDetailDescriptions';
import { PostDetailPageSkeleton } from './components/PostDetailPageSkeleton/PostDetailPageSkeleton';
import { PostDetailRemoveError } from './components/PostDetailRemoveError/PostDetailRemoveError';

const PostDetailPageContent = () => {
  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const post = useSelector(selectCurrentPost);
  const detailStatus = useSelector(selectPostDetailStatus);
  const detailError = useSelector(selectPostDetailError);

  useEffect(() => {
    if (Number.isFinite(postId)) {
      dispatch(postActions.detailRequest(postId));
    }
  }, [dispatch, postId]);

  const isInvalidId = !Number.isFinite(postId);
  const hasPost = Boolean(post && post.id === postId && post.text != null);
  const isLoading =
    !isInvalidId &&
    (detailStatus === 'loading' || detailStatus === 'idle') &&
    !hasPost;

  const pageError = isInvalidId
    ? {
        status: 404 as const,
        title: 'Пост не найден',
        subtitle: 'Некорректный идентификатор',
      }
    : detailError
      ? {
          status: (detailError.kind === 'system' && detailError.status === 404
            ? 404
            : 'error') as 404 | 'error',
          title: 'Не удалось загрузить пост',
          subtitle: getErrorMessage(detailError),
        }
      : null;

  return (
    <Page
      title={post?.title ?? 'Пост'}
      backTo={PATHS.POSTS}
      loading={isLoading}
      skeleton={<PostDetailPageSkeleton />}
      error={pageError}
      actions={<PostDetailActions />}
    >
      <PostDetailRemoveError />
      <PostDetailDescriptions />
    </Page>
  );
};

const PostDetailPage = () => {
  return (
    <DynamicModuleLoader modules={[getPostModule()]}>
      <PostDetailPageContent />
    </DynamicModuleLoader>
  );
};

export default PostDetailPage;
