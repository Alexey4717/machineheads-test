import { PostForm } from '../../../../../features/PostForm/ui/PostForm';
import { usePostEditFormInitialValues } from '../../../lib/usePostEditFormInitialValues';

/** Форма редактирования: сама берёт id и initialValues из URL / store. */
export const PostEditForm = () => {
  const { postId, initialValues } = usePostEditFormInitialValues();

  if (!initialValues) {
    return null;
  }

  return <PostForm mode="edit" postId={postId} initialValues={initialValues} />;
};
