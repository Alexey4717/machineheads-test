import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';

import { authorActions } from '../../../model/actions';
import {
  selectAuthorDetailError,
  selectAuthorDetailStatus,
  selectCurrentAuthor,
} from '../../../model/selectors';
import { getAuthorEditPageError } from './getAuthorEditPageError';

/** Загрузка автора по id из URL и состояние оболочки Page (loading / error). */
export function useAuthorEditPage() {
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

  return {
    authorId,
    isLoading,
    pageError: getAuthorEditPageError({ isInvalidId, detailError }),
  };
}
