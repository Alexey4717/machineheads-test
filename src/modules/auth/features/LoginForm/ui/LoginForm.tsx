import { useDispatch, useSelector } from 'react-redux';

import { Alert, Button, Form } from 'antd';

import { getErrorMessage } from '@/core/api/errorParsers';
import { Field } from '@/core/ui/Field/Field';

import { authActions } from '../../../model/actions';
import {
  selectAuthError,
  selectAuthIsSubmitting,
} from '../../../model/selectors';
import type { LoginCredentials } from '../../../model/types';
import { loginRules } from '../lib/LoginForm.rules';
import { useStyles } from './LoginForm.styles';

export function LoginForm() {
  const dispatch = useDispatch();
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
          message={getErrorMessage(error)}
          className={styles.alert}
        />
      ) : null}

      <Field
        name="email"
        label="E-mail"
        rules={loginRules.email}
        testId="login-email"
        autoComplete="email"
        placeholder="email@example.com"
      />

      <Field
        name="password"
        label="Пароль"
        type="password"
        rules={loginRules.password}
        testId="login-password"
        autoComplete="current-password"
        placeholder="Пароль"
      />

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={isSubmitting}>
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
}
