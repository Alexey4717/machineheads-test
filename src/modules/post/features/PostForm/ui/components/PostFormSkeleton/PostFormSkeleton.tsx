import { Skeleton } from 'antd';

import { useStyles } from './PostFormSkeleton.styles';

const FIELD_COUNT = 4;

export const PostFormSkeleton = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.root} data-testid="post-form-skeleton">
      {Array.from({ length: FIELD_COUNT }, (_, index) => (
        <div key={`field-${index}`} className={styles.field}>
          <Skeleton.Input active size="small" className={styles.label} />
          <Skeleton.Input active size="large" block />
        </div>
      ))}
      <div className={styles.field}>
        <Skeleton.Input active size="small" className={styles.label} />
        <Skeleton.Input active size="large" block className={styles.textarea} />
      </div>
      <div className={styles.field}>
        <Skeleton.Input active size="small" className={styles.label} />
        <Skeleton.Avatar
          active
          size={104}
          shape="square"
          className={styles.preview}
        />
      </div>
      <Skeleton.Button active size="large" className={styles.submit} />
    </div>
  );
};
