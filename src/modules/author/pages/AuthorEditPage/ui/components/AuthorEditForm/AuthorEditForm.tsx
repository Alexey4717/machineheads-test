import { AuthorForm } from '../../../../../features/AuthorForm/ui/AuthorForm';
import { useAuthorEditFormInitialValues } from '../../../lib/useAuthorEditFormInitialValues';

/** Форма редактирования: сама берёт id и initialValues из URL / store. */
export const AuthorEditForm = () => {
  const { authorId, initialValues } = useAuthorEditFormInitialValues();

  if (!initialValues) {
    return null;
  }

  return (
    <AuthorForm mode="edit" authorId={authorId} initialValues={initialValues} />
  );
};
