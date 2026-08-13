import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import { Button } from 'antd';

import { getErrorMessage } from '@/core/api/errorParsers';
import { PATHS } from '@/core/config/router/paths';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { Page } from '@/core/ui/Page/Page';

import { PostsList } from '../../../features/PostsList/ui/PostsList';
import { postActions } from '../../../model/actions';
import { parsePageFromSearch } from '../../../model/parsePageFromSearch';
import {
  selectPostListError,
  selectPostListIds,
  selectPostListStatus,
} from '../../../model/selectors';
import { getPostModule } from '../../../module';
import { PostsPageSkeleton } from './components/PostsPageSkeleton/PostsPageSkeleton';

const PostsPageContent = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const page = parsePageFromSearch(location.search);
  const listIds = useSelector(selectPostListIds);
  const listStatus = useSelector(selectPostListStatus);
  const listError = useSelector(selectPostListError);

  useEffect(() => {
    dispatch(postActions.listRequest());
  }, [dispatch, page]);

  const isLoading = listStatus === 'loading' && listIds.length === 0;

  return (
    <Page
      title="Посты"
      actions={
        <Link to={PATHS.POST_CREATE}>
          <Button type="primary">Создать пост</Button>
        </Link>
      }
      loading={isLoading}
      skeleton={<PostsPageSkeleton />}
      error={
        listError
          ? {
              status: 'error',
              title: 'Не удалось загрузить посты',
              subtitle: getErrorMessage(listError),
            }
          : null
      }
    >
      <PostsList />
    </Page>
  );
};

const PostsPage = () => {
  return (
    <DynamicModuleLoader modules={[getPostModule()]}>
      <PostsPageContent />
    </DynamicModuleLoader>
  );
};

export default PostsPage;
