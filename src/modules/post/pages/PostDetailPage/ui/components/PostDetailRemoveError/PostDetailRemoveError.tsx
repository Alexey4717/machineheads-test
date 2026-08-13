import { useSelector } from 'react-redux';

import { Alert } from 'antd';

import { getErrorMessage } from '@/core/api/errorParsers';

import { selectPostRemoveError } from '../../../../../model/selectors';
import { useStyles } from './PostDetailRemoveError.styles';

export const PostDetailRemoveError = () => {
  const removeError = useSelector(selectPostRemoveError);
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
