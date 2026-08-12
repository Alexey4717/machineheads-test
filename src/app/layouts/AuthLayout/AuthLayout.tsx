import type { ReactNode } from 'react';

import { Layout, Typography } from 'antd';

import { useStyles } from './AuthLayout.styles';

const { Content } = Layout;

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { styles } = useStyles();

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Typography.Title level={2} className={styles.title}>
          Machineheads Admin
        </Typography.Title>
        {children}
      </Content>
    </Layout>
  );
}
