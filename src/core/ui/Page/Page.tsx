import type { ReactNode } from 'react';

import { Result, Skeleton, Typography } from 'antd';

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

export function Page({
  title,
  extra,
  loading = false,
  skeleton,
  error,
  children,
}: PageProps) {
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        {extra}
      </div>

      {loading ? (skeleton ?? <Skeleton active />) : children}
    </div>
  );
}
