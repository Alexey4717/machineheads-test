import { useSelector } from 'react-redux';

import { Alert, Button, Form } from 'antd';

import { getErrorMessage } from '@/core/api/errorParsers';
import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { TextField } from '@/core/ui/TextField/TextField';

import { authActions } from '../../../model/actions';
import {
  selectAuthError,
  selectAuthIsSubmitting,
} from '../../../model/selectors';
import type { LoginCredentials } from '../../../model/types';
import { loginRules } from '../lib/form/LoginForm.rules';
import { useStyles } from './LoginForm.styles';

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const isSubmitting = useSelector(selectAuthIsSubmitting);
  const error = useSelector(selectAuthError);
  const [form] = Form.useForm<LoginCredentials>();
  const { styles } = useStyles();

  const onFinish = (values: LoginCredentials) => {
    dispatch(authActions.loginRequest(values));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className={styles.form}
    >
      {error ? (
        <Alert
          type="error"
          showIcon
          title={getErrorMessage(error)}
          className={styles.alert}
        />
      ) : null}

      <TextField
        name="email"
        label="E-mail"
        rules={loginRules.email}
        data-testid="loginForm_input_email"
        autoComplete="email"
        placeholder="email@example.com"
      />

      <TextField
        name="password"
        label="Пароль"
        type="password"
        rules={loginRules.password}
        data-testid="loginForm_input_password"
        autoComplete="current-password"
        placeholder="Пароль"
      />

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isSubmitting}
          data-testid="loginForm_button_submit"
        >
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
};
