import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getErrorMessage } from '@/core/api/errorParsers';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { Page } from '@/core/ui/Page/Page';

import { authorActions } from '../../../model/actions';
import { formatAuthorName } from '../../../model/formatAuthorName';
import {
  selectAuthorDetailError,
  selectAuthorDetailStatus,
  selectCurrentAuthor,
} from '../../../model/selectors';
import { getAuthorModule } from '../../../module';
import { AuthorDetailActions } from './components/AuthorDetailActions/AuthorDetailActions';
import { AuthorDetailDescriptions } from './components/AuthorDetailDescriptions/AuthorDetailDescriptions';
import { AuthorDetailPageSkeleton } from './components/AuthorDetailPageSkeleton/AuthorDetailPageSkeleton';
import { AuthorDetailRemoveError } from './components/AuthorDetailRemoveError/AuthorDetailRemoveError';

const AuthorDetailPageContent = () => {
  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const authorId = Number(params.id);
  const author = useSelector(selectCurrentAuthor);
  const detailStatus = useSelector(selectAuthorDetailStatus);
  const detailError = useSelector(selectAuthorDetailError);

  useEffect(() => {
    if (Number.isFinite(authorId)) {
      dispatch(authorActions.detailRequest(authorId));
    }
  }, [dispatch, authorId]);

  const isInvalidId = !Number.isFinite(authorId);
  const hasAuthor = Boolean(author && author.id === authorId);
  const isLoading =
    !isInvalidId &&
    (detailStatus === 'loading' || detailStatus === 'idle') &&
    !hasAuthor;

  const pageError = isInvalidId
    ? {
        status: 404 as const,
        title: 'Автор не найден',
        subtitle: 'Некорректный идентификатор',
      }
    : detailError
      ? {
          status: (detailError.kind === 'system' && detailError.status === 404
            ? 404
            : 'error') as 404 | 'error',
          title: 'Не удалось загрузить автора',
          subtitle: getErrorMessage(detailError),
        }
      : null;

  return (
    <Page
      title={author ? formatAuthorName(author) : 'Автор'}
      loading={isLoading}
      skeleton={<AuthorDetailPageSkeleton />}
      error={pageError}
      actions={<AuthorDetailActions />}
    >
      <AuthorDetailRemoveError />
      <AuthorDetailDescriptions />
    </Page>
  );
};

const AuthorDetailPage = () => {
  return (
    <DynamicModuleLoader modules={[getAuthorModule()]}>
      <AuthorDetailPageContent />
    </DynamicModuleLoader>
  );
};

export default AuthorDetailPage;
