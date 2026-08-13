import { Link } from 'react-router-dom';

import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';

import type { Post } from '../../../../../model/types';
import { useStyles } from './PostsListCard.styles';

export interface PostsListCardProps {
  post: Post;
}

export const PostsListCard = ({ post }: PostsListCardProps) => {
  const { styles } = useStyles();
  const tagsLabel = (post.tagNames ?? []).join(', ') || '—';

  return (
    <Link
      to={getPath(PATHS.POST_DETAIL, { id: post.id })}
      className={styles.card}
      data-testid={`postsList_link_POST_DETAIL_${post.id}`}
    >
      <span className={styles.cell}>{post.title}</span>
      <span className={styles.cell}>{post.authorName || '—'}</span>
      <span className={styles.cell}>{tagsLabel}</span>
    </Link>
  );
};
