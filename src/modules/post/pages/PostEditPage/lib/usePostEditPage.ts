import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';

import { postActions } from '../../../model/actions';
import {
  selectCurrentPost,
  selectPostDetailError,
  selectPostDetailStatus,
} from '../../../model/selectors';
import { getPostEditPageError } from './getPostEditPageError';

/** Загрузка поста по id из URL и состояние оболочки Page (loading / error). */
export function usePostEditPage() {
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
  const hasPost = Boolean(post && post.id === postId && post.author != null);
  const isLoading =
    !isInvalidId &&
    (detailStatus === 'loading' || detailStatus === 'idle') &&
    !hasPost;

  return {
    postId,
    isLoading,
    pageError: getPostEditPageError({ isInvalidId, detailError }),
  };
}
