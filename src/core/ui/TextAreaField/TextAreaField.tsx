import type { ChangeEventHandler, ReactNode } from 'react';

import { Form, Input } from 'antd';
import type { FormItemProps, Rule } from 'antd/es/form';
import type { NamePath } from 'antd/es/form/interface';
import type { TextAreaProps as AntdTextAreaProps } from 'antd/es/input';

export interface TextAreaFieldProps {
  name?: NamePath;
  label?: ReactNode;
  rules?: Rule[];
  /** Maps to `data-testid` on the interactive control */
  testId: string;
  'aria-label'?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  maxLength?: number;
  showCount?: AntdTextAreaProps['showCount'];
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  help?: FormItemProps['help'];
  extra?: FormItemProps['extra'];
  required?: boolean;
  validateStatus?: FormItemProps['validateStatus'];
  className?: string;
  textAreaProps?: Omit<
    AntdTextAreaProps,
    | 'value'
    | 'onChange'
    | 'data-testid'
    | 'aria-label'
    | 'placeholder'
    | 'rows'
    | 'disabled'
    | 'maxLength'
    | 'showCount'
  >;
}

export const TextAreaField = ({
  name,
  label,
  rules,
  testId,
  'aria-label': ariaLabel,
  placeholder,
  rows,
  disabled,
  maxLength,
  showCount,
  value,
  onChange,
  help,
  extra,
  required,
  validateStatus,
  className,
  textAreaProps,
}: TextAreaFieldProps) => {
  const isFormField = name !== undefined && name !== null;

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
      <Input.TextArea
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        showCount={showCount}
        aria-label={ariaLabel}
        data-testid={testId}
        {...textAreaProps}
        {...(isFormField ? {} : { value, onChange })}
      />
    </Form.Item>
  );
};
