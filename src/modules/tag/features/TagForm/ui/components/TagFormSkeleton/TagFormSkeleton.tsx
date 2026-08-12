import { Skeleton } from 'antd';

import { useStyles } from './TagFormSkeleton.styles';

const FIELD_COUNT = 3;

/** Скелетон формы тега: лейбл + поле ×3 и кнопка submit. */
export const TagFormSkeleton = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.root} data-testid="tag-form-skeleton">
      {Array.from({ length: FIELD_COUNT }, (_, index) => (
        <div key={index} className={styles.field}>
          <Skeleton.Input active size="small" className={styles.label} />
          <Skeleton.Input active size="large" block />
        </div>
      ))}
      <Skeleton.Button active size="large" className={styles.submit} />
    </div>
  );
};
