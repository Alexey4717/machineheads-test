import { useStyles } from './AuthorsListHeader.styles';

export const AuthorsListHeader = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.header} data-testid="authors-list-header">
      <span>ФИО</span>
      <span>Обновлён</span>
      <span>Создан</span>
    </div>
  );
};
