import { createContext, type ReactNode } from 'react';

import type { ButtonProps } from 'antd';

export interface ConfirmModalOptions {
  title: ReactNode;
  content: ReactNode;
  okText?: string;
  cancelText?: string;
  okButtonProps?: ButtonProps;
}

export interface ConfirmModalContextValue {
  confirm: (options: ConfirmModalOptions) => Promise<boolean>;
}

export const ConfirmModalContext =
  createContext<ConfirmModalContextValue | null>(null);
