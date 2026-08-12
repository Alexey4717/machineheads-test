import { Skeleton } from 'antd';

import { useStyles } from './TagDetailPageSkeleton.styles';

const ROW_COUNT = 6;

/** Скелетон деталки тега: строки в духе Descriptions. */
export const TagDetailPageSkeleton = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.root} data-testid="tag-detail-page-skeleton">
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <div key={index} className={styles.row}>
          <Skeleton.Input active size="small" className={styles.label} />
          <Skeleton.Input active size="small" block />
        </div>
      ))}
    </div>
  );
};
