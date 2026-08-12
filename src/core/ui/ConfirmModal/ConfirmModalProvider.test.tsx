import { useState } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigProvider } from 'antd';
import { describe, expect, it, vi } from 'vitest';

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
  return render(
    <ConfigProvider theme={{ token: { motion: false } }}>
      <ConfirmModalProvider>
        <ConfirmHarness {...harnessProps} />
      </ConfirmModalProvider>
    </ConfigProvider>,
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

    await user.click(screen.getByRole('button', { name: 'Открыть confirm' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Подтверждение')).toBeInTheDocument();
    expect(screen.getByText('Вы уверены?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Да' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Нет' })).toBeInTheDocument();
  });

  it('Ok закрывает модалку и резолвит promise в true', async () => {
    const user = userEvent.setup();
    const onResult = vi.fn();
    renderConfirmModal({ onResult });

    await user.click(screen.getByRole('button', { name: 'Открыть confirm' }));
    await user.click(await screen.findByRole('button', { name: 'Да' }));

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

    await user.click(screen.getByRole('button', { name: 'Открыть confirm' }));
    await user.click(await screen.findByRole('button', { name: 'Нет' }));

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

    await user.click(screen.getByRole('button', { name: 'Открыть confirm' }));
    await screen.findByRole('dialog');

    await user.click(screen.getByRole('button', { name: 'Close' }));

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

    await user.click(screen.getByRole('button', { name: 'Открыть confirm' }));
    await user.click(await screen.findByRole('button', { name: 'Да' }));

    await waitFor(() => {
      expect(onResult).toHaveBeenCalledWith(true);
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Открыть confirm' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Подтверждение')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Нет' }));

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

    await user.click(screen.getByRole('button', { name: 'Открыть confirm' }));
    await user.click(await screen.findByRole('button', { name: 'Да' }));

    expect(onOk).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(onResult).not.toHaveBeenCalled();

    const okButton = screen.getByRole('button', { name: /Да/ });
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

    await user.click(screen.getByRole('button', { name: 'Открыть confirm' }));
    await user.click(await screen.findByRole('button', { name: 'Да' }));

    await waitFor(() => {
      expect(onResult).toHaveBeenCalledWith(false);
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});

describe('useConfirmModal', () => {
  it('бросает ошибку вне ConfirmModalProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(
        <ConfigProvider>
          <ConfirmHarness />
        </ConfigProvider>,
      );
    }).toThrow('useConfirmModal must be used within ConfirmModalProvider');

    consoleError.mockRestore();
  });
});
