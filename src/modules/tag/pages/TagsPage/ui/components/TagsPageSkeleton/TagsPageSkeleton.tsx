import { Skeleton } from 'antd';

import { useStyles } from './TagsPageSkeleton.styles';

const ROW_COUNT = 4;

/** Скелетон списка тегов: шапка колонок + строки-карточки. */
export const TagsPageSkeleton = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.root} data-testid="tags-page-skeleton">
      <div className={styles.header}>
        <Skeleton.Input active size="small" block className={styles.cell} />
        <Skeleton.Input active size="small" block className={styles.cell} />
        <Skeleton.Input active size="small" block className={styles.cell} />
        <Skeleton.Input active size="small" block className={styles.cell} />
      </div>
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <div key={index} className={styles.card}>
          <Skeleton.Input active size="small" block className={styles.cell} />
          <Skeleton.Input active size="small" block className={styles.cell} />
          <Skeleton.Input active size="small" block className={styles.cell} />
          <Skeleton.Input active size="small" block className={styles.cell} />
        </div>
      ))}
    </div>
  );
};
