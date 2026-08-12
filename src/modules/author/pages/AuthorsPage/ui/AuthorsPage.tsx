import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { Button } from 'antd';

import { getErrorMessage } from '@/core/api/errorParsers';
import { PATHS } from '@/core/config/router/paths';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { Page } from '@/core/ui/Page/Page';

import { AuthorsList } from '../../../features/AuthorsList/ui/AuthorsList';
import { authorActions } from '../../../model/actions';
import {
  selectAuthorListError,
  selectAuthorListIds,
  selectAuthorListStatus,
} from '../../../model/selectors';
import { getAuthorModule } from '../../../module';
import { AuthorsPageSkeleton } from './components/AuthorsPageSkeleton/AuthorsPageSkeleton';

const AuthorsPageContent = () => {
  const dispatch = useAppDispatch();
  const listIds = useSelector(selectAuthorListIds);
  const listStatus = useSelector(selectAuthorListStatus);
  const listError = useSelector(selectAuthorListError);

  useEffect(() => {
    dispatch(authorActions.listRequest());
  }, [dispatch]);

  const isLoading = listStatus === 'loading' && listIds.length === 0;

  return (
    <Page
      title="Авторы"
      actions={
        <Link to={PATHS.AUTHOR_CREATE}>
          <Button type="primary">Создать автора</Button>
        </Link>
      }
      loading={isLoading}
      skeleton={<AuthorsPageSkeleton />}
      error={
        listError
          ? {
              status: 'error',
              title: 'Не удалось загрузить авторов',
              subtitle: getErrorMessage(listError),
            }
          : null
      }
    >
      <AuthorsList />
    </Page>
  );
};

const AuthorsPage = () => {
  return (
    <DynamicModuleLoader modules={[getAuthorModule()]}>
      <AuthorsPageContent />
    </DynamicModuleLoader>
  );
};

export default AuthorsPage;
