import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';

import { tagActions } from '../../../model/actions';
import {
  selectCurrentTag,
  selectTagDetailError,
  selectTagDetailStatus,
} from '../../../model/selectors';
import { getTagEditPageError } from './getTagEditPageError';

/** Загрузка тега по id из URL и состояние оболочки Page (loading / error). */
export function useTagEditPage() {
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

  return {
    tagId,
    isLoading,
    pageError: getTagEditPageError({ isInvalidId, detailError }),
  };
}
