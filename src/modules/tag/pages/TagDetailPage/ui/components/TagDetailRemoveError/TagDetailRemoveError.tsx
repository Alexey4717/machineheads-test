import { useSelector } from 'react-redux';

import { Alert } from 'antd';

import { getErrorMessage } from '@/core/api/errorParsers';

import { selectTagRemoveError } from '../../../../../model/selectors';
import { useStyles } from './TagDetailRemoveError.styles';

/** Alert ошибки удаления тега. Данные и стили инкапсулированы — props не нужны. */
export const TagDetailRemoveError = () => {
  const removeError = useSelector(selectTagRemoveError);
  const { styles } = useStyles();

  if (!removeError) {
    return null;
  }

  return (
    <Alert
      type="error"
      showIcon
      title={getErrorMessage(removeError)}
      className={styles.alert}
    />
  );
};
