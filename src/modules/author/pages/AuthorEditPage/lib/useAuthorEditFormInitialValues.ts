import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import type { UploadFile } from 'antd/es/upload/interface';

import { selectCurrentAuthor } from '../../../model/selectors';
import type { AuthorFormValues } from '../../../model/types';

interface AuthorEditFormInitialValues {
  authorId: number;
  initialValues: Partial<AuthorFormValues> | undefined;
}

function toAvatarFileList(
  avatar: { id: number; name: string; url: string } | null | undefined,
): UploadFile[] {
  if (!avatar?.url) {
    return [];
  }

  return [
    {
      uid: String(avatar.id),
      name: avatar.name || 'avatar',
      status: 'done',
      url: avatar.url,
    },
  ];
}

/** id из URL и initialValues формы, только если current author совпадает с id. */
export function useAuthorEditFormInitialValues(): AuthorEditFormInitialValues {
  const params = useParams<{ id: string }>();
  const authorId = Number(params.id);
  const author = useSelector(selectCurrentAuthor);

  const initialValues = useMemo<Partial<AuthorFormValues> | undefined>(() => {
    if (!author || author.id !== authorId) {
      return undefined;
    }

    return {
      name: author.name,
      lastName: author.lastName,
      secondName: author.secondName,
      shortDescription: author.shortDescription ?? '',
      description: author.description ?? '',
      avatar: toAvatarFileList(author.avatar),
      removeAvatar: false,
    };
  }, [author, authorId]);

  return { authorId, initialValues };
}
