import { Empty } from 'antd';

import { useStyles } from './AuthorsListEmpty.styles';

export const AuthorsListEmpty = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.empty} data-testid="authors-list-empty">
      <Empty description="Авторов пока нет" />
    </div>
  );
};
