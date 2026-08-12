import { useDispatch, useSelector } from 'react-redux';

import { Alert, Button, Form, Input } from 'antd';

import { getErrorMessage } from '@/core/api/errorParsers';

import { authActions } from '../../model/actions';
import { selectAuthError, selectAuthIsSubmitting } from '../../model/selectors';
import type { LoginCredentials } from '../../model/types';
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

      <Form.Item
        label="E-mail"
        name="email"
        rules={[
          { required: true, message: 'Укажите e-mail' },
          { type: 'email', message: 'Некорректный e-mail' },
        ]}
      >
        <Input autoComplete="email" placeholder="email@example.com" />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Укажите пароль' }]}
      >
        <Input.Password autoComplete="current-password" placeholder="Пароль" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={isSubmitting}>
          Войти
        </Button>
      </Form.Item>
    </Form>
  );
}
