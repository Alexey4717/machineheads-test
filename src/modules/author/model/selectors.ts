import { createSelector } from 'reselect';

import { formatAuthorName } from './formatAuthorName';
import type { Author, AuthorOption } from './types';

export const selectAuthorState = (state: RootState) => state.author;

export const selectAuthorEntities = createSelector(
  selectAuthorState,
  (author) => author.entities,
);

export const selectAuthorListIds = createSelector(
  selectAuthorState,
  (author) => author.listIds,
);

export const selectAuthorList = createSelector(
  [selectAuthorListIds, selectAuthorEntities],
  (listIds, entities): Author[] =>
    listIds
      .map((id) => entities[id])
      .filter((author): author is Author => Boolean(author)),
);

export const selectAuthorById = (id: number | null | undefined) =>
  createSelector(selectAuthorEntities, (entities): Author | undefined =>
    id == null ? undefined : entities[id],
  );

export const selectCurrentAuthor = createSelector(
  selectAuthorState,
  (author): Author | undefined => {
    const id = author.currentDetailId;
    return id == null ? undefined : author.entities[id];
  },
);

export const selectAuthorDetailFetchedAtMap = createSelector(
  selectAuthorState,
  (author) => author.detailFetchedAt,
);

export const selectAuthorDetailFetchedAt = (id: number | null | undefined) =>
  createSelector(
    selectAuthorDetailFetchedAtMap,
    (detailFetchedAt): number | undefined =>
      id == null ? undefined : detailFetchedAt[id],
  );

export const selectAuthorListFetchedAt = createSelector(
  selectAuthorState,
  (author) => author.listFetchedAt,
);

export const selectAuthorListStatus = createSelector(
  selectAuthorState,
  (author) => author.listStatus,
);

export const selectAuthorListError = createSelector(
  selectAuthorState,
  (author) => author.listError,
);

export const selectAuthorDetailStatus = createSelector(
  selectAuthorState,
  (author) => author.detailStatus,
);

export const selectAuthorDetailError = createSelector(
  selectAuthorState,
  (author) => author.detailError,
);

export const selectAuthorSubmitStatus = createSelector(
  selectAuthorState,
  (author) => author.submitStatus,
);

export const selectAuthorSubmitError = createSelector(
  selectAuthorState,
  (author) => author.submitError,
);

export const selectAuthorRemoveStatus = createSelector(
  selectAuthorState,
  (author) => author.removeStatus,
);

export const selectAuthorRemoveError = createSelector(
  selectAuthorState,
  (author) => author.removeError,
);

export const selectAuthorIsSubmitting = createSelector(
  selectAuthorSubmitStatus,
  (submitStatus) => submitStatus === 'loading',
);

export const selectAuthorIsRemoving = createSelector(
  selectAuthorRemoveStatus,
  (removeStatus) => removeStatus === 'loading',
);

/** Опции для Select в PostForm: `{ value: id, label: ФИО }`. */
export const selectAuthorOptions = createSelector(
  selectAuthorList,
  (authors): AuthorOption[] =>
    authors.map((author) => ({
      value: author.id,
      label: formatAuthorName(author),
    })),
);
