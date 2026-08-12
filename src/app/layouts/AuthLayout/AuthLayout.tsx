import type { ReactNode } from 'react';
import { Suspense } from 'react';

import { Layout, Spin, Typography } from 'antd';

import { useStyles } from './AuthLayout.styles';

const { Content } = Layout;

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { styles } = useStyles();

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Typography.Title level={2} className={styles.title}>
          Machineheads Admin
        </Typography.Title>
        <Suspense
          fallback={
            <div className={styles.fallback}>
              <Spin size="large" />
            </div>
          }
        >
          {children}
        </Suspense>
      </Content>
    </Layout>
  );
};
