import { Skeleton } from 'antd';

import { useStyles } from './PostDetailPageSkeleton.styles';

const ROW_COUNT = 9;

/** Скелетон деталки поста: строки в духе Descriptions. */
export const PostDetailPageSkeleton = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.root} data-testid="post-detail-page-skeleton">
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <div key={index} className={styles.row}>
          <Skeleton.Input active size="small" className={styles.label} />
          <Skeleton.Input active size="small" block />
        </div>
      ))}
    </div>
  );
};
