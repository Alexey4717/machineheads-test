import { Skeleton } from 'antd';

import { useStyles } from './AuthorFormSkeleton.styles';

const FIELD_COUNT = 3;
const TEXTAREA_COUNT = 2;

/** Скелетон формы автора: поля ФИО, описания, аватар и кнопка. */
export const AuthorFormSkeleton = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.root} data-testid="author-form-skeleton">
      {Array.from({ length: FIELD_COUNT }, (_, index) => (
        <div key={`field-${index}`} className={styles.field}>
          <Skeleton.Input active size="small" className={styles.label} />
          <Skeleton.Input active size="large" block />
        </div>
      ))}
      {Array.from({ length: TEXTAREA_COUNT }, (_, index) => (
        <div key={`textarea-${index}`} className={styles.field}>
          <Skeleton.Input active size="small" className={styles.label} />
          <Skeleton.Input
            active
            size="large"
            block
            className={styles.textarea}
          />
        </div>
      ))}
      <div className={styles.field}>
        <Skeleton.Input active size="small" className={styles.label} />
        <Skeleton.Avatar
          active
          size={104}
          shape="square"
          className={styles.avatar}
        />
      </div>
      <Skeleton.Button active size="large" className={styles.submit} />
    </div>
  );
};
