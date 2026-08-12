import { formatAuthorName } from './formatAuthorName';
import type { Author, AuthorOption, AuthorState } from './types';

interface StateWithAuthor {
  author: AuthorState;
}

export const selectAuthorState = (state: StateWithAuthor) => state.author;

export const selectAuthorEntities = (state: StateWithAuthor) =>
  state.author.entities;

export const selectAuthorListIds = (state: StateWithAuthor) =>
  state.author.listIds;

export const selectAuthorList = (state: StateWithAuthor): Author[] =>
  state.author.listIds
    .map((id) => state.author.entities[id])
    .filter((author): author is Author => Boolean(author));

export const selectAuthorById =
  (id: number | null | undefined) =>
  (state: StateWithAuthor): Author | undefined =>
    id == null ? undefined : state.author.entities[id];

export const selectCurrentAuthor = (
  state: StateWithAuthor,
): Author | undefined => {
  const id = state.author.currentDetailId;
  return id == null ? undefined : state.author.entities[id];
};

export const selectAuthorListStatus = (state: StateWithAuthor) =>
  state.author.listStatus;

export const selectAuthorListError = (state: StateWithAuthor) =>
  state.author.listError;

export const selectAuthorDetailStatus = (state: StateWithAuthor) =>
  state.author.detailStatus;

export const selectAuthorDetailError = (state: StateWithAuthor) =>
  state.author.detailError;

export const selectAuthorSubmitStatus = (state: StateWithAuthor) =>
  state.author.submitStatus;

export const selectAuthorSubmitError = (state: StateWithAuthor) =>
  state.author.submitError;

export const selectAuthorRemoveStatus = (state: StateWithAuthor) =>
  state.author.removeStatus;

export const selectAuthorRemoveError = (state: StateWithAuthor) =>
  state.author.removeError;

export const selectAuthorIsSubmitting = (state: StateWithAuthor) =>
  state.author.submitStatus === 'loading';

export const selectAuthorIsRemoving = (state: StateWithAuthor) =>
  state.author.removeStatus === 'loading';

/** Опции для Select в PostForm: `{ value: id, label: ФИО }`. */
export const selectAuthorOptions = (state: StateWithAuthor): AuthorOption[] =>
  selectAuthorList(state).map((author) => ({
    value: author.id,
    label: formatAuthorName(author),
  }));
