import { ConfigProvider, Layout, Typography } from 'antd';

import { AppRouter } from '@/app/router/AppRouter';

const { Header, Content } = Layout;

export function App() {
  return (
    <ConfigProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            machineheads-test
          </Typography.Title>
        </Header>
        <Content style={{ padding: 24 }}>
          <AppRouter />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
