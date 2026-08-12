import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { selectCurrentTag } from '../../../model/selectors';
import type { TagFormValues } from '../../../model/types';

interface TagEditFormInitialValues {
  tagId: number;
  initialValues: Partial<TagFormValues> | undefined;
}

/** id из URL и initialValues формы, только если current tag совпадает с id. */
export function useTagEditFormInitialValues(): TagEditFormInitialValues {
  const params = useParams<{ id: string }>();
  const tagId = Number(params.id);
  const tag = useSelector(selectCurrentTag);

  const initialValues = useMemo<Partial<TagFormValues> | undefined>(() => {
    if (!tag || tag.id !== tagId) {
      return undefined;
    }

    return {
      name: tag.name,
      code: tag.code,
      sort: tag.sort,
    };
  }, [tag, tagId]);

  return { tagId, initialValues };
}
