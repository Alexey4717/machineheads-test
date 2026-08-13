import { useEffect } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { UploadFile } from 'antd/es/upload/interface';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ImageUploadField } from './ImageUploadField';

vi.mock('./ImageUploadField.styles', () => ({
  useStyles: () => ({
    styles: { upload: 'upload', tip: 'tip' },
  }),
}));

interface HarnessProps {
  onReady: (form: FormInstance) => void;
}

const RemoveFlagHarness = ({ onReady }: HarnessProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    onReady(form);
  }, [form, onReady]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        avatar: [
          {
            uid: '1',
            name: 'avatar.png',
            status: 'done',
            url: 'https://example.com/avatar.png',
          },
        ],
        removeAvatar: false,
      }}
    >
      <ImageUploadField
        name="avatar"
        label="Аватар"
        testId="author-avatar"
        removeFlagName="removeAvatar"
      />
    </Form>
  );
};

const SelectFileHarness = ({ onReady }: HarnessProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    onReady(form);
  }, [form, onReady]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ avatar: [] as UploadFile[] }}
    >
      <ImageUploadField name="avatar" label="Аватар" testId="author-avatar" />
    </Form>
  );
};

describe('ImageUploadField', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('прокидывает data-testid на Upload', () => {
    render(
      <Form>
        <ImageUploadField
          name="avatar"
          label="Аватар"
          testId="author-avatar"
          tip="JPG/PNG, один файл"
        />
      </Form>,
    );

    expect(screen.getByTestId('author-avatar')).toBeInTheDocument();
    expect(screen.getByText('JPG/PNG, один файл')).toBeInTheDocument();
  });

  it('ставит removeFlag в true при удалении файла', async () => {
    const user = userEvent.setup();
    let form: FormInstance | undefined;

    const { container } = render(
      <RemoveFlagHarness
        onReady={(instance) => {
          form = instance;
        }}
      />,
    );

    await waitFor(() => {
      expect(form).toBeDefined();
    });

    expect(form!.getFieldValue('removeAvatar')).toBe(false);

    const removeButton = container.querySelector(
      'button.ant-upload-list-item-action',
    );
    expect(removeButton).toBeTruthy();
    await user.click(removeButton!);

    await waitFor(() => {
      expect(form!.getFieldValue('removeAvatar')).toBe(true);
      expect(form!.getFieldValue('avatar')).toEqual([]);
    });
  });

  it('добавляет thumbUrl через createObjectURL при выборе файла', async () => {
    const user = userEvent.setup();
    const createObjectURL = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock-preview');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    let form: FormInstance | undefined;

    const { container } = render(
      <SelectFileHarness
        onReady={(instance) => {
          form = instance;
        }}
      />,
    );

    await waitFor(() => {
      expect(form).toBeDefined();
    });

    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).toBeTruthy();

    const file = new File(['image-bytes'], 'photo.png', { type: 'image/png' });
    await user.upload(input!, file);

    await waitFor(() => {
      const value = form!.getFieldValue('avatar') as UploadFile[];
      expect(value).toHaveLength(1);
      expect(value[0]?.thumbUrl).toBe('blob:mock-preview');
      expect(value[0]?.status).toBe('done');
      expect(value[0]?.name).toBe('photo.png');
    });

    expect(createObjectURL).toHaveBeenCalledTimes(1);
  });
});
