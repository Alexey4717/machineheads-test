import { Skeleton } from 'antd';

import { useStyles } from './AuthorsPageSkeleton.styles';

const ROW_COUNT = 4;

/** Скелетон списка авторов: шапка колонок + строки-карточки. */
export const AuthorsPageSkeleton = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.root} data-testid="authors-page-skeleton">
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
