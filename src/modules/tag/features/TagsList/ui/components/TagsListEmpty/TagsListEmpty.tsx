import { Empty } from 'antd';

import { useStyles } from './TagsListEmpty.styles';

export const TagsListEmpty = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.empty} data-testid="tags-list-empty">
      <Empty description="Тегов пока нет" />
    </div>
  );
};
