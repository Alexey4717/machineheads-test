import type { ReactNode } from 'react';

import { Form, InputNumber } from 'antd';
import type { FormItemProps, Rule } from 'antd/es/form';
import type { NamePath } from 'antd/es/form/interface';
import type { InputNumberProps } from 'antd/es/input-number';

export interface NumberFieldProps {
  name?: NamePath;
  label?: ReactNode;
  rules?: Rule[];
  'data-testid': string;
  'aria-label'?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: number | null;
  onChange?: (value: number | null) => void;
  help?: FormItemProps['help'];
  extra?: FormItemProps['extra'];
  required?: boolean;
  validateStatus?: FormItemProps['validateStatus'];
  className?: string;
  inputProps?: Omit<
    InputNumberProps<number>,
    | 'value'
    | 'onChange'
    | 'data-testid'
    | 'aria-label'
    | 'placeholder'
    | 'disabled'
    | 'className'
    | 'defaultValue'
  >;
}

export const NumberField = ({
  name,
  label,
  rules,
  'data-testid': testId,
  'aria-label': ariaLabel,
  placeholder,
  disabled,
  value,
  onChange,
  help,
  extra,
  required,
  validateStatus,
  className,
  inputProps,
}: NumberFieldProps) => {
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
    >
      <InputNumber<number>
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        className={className}
        data-testid={testId}
        {...inputProps}
        {...(isFormField
          ? {}
          : {
              value: value ?? undefined,
              onChange,
            })}
      />
    </Form.Item>
  );
};
