import { TagForm } from '../../../../../features/TagForm/ui/TagForm';
import { useTagEditFormInitialValues } from '../../../lib/useTagEditFormInitialValues';

/** Форма редактирования: сама берёт id и initialValues из URL / store. */
export const TagEditForm = () => {
  const { tagId, initialValues } = useTagEditFormInitialValues();

  if (!initialValues) {
    return null;
  }

  return <TagForm mode="edit" tagId={tagId} initialValues={initialValues} />;
};
