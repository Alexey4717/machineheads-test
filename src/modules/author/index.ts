export { getAuthorModule } from './module';
export { authorActions } from './model/actions';
export {
  selectAuthorById,
  selectAuthorIsSubmitting,
  selectAuthorList,
  selectAuthorListError,
  selectAuthorListStatus,
  selectAuthorOptions,
  selectAuthorState,
  selectAuthorSubmitError,
  selectCurrentAuthor,
} from './model/selectors';
export type {
  Author,
  AuthorFormValues,
  AuthorOption,
  AuthorState,
} from './model/types';
export { AuthorCreatePageAsync } from './pages/AuthorCreatePage/ui/AuthorCreatePage.async';
export { AuthorDetailPageAsync } from './pages/AuthorDetailPage/ui/AuthorDetailPage.async';
export { AuthorEditPageAsync } from './pages/AuthorEditPage/ui/AuthorEditPage.async';
export { AuthorsPageAsync } from './pages/AuthorsPage/ui/AuthorsPage.async';
