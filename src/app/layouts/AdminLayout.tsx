import type { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import {
  FileTextOutlined,
  LogoutOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

import { PATHS } from '@/core/config/router/paths';
import { type ThemeMode, ThemeSwitch } from '@/core/ui/ThemeSwitch/ThemeSwitch';

import { authActions } from '@/modules/auth';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
}

export function AdminLayout({
  children,
  themeMode,
  onThemeChange,
}: AdminLayoutProps) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token } = theme.useToken();

  const selectedKey = location.pathname.startsWith(PATHS.AUTHORS)
    ? 'authors'
    : location.pathname.startsWith(PATHS.TAGS)
      ? 'tags'
      : 'posts';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth={64}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            paddingInline: 12,
            textAlign: 'center',
          }}
        >
          Machineheads
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={[
            {
              key: 'posts',
              icon: <FileTextOutlined />,
              label: <Link to={PATHS.POSTS}>Посты</Link>,
            },
            {
              key: 'authors',
              icon: <TeamOutlined />,
              label: <Link to={PATHS.AUTHORS}>Авторы</Link>,
            },
            {
              key: 'tags',
              icon: <TagsOutlined />,
              label: <Link to={PATHS.TAGS}>Теги</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: token.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 16,
            paddingInline: 24,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <ThemeSwitch value={themeMode} onChange={onThemeChange} />
          <Button
            icon={<LogoutOutlined />}
            onClick={() => dispatch(authActions.logoutRequest())}
          >
            Выйти
          </Button>
        </Header>
        <Content style={{ margin: 24 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
