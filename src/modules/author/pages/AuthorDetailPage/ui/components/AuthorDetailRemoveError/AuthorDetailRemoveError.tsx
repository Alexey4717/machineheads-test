import { useSelector } from 'react-redux';

import { Alert } from 'antd';

import { getErrorMessage } from '@/core/api/errorParsers';

import { selectAuthorRemoveError } from '../../../../../model/selectors';
import { useStyles } from './AuthorDetailRemoveError.styles';

export const AuthorDetailRemoveError = () => {
  const removeError = useSelector(selectAuthorRemoveError);
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
