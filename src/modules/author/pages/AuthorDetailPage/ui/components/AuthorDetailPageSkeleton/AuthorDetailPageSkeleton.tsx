import { Skeleton } from 'antd';

import { useStyles } from './AuthorDetailPageSkeleton.styles';

const ROW_COUNT = 10;

/** Скелетон деталки автора: строки в духе Descriptions. */
export const AuthorDetailPageSkeleton = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.root} data-testid="author-detail-page-skeleton">
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <div key={index} className={styles.row}>
          <Skeleton.Input active size="small" block />
          <Skeleton.Input active size="small" block />
        </div>
      ))}
    </div>
  );
};
