import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Alert, Form } from 'antd';

import { getErrorMessage } from '@/core/api/errorParsers';
import { applyFormFieldErrors } from '@/core/lib/form/applyFormFieldErrors';

import { selectAuthorSubmitError } from '../../../../../model/selectors';
import { useStyles } from './AuthorFormSubmitError.styles';

/**
 * Применяет 422 field-errors к Form и показывает Alert для system/unknown.
 * Должен рендериться внутри antd `Form`. Данные и стили инкапсулированы — props не нужны.
 */
export const AuthorFormSubmitError = () => {
  const form = Form.useFormInstance();
  const submitError = useSelector(selectAuthorSubmitError);
  const { styles } = useStyles();

  useEffect(() => {
    if (!submitError) {
      return;
    }

    if (submitError.kind === 'validation') {
      applyFormFieldErrors(form, submitError);
    }
  }, [form, submitError]);

  if (!submitError || submitError.kind === 'validation') {
    return null;
  }

  return (
    <Alert
      type="error"
      showIcon
      title={getErrorMessage(submitError)}
      className={styles.alert}
    />
  );
};
