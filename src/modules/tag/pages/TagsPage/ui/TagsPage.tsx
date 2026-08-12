import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Button } from 'antd';

import { getErrorMessage } from '@/core/api/errorParsers';
import { PATHS } from '@/core/config/router/paths';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { Page } from '@/core/ui/Page/Page';

import { TagsList } from '../../../features/TagsList/ui/TagsList';
import { tagActions } from '../../../model/actions';
import {
  selectTagListError,
  selectTagListIds,
  selectTagListStatus,
} from '../../../model/selectors';
import { getTagModule } from '../../../module';
import { TagsPageSkeleton } from './components/TagsPageSkeleton/TagsPageSkeleton';

const TagsPageContent = () => {
  const dispatch = useAppDispatch();
  const listIds = useSelector(selectTagListIds);
  const listStatus = useSelector(selectTagListStatus);
  const listError = useSelector(selectTagListError);

  useEffect(() => {
    dispatch(tagActions.listRequest());
  }, [dispatch]);

  const isLoading = listStatus === 'loading' && listIds.length === 0;

  return (
    <Page
      title="Теги"
      actions={
        <Link to={PATHS.TAG_CREATE}>
          <Button type="primary">Создать тег</Button>
        </Link>
      }
      loading={isLoading}
      skeleton={<TagsPageSkeleton />}
      error={
        listError
          ? {
              status: 'error',
              title: 'Не удалось загрузить теги',
              subtitle: getErrorMessage(listError),
            }
          : null
      }
    >
      <TagsList />
    </Page>
  );
};

const TagsPage = () => {
  return (
    <DynamicModuleLoader modules={[getTagModule()]}>
      <TagsPageContent />
    </DynamicModuleLoader>
  );
};

export default TagsPage;
