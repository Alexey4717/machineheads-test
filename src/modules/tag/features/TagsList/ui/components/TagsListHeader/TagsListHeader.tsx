import { useStyles } from './TagsListHeader.styles';

export const TagsListHeader = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.header} data-testid="tags-list-header">
      <span>Название</span>
      <span>Код</span>
      <span>Сортировка</span>
      <span>Обновлён</span>
    </div>
  );
};
