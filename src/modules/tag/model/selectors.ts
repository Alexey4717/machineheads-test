import type { Tag, TagOption, TagState } from './types';

interface StateWithTag {
  tag: TagState;
}

export const selectTagState = (state: StateWithTag) => state.tag;

export const selectTagEntities = (state: StateWithTag) => state.tag.entities;

export const selectTagListIds = (state: StateWithTag) => state.tag.listIds;

export const selectTagList = (state: StateWithTag): Tag[] =>
  state.tag.listIds
    .map((id) => state.tag.entities[id])
    .filter((tag): tag is Tag => Boolean(tag));

export const selectTagById =
  (id: number | null | undefined) =>
  (state: StateWithTag): Tag | undefined =>
    id == null ? undefined : state.tag.entities[id];

export const selectCurrentTag = (state: StateWithTag): Tag | undefined => {
  const id = state.tag.currentDetailId;
  return id == null ? undefined : state.tag.entities[id];
};

export const selectTagListStatus = (state: StateWithTag) =>
  state.tag.listStatus;

export const selectTagListError = (state: StateWithTag) => state.tag.listError;

export const selectTagDetailStatus = (state: StateWithTag) =>
  state.tag.detailStatus;

export const selectTagDetailError = (state: StateWithTag) =>
  state.tag.detailError;

export const selectTagSubmitStatus = (state: StateWithTag) =>
  state.tag.submitStatus;

export const selectTagSubmitError = (state: StateWithTag) =>
  state.tag.submitError;

export const selectTagRemoveStatus = (state: StateWithTag) =>
  state.tag.removeStatus;

export const selectTagRemoveError = (state: StateWithTag) =>
  state.tag.removeError;

export const selectTagIsSubmitting = (state: StateWithTag) =>
  state.tag.submitStatus === 'loading';

export const selectTagIsRemoving = (state: StateWithTag) =>
  state.tag.removeStatus === 'loading';

/** Опции для Select в PostForm: `{ value: id, label: name }`. */
export const selectTagOptions = (state: StateWithTag): TagOption[] =>
  selectTagList(state).map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));
