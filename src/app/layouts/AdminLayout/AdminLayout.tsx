import type { ReactNode } from 'react';
import { Suspense, useState } from 'react';
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
import { ThemeSwitch } from '@/core/ui/ThemeSwitch/ThemeSwitch';

import { authActions } from '@/modules/auth';

import { useThemeMode } from '../../providers/ThemeProvider/ThemeProvider';
import { useStyles } from './AdminLayout.styles';

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { styles, cx } = useStyles();
  const { themeMode, onThemeChange } = useThemeMode();
  const [collapsed, setCollapsed] = useState(
    window.matchMedia('screen and (max-width: 991.98px)').matches,
  );

  const selectedKey = location.pathname.startsWith(PATHS.AUTHORS)
    ? 'authors'
    : location.pathname.startsWith(PATHS.TAGS)
      ? 'tags'
      : 'posts';

  return (
    <Layout className={styles.layout}>
      <Sider
        aria-label="Боковая панель"
        breakpoint="lg"
        collapsed={collapsed}
        collapsedWidth={64}
        onCollapse={setCollapsed}
      >
        <div
          className={cx(styles.logo, collapsed && styles.logoCollapsed)}
          title="Machineheads"
        >
          {collapsed ? 'M' : 'Machineheads'}
        </div>
        <nav aria-label="Основное меню">
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={[
              {
                key: 'posts',
                icon: <FileTextOutlined />,
                label: (
                  <Link to={PATHS.POSTS} data-testid="adminLayout_link_POSTS">
                    Посты
                  </Link>
                ),
              },
              {
                key: 'authors',
                icon: <TeamOutlined />,
                label: (
                  <Link
                    to={PATHS.AUTHORS}
                    data-testid="adminLayout_link_AUTHORS"
                  >
                    Авторы
                  </Link>
                ),
              },
              {
                key: 'tags',
                icon: <TagsOutlined />,
                label: (
                  <Link to={PATHS.TAGS} data-testid="adminLayout_link_TAGS">
                    Теги
                  </Link>
                ),
              },
            ]}
          />
        </nav>
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <ThemeSwitch value={themeMode} onChange={onThemeChange} />
          <Button
            icon={<LogoutOutlined />}
            onClick={() => dispatch(authActions.logoutRequest())}
            data-testid="adminLayout_button_logout"
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
