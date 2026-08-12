import { useSelector } from 'react-redux';

import { selectAuthorList } from '../../../model/selectors';
import { useStyles } from './AuthorsList.styles';
import { AuthorsListCard } from './components/AuthorsListCard/AuthorsListCard';
import { AuthorsListEmpty } from './components/AuthorsListEmpty/AuthorsListEmpty';
import { AuthorsListHeader } from './components/AuthorsListHeader/AuthorsListHeader';

/** Список авторов: сам читает `selectAuthorList`, props не нужны. */
export const AuthorsList = () => {
  const authors = useSelector(selectAuthorList);
  const { styles } = useStyles();

  if (authors.length === 0) {
    return <AuthorsListEmpty />;
  }

  return (
    <div className={styles.root} data-testid="authors-list">
      <AuthorsListHeader />
      {authors.map((author) => (
        <AuthorsListCard key={author.id} author={author} />
      ))}
    </div>
  );
};
