import { Skeleton } from 'antd';

import { useStyles } from './PostsPageSkeleton.styles';

const ROW_COUNT = 4;

/** Скелетон списка постов: шапка колонок + строки-карточки. */
export const PostsPageSkeleton = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.root} data-testid="posts-page-skeleton">
      <div className={styles.header}>
        <Skeleton.Input active size="small" block className={styles.cell} />
        <Skeleton.Input active size="small" block className={styles.cell} />
        <Skeleton.Input active size="small" block className={styles.cell} />
      </div>
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <div key={index} className={styles.card}>
          <Skeleton.Input active size="small" block className={styles.cell} />
          <Skeleton.Input active size="small" block className={styles.cell} />
          <Skeleton.Input active size="small" block className={styles.cell} />
        </div>
      ))}
    </div>
  );
};
