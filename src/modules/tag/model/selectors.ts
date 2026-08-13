import { createSelector } from 'reselect';

import type { Tag, TagOption } from './types';

export const selectTagState = (state: RootState) => state.tag;

export const selectTagEntities = createSelector(
  selectTagState,
  (tag) => tag.entities,
);

export const selectTagListIds = createSelector(
  selectTagState,
  (tag) => tag.listIds,
);

export const selectTagList = createSelector(
  [selectTagListIds, selectTagEntities],
  (listIds, entities): Tag[] =>
    listIds.map((id) => entities[id]).filter((tag): tag is Tag => Boolean(tag)),
);

export const selectTagById = (id: number | null | undefined) =>
  createSelector(selectTagEntities, (entities): Tag | undefined =>
    id == null ? undefined : entities[id],
  );

export const selectCurrentTag = createSelector(
  selectTagState,
  (tag): Tag | undefined => {
    const id = tag.currentDetailId;
    return id == null ? undefined : tag.entities[id];
  },
);

export const selectTagListStatus = createSelector(
  selectTagState,
  (tag) => tag.listStatus,
);

export const selectTagListError = createSelector(
  selectTagState,
  (tag) => tag.listError,
);

export const selectTagDetailStatus = createSelector(
  selectTagState,
  (tag) => tag.detailStatus,
);

export const selectTagDetailError = createSelector(
  selectTagState,
  (tag) => tag.detailError,
);

export const selectTagSubmitStatus = createSelector(
  selectTagState,
  (tag) => tag.submitStatus,
);

export const selectTagSubmitError = createSelector(
  selectTagState,
  (tag) => tag.submitError,
);

export const selectTagRemoveStatus = createSelector(
  selectTagState,
  (tag) => tag.removeStatus,
);

export const selectTagRemoveError = createSelector(
  selectTagState,
  (tag) => tag.removeError,
);

export const selectTagIsSubmitting = createSelector(
  selectTagSubmitStatus,
  (submitStatus) => submitStatus === 'loading',
);

export const selectTagIsRemoving = createSelector(
  selectTagRemoveStatus,
  (removeStatus) => removeStatus === 'loading',
);

/** Опции для Select в PostForm: `{ value: id, label: name }`. */
export const selectTagOptions = createSelector(
  selectTagList,
  (tags): TagOption[] =>
    tags.map((tag) => ({ value: tag.id, label: tag.name })),
);
