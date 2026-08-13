import { useState } from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigProvider, theme } from 'antd';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import type { ConfirmModalOptions } from './ConfirmModalContext';
import { ConfirmModalProvider } from './ConfirmModalProvider';
import { useConfirmModal } from './useConfirmModal';

interface HarnessProps {
  options?: ConfirmModalOptions;
  onResult?: (value: boolean) => void;
}

const defaultOptions: ConfirmModalOptions = {
  title: 'Подтверждение',
  content: 'Вы уверены?',
  okText: 'Да',
  cancelText: 'Нет',
};

const ConfirmHarness = ({
  options = defaultOptions,
  onResult,
}: HarnessProps) => {
  const { confirm } = useConfirmModal();
  const [lastResult, setLastResult] = useState<boolean | null>(null);

  return (
    <div>
      <button
        type="button"
        data-testid="confirmModal_button_open"
        onClick={async () => {
          const result = await confirm(options);
          setLastResult(result);
          onResult?.(result);
        }}
      >
        Открыть confirm
      </button>
      {lastResult !== null ? (
        <span data-testid="confirm-result">{String(lastResult)}</span>
      ) : null}
    </div>
  );
};

const renderConfirmModal = (harnessProps?: HarnessProps) => {
  return componentRender(
    <ConfirmModalProvider>
      <ConfirmHarness {...harnessProps} />
    </ConfirmModalProvider>,
  );
};

describe('ConfirmModalProvider', () => {
  it('модалка не видна изначально', () => {
    renderConfirmModal();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Подтверждение')).not.toBeInTheDocument();
  });

  it('confirm открывает модалку с title, content и текстами кнопок', async () => {
    const user = userEvent.setup();
    renderConfirmModal();

    await user.click(screen.getByTestId('confirmModal_button_open'));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Подтверждение')).toBeInTheDocument();
    expect(screen.getByText('Вы уверены?')).toBeInTheDocument();
    expect(
      screen.getByTestId('confirmModal_button_handleOk'),
    ).toHaveTextContent('Да');
    expect(
      screen.getByTestId('confirmModal_button_handleCancel'),
    ).toHaveTextContent('Нет');
  });

  it('Ok закрывает модалку и резолвит promise в true', async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    renderConfirmModal({ onResult });

    await user.click(screen.getByTestId('confirmModal_button_open'));
    await user.click(await screen.findByTestId('confirmModal_button_handleOk'));

    await waitFor(() => {
      expect(onResult).toHaveBeenCalledWith(true);
    });
    expect(screen.getByTestId('confirm-result')).toHaveTextContent('true');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('Cancel закрывает модалку и резолвит promise в false', async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    renderConfirmModal({ onResult });

    await user.click(screen.getByTestId('confirmModal_button_open'));
    await user.click(
      await screen.findByTestId('confirmModal_button_handleCancel'),
    );

    await waitFor(() => {
      expect(onResult).toHaveBeenCalledWith(false);
    });
    expect(screen.getByTestId('confirm-result')).toHaveTextContent('false');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('закрытие крестиком резолвит promise в false', async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    renderConfirmModal({ onResult });

    await user.click(screen.getByTestId('confirmModal_button_open'));
    await screen.findByRole('dialog');

    const closeButton = document.querySelector(
      '.ant-modal-close',
    ) as HTMLButtonElement | null;
    expect(closeButton).toBeTruthy();
    await user.click(closeButton!);

    await waitFor(() => {
      expect(onResult).toHaveBeenCalledWith(false);
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('после резолва можно открыть confirm повторно', async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    renderConfirmModal({ onResult });

    await user.click(screen.getByTestId('confirmModal_button_open'));
    await user.click(await screen.findByTestId('confirmModal_button_handleOk'));

    await waitFor(() => {
      expect(onResult).toHaveBeenCalledWith(true);
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await user.click(screen.getByTestId('confirmModal_button_open'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Подтверждение')).toBeInTheDocument();

    await user.click(screen.getByTestId('confirmModal_button_handleCancel'));

    await waitFor(() => {
      expect(onResult).toHaveBeenLastCalledWith(false);
    });
    expect(onResult).toHaveBeenCalledTimes(2);
  });

  it('async onOk: держит модалку открытой с loading, закрывает после resolve', async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    let resolveOk!: () => void;
    const onOk = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveOk = resolve;
        }),
    );

    renderConfirmModal({
      onResult,
      options: { ...defaultOptions, onOk },
    });

    await user.click(screen.getByTestId('confirmModal_button_open'));
    await user.click(await screen.findByTestId('confirmModal_button_handleOk'));

    expect(onOk).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(onResult).not.toHaveBeenCalled();

    const okButton = screen.getByTestId('confirmModal_button_handleOk');
    expect(okButton).toBeDisabled();
    expect(okButton.className).toMatch(/ant-btn-loading/);

    resolveOk();

    await waitFor(() => {
      expect(onResult).toHaveBeenCalledWith(true);
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('async onOk reject: сбрасывает loading, закрывает и резолвит false', async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    const onOk = vi.fn(() => Promise.reject(new Error('fail')));

    renderConfirmModal({
      onResult,
      options: { ...defaultOptions, onOk },
    });

    await user.click(screen.getByTestId('confirmModal_button_open'));
    await user.click(await screen.findByTestId('confirmModal_button_handleOk'));

    await waitFor(() => {
      expect(onResult).toHaveBeenCalledWith(false);
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('наследует токены тёмной темы от ConfigProvider', async () => {
    const user = userEvent.setup();
    const darkToken = theme.getDesignToken({ algorithm: theme.darkAlgorithm });

    const TokenProbe = () => {
      const { token } = theme.useToken();
      return <span data-testid="modal-token-bg">{token.colorBgElevated}</span>;
    };

    componentRender(
      <ConfigProvider
        theme={{ algorithm: theme.darkAlgorithm, token: { motion: false } }}
      >
        <ConfirmModalProvider>
          <ConfirmHarness
            options={{ ...defaultOptions, content: <TokenProbe /> }}
          />
        </ConfirmModalProvider>
      </ConfigProvider>,
    );

    await user.click(screen.getByTestId('confirmModal_button_open'));

    expect(await screen.findByTestId('modal-token-bg')).toHaveTextContent(
      darkToken.colorBgElevated,
    );
  });
});

describe('useConfirmModal', () => {
  it('бросает ошибку вне ConfirmModalProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      componentRender(<ConfirmHarness />);
    }).toThrow('useConfirmModal must be used within ConfirmModalProvider');

    consoleError.mockRestore();
  });
});
