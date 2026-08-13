import { useStyles } from './PostsListHeader.styles';

export const PostsListHeader = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.header} data-testid="posts-list-header">
      <span>Название</span>
      <span>Автор</span>
      <span>Теги</span>
    </div>
  );
};
