import { Typography } from 'antd';

import { Page } from '@/core/ui/Page/Page';

import { LoginForm } from '../../../features/LoginForm/ui/LoginForm';

export default function LoginPage() {
  return (
    <Page title="Вход">
      <Typography.Paragraph type="secondary">
        Войдите, чтобы управлять постами, авторами и тегами.
      </Typography.Paragraph>
      <LoginForm />
    </Page>
  );
}
