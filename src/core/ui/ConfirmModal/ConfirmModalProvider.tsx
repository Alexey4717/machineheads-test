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
  confirmLoading: boolean;
}

export const ConfirmModalProvider = ({
  children,
}: ConfirmModalProviderProps) => {
  const [state, setState] = useState<ConfirmModalState>({
    open: false,
    options: null,
    confirmLoading: false,
  });
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const optionsRef = useRef<ConfirmModalOptions | null>(null);
  const loadingRef = useRef(false);

  const close = useCallback((result: boolean) => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    optionsRef.current = null;
    loadingRef.current = false;
    setState({ open: false, options: null, confirmLoading: false });
    resolve?.(result);
  }, []);

  const confirm = useCallback((options: ConfirmModalOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      optionsRef.current = options;
      loadingRef.current = false;
      setState({ open: true, options, confirmLoading: false });
    });
  }, []);

  const handleOk = useCallback(async () => {
    const onOk = optionsRef.current?.onOk;

    if (!onOk) {
      close(true);
      return;
    }

    loadingRef.current = true;
    setState((prev) => ({ ...prev, confirmLoading: true }));

    try {
      await onOk();
      close(true);
    } catch {
      close(false);
    }
  }, [close]);

  const handleCancel = useCallback(() => {
    if (loadingRef.current) {
      return;
    }

    close(false);
  }, [close]);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmModalContext.Provider value={value}>
      {children}
      <Modal
        open={state.open}
        title={state.options?.title}
        okText={state.options?.okText}
        cancelText={state.options?.cancelText}
        okButtonProps={{
          ...state.options?.okButtonProps,
          disabled:
            state.confirmLoading || state.options?.okButtonProps?.disabled,
          'data-testid': 'confirmModal_button_handleOk',
        }}
        confirmLoading={state.confirmLoading}
        cancelButtonProps={{
          disabled: state.confirmLoading,
          'data-testid': 'confirmModal_button_handleCancel',
        }}
        onOk={() => void handleOk()}
        onCancel={handleCancel}
        destroyOnHidden
      >
        {state.options?.content}
      </Modal>
    </ConfirmModalContext.Provider>
  );
};
