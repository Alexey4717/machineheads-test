export { getTagModule } from './module';
export { tagActions } from './model/actions';
export {
  selectCurrentTag,
  selectTagById,
  selectTagIsSubmitting,
  selectTagList,
  selectTagListError,
  selectTagListStatus,
  selectTagOptions,
  selectTagState,
  selectTagSubmitError,
} from './model/selectors';
export type { Tag, TagFormValues, TagOption, TagState } from './model/types';
export { TagCreatePageAsync } from './pages/TagCreatePage/ui/TagCreatePage.async';
export { TagDetailPageAsync } from './pages/TagDetailPage/ui/TagDetailPage.async';
export { TagEditPageAsync } from './pages/TagEditPage/ui/TagEditPage.async';
export { TagsPageAsync } from './pages/TagsPage/ui/TagsPage.async';
