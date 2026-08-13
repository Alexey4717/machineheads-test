import { Link } from 'react-router-dom';

import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import { formatDate } from '@/core/lib/formatDate/formatDate';

import type { Tag } from '../../../../../model/types';
import { useStyles } from './TagsListCard.styles';

export interface TagsListCardProps {
  tag: Tag;
}

export const TagsListCard = ({ tag }: TagsListCardProps) => {
  const { styles } = useStyles();

  return (
    <Link
      to={getPath(PATHS.TAG_DETAIL, { id: tag.id })}
      className={styles.card}
      data-testid={`tagsList_link_TAG_DETAIL_${tag.id}`}
    >
      <span className={styles.cell}>{tag.name}</span>
      <span className={styles.cell}>{tag.code}</span>
      <span className={styles.cell}>{tag.sort}</span>
      <span className={styles.cell}>{formatDate(tag.updatedAt)}</span>
    </Link>
  );
};
