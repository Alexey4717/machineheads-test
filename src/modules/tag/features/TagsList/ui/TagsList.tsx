import { useSelector } from 'react-redux';

import { selectTagList } from '../../../model/selectors';
import { TagsListCard } from './components/TagsListCard/TagsListCard';
import { TagsListEmpty } from './components/TagsListEmpty/TagsListEmpty';
import { TagsListHeader } from './components/TagsListHeader/TagsListHeader';
import { useStyles } from './TagsList.styles';

/** Список тегов: сам читает `selectTagList`, props не нужны. */
export const TagsList = () => {
  const tags = useSelector(selectTagList);
  const { styles } = useStyles();

  if (tags.length === 0) {
    return <TagsListEmpty />;
  }

  return (
    <div className={styles.root} data-testid="tags-list">
      <TagsListHeader />
      {tags.map((tag) => (
        <TagsListCard key={tag.id} tag={tag} />
      ))}
    </div>
  );
};
