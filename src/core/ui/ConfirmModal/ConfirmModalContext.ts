import { createContext, type ReactNode } from 'react';

import type { ButtonProps } from 'antd';

export interface ConfirmModalOptions {
  title: ReactNode;
  content: ReactNode;
  okText?: string;
  cancelText?: string;
  okButtonProps?: ButtonProps;
  /**
   * Async-обработчик OK: модалка ставит `confirmLoading` и не закрывается,
   * пока promise не settle. Успех → закрытие и resolve(`true`);
   * reject → сброс loading, закрытие и resolve(`false`) — ошибку показывает страница.
   */
  onOk?: () => void | Promise<void>;
}

export interface ConfirmModalContextValue {
  confirm: (options: ConfirmModalOptions) => Promise<boolean>;
}

export const ConfirmModalContext =
  createContext<ConfirmModalContextValue | null>(null);
