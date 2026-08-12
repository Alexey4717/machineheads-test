import { type ReactNode, useCallback, useMemo, useRef, useState } from 'react';

import { Modal } from 'antd';

import {
  ConfirmModalContext,
  type ConfirmModalOptions,
} from './ConfirmModalContext';

interface ConfirmModalProviderProps {
  children: ReactNode;
}

interface ConfirmModalState {
  open: boolean;
  options: ConfirmModalOptions | null;
}

export const ConfirmModalProvider = ({
  children,
}: ConfirmModalProviderProps) => {
  const [state, setState] = useState<ConfirmModalState>({
    open: false,
    options: null,
  });
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const close = useCallback((result: boolean) => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    setState({ open: false, options: null });
    resolve?.(result);
  }, []);

  const confirm = useCallback((options: ConfirmModalOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setState({ open: true, options });
    });
  }, []);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmModalContext.Provider value={value}>
      {children}
      <Modal
        open={state.open}
        title={state.options?.title}
        okText={state.options?.okText}
        cancelText={state.options?.cancelText}
        okButtonProps={state.options?.okButtonProps}
        onOk={() => close(true)}
        onCancel={() => close(false)}
        destroyOnHidden
      >
        {state.options?.content}
      </Modal>
    </ConfirmModalContext.Provider>
  );
};
