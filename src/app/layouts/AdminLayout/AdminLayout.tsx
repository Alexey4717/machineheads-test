import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  FileTextOutlined,
  LogoutOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Spin } from 'antd';

import { PATHS } from '@/core/config/router/paths';
import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { type ThemeMode, ThemeSwitch } from '@/core/ui/ThemeSwitch/ThemeSwitch';

import { authActions } from '@/modules/auth';

import { useStyles } from './AdminLayout.styles';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
}

export const AdminLayout = ({
  children,
  themeMode,
  onThemeChange,
}: AdminLayoutProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { styles } = useStyles();

  const selectedKey = location.pathname.startsWith(PATHS.AUTHORS)
    ? 'authors'
    : location.pathname.startsWith(PATHS.TAGS)
      ? 'tags'
      : 'posts';

  return (
    <Layout className={styles.layout}>
      <Sider breakpoint="lg" collapsedWidth={64}>
        <div className={styles.logo}>Machineheads</div>
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
        <Header className={styles.header}>
          <ThemeSwitch value={themeMode} onChange={onThemeChange} />
          <Button
            icon={<LogoutOutlined />}
            onClick={() => dispatch(authActions.logoutRequest())}
          >
            Выйти
          </Button>
        </Header>
        <Content className={styles.content}>
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
    </Layout>
  );
};
