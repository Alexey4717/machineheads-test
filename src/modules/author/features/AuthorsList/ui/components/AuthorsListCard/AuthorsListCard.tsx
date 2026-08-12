import { Link } from 'react-router-dom';

import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import { formatDate } from '@/core/lib/formatDate/formatDate';

import { formatAuthorName } from '../../../../../model/formatAuthorName';
import type { Author } from '../../../../../model/types';
import { useStyles } from './AuthorsListCard.styles';

export interface AuthorsListCardProps {
  author: Author;
}

export const AuthorsListCard = ({ author }: AuthorsListCardProps) => {
  const { styles } = useStyles();

  return (
    <Link
      to={getPath(PATHS.AUTHOR_DETAIL, { id: author.id })}
      className={styles.card}
      data-testid={`authors-list-card-${author.id}`}
    >
      <span className={styles.cell}>{formatAuthorName(author)}</span>
      <span className={styles.cell}>{formatDate(author.updatedAt)}</span>
      <span className={styles.cell}>{formatDate(author.createdAt)}</span>
    </Link>
  );
};
