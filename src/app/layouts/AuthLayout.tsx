import type { ReactNode } from 'react';

import { Layout, Typography } from 'antd';

const { Content } = Layout;

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Typography.Title level={2} style={{ marginBottom: 24 }}>
          Machineheads Admin
        </Typography.Title>
        {children}
      </Content>
    </Layout>
  );
}
