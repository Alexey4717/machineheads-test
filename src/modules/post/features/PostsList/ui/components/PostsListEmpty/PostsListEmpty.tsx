import { Empty } from 'antd';

import { useStyles } from './PostsListEmpty.styles';

export const PostsListEmpty = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.empty} data-testid="posts-list-empty">
      <Empty description="Постов пока нет" />
    </div>
  );
};
