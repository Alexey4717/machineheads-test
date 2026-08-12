import type { ReactNode } from 'react';

import { Result, Skeleton, Typography } from 'antd';

import { useStyles } from './Page.styles';

export type PageErrorStatus = 403 | 404 | 500 | 'error';

export interface PageError {
  status?: PageErrorStatus;
  title?: string;
  subtitle?: string;
  extra?: ReactNode;
}

export interface PageProps {
  title: string;
  extra?: ReactNode;
  loading?: boolean;
  skeleton?: ReactNode;
  error?: PageError | null;
  children?: ReactNode;
}

export const Page = ({
  title,
  extra,
  loading = false,
  skeleton,
  error,
  children,
}: PageProps) => {
  const { styles } = useStyles();

  if (error) {
    return (
      <Result
        status={error.status ?? 'error'}
        title={error.title ?? 'Ошибка'}
        subTitle={error.subtitle}
        extra={error.extra}
      />
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <Typography.Title level={3} className={styles.title}>
          {title}
        </Typography.Title>
        {extra}
      </div>

      {loading ? (skeleton ?? <Skeleton active />) : children}
    </div>
  );
};
