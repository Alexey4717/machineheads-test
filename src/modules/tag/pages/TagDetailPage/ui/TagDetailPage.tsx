import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getErrorMessage } from '@/core/api/errorParsers';
import { DynamicModuleLoader } from '@/core/lib/DynamicModuleLoader';
import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { Page } from '@/core/ui/Page/Page';

import { tagActions } from '../../../model/actions';
import {
  selectCurrentTag,
  selectTagDetailError,
  selectTagDetailStatus,
} from '../../../model/selectors';
import { getTagModule } from '../../../module';
import { TagDetailActions } from './components/TagDetailActions/TagDetailActions';
import { TagDetailDescriptions } from './components/TagDetailDescriptions/TagDetailDescriptions';
import { TagDetailPageSkeleton } from './components/TagDetailPageSkeleton/TagDetailPageSkeleton';
import { TagDetailRemoveError } from './components/TagDetailRemoveError/TagDetailRemoveError';

const TagDetailPageContent = () => {
  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();
  const tagId = Number(params.id);
  const tag = useSelector(selectCurrentTag);
  const detailStatus = useSelector(selectTagDetailStatus);
  const detailError = useSelector(selectTagDetailError);

  useEffect(() => {
    if (Number.isFinite(tagId)) {
      dispatch(tagActions.detailRequest(tagId));
    }
  }, [dispatch, tagId]);

  const isInvalidId = !Number.isFinite(tagId);
  const hasTag = Boolean(tag && tag.id === tagId);
  const isLoading =
    !isInvalidId &&
    (detailStatus === 'loading' || detailStatus === 'idle') &&
    !hasTag;

  const pageError = isInvalidId
    ? {
        status: 404 as const,
        title: 'Тег не найден',
        subtitle: 'Некорректный идентификатор',
      }
    : detailError
      ? {
          status: (detailError.kind === 'system' && detailError.status === 404
            ? 404
            : 'error') as 404 | 'error',
          title: 'Не удалось загрузить тег',
          subtitle: getErrorMessage(detailError),
        }
      : null;

  return (
    <Page
      title={tag?.name ?? 'Тег'}
      loading={isLoading}
      skeleton={<TagDetailPageSkeleton />}
      error={pageError}
      actions={<TagDetailActions />}
    >
      <TagDetailRemoveError />
      <TagDetailDescriptions />
    </Page>
  );
};

const TagDetailPage = () => {
  return (
    <DynamicModuleLoader modules={[getTagModule()]}>
      <TagDetailPageContent />
    </DynamicModuleLoader>
  );
};

export default TagDetailPage;
