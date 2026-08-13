import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import type { UploadFile } from 'antd/es/upload/interface';

import { selectCurrentPost } from '../../../model/selectors';
import type { PostFormValues } from '../../../model/types';

interface PostEditFormInitialValues {
  postId: number;
  initialValues: Partial<PostFormValues> | undefined;
}

function toPreviewFileList(
  preview: { id: number; name: string; url: string } | null | undefined,
): UploadFile[] {
  if (!preview?.url) {
    return [];
  }

  return [
    {
      uid: String(preview.id),
      name: preview.name || 'preview',
      status: 'done',
      url: preview.url,
    },
  ];
}

/** id из URL и initialValues формы, только если current post совпадает с id и есть detail. */
export function usePostEditFormInitialValues(): PostEditFormInitialValues {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const post = useSelector(selectCurrentPost);

  const initialValues = useMemo<Partial<PostFormValues> | undefined>(() => {
    if (!post || post.id !== postId || post.author == null) {
      return undefined;
    }

    return {
      title: post.title,
      code: post.code,
      authorId: post.author.id,
      tagIds: (post.tags ?? []).map((tag) => tag.id),
      text: post.text ?? '',
      previewPicture: toPreviewFileList(post.previewPicture),
    };
  }, [post, postId]);

  return { postId, initialValues };
}
