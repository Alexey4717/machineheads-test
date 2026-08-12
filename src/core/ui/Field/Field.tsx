import type { ChangeEventHandler, ReactNode } from 'react';

import { Form, Input } from 'antd';
import type { FormItemProps, Rule } from 'antd/es/form';
import type { NamePath } from 'antd/es/form/interface';
import type { InputProps } from 'antd/es/input';

export type FieldType = 'text' | 'password';

export type FieldProps = {
  name?: NamePath;
  label?: ReactNode;
  rules?: Rule[];
  /** Default: `text` */
  type?: FieldType;
  /** Maps to `data-testid` on the interactive control */
  testId: string;
  'aria-label'?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  allowClear?: boolean;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  help?: FormItemProps['help'];
  extra?: FormItemProps['extra'];
  required?: boolean;
  validateStatus?: FormItemProps['validateStatus'];
  className?: string;
  inputProps?: Omit<
    InputProps,
    | 'value'
    | 'onChange'
    | 'type'
    | 'data-testid'
    | 'aria-label'
    | 'placeholder'
    | 'autoComplete'
    | 'disabled'
    | 'allowClear'
  >;
};

export function Field({
  name,
  label,
  rules,
  type = 'text',
  testId,
  'aria-label': ariaLabel,
  placeholder,
  autoComplete,
  disabled,
  allowClear,
  value,
  onChange,
  help,
  extra,
  required,
  validateStatus,
  className,
  inputProps,
}: FieldProps) {
  const isFormField = name !== undefined && name !== null;

  const controlProps = {
    placeholder,
    autoComplete,
    disabled,
    allowClear,
    'aria-label': ariaLabel,
    'data-testid': testId,
    ...inputProps,
    ...(isFormField ? {} : { value, onChange }),
  };

  const control =
    type === 'password' ? (
      <Input.Password {...controlProps} />
    ) : (
      <Input {...controlProps} />
    );

  return (
    <Form.Item
      name={name}
      label={label}
      rules={rules}
      help={help}
      extra={extra}
      required={required}
      validateStatus={validateStatus}
      className={className}
    >
      {control}
    </Form.Item>
  );
}
