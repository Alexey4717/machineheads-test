import type { ReactNode } from 'react';

import { Form, Select } from 'antd';
import type { FormItemProps, Rule } from 'antd/es/form';
import type { NamePath } from 'antd/es/form/interface';
import type { DefaultOptionType, SelectProps } from 'antd/es/select';

export interface SelectFieldProps {
  name?: NamePath;
  label?: ReactNode;
  rules?: Rule[];
  'data-testid': string;
  'aria-label'?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  options?: DefaultOptionType[];
  allowClear?: boolean;
  showSearch?: SelectProps['showSearch'];
  mode?: SelectProps['mode'];
  className?: string;
  value?: SelectProps['value'];
  onChange?: SelectProps['onChange'];
  help?: FormItemProps['help'];
  extra?: FormItemProps['extra'];
  required?: boolean;
  validateStatus?: FormItemProps['validateStatus'];
  selectProps?: Omit<
    SelectProps,
    | 'value'
    | 'onChange'
    | 'data-testid'
    | 'aria-label'
    | 'placeholder'
    | 'disabled'
    | 'loading'
    | 'options'
    | 'allowClear'
    | 'showSearch'
    | 'mode'
    | 'className'
  >;
}

export const SelectField = ({
  name,
  label,
  rules,
  'data-testid': testId,
  'aria-label': ariaLabel,
  placeholder,
  disabled,
  loading,
  options,
  allowClear,
  showSearch,
  mode,
  className,
  value,
  onChange,
  help,
  extra,
  required,
  validateStatus,
  selectProps,
}: SelectFieldProps) => {
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
      <Select
        placeholder={placeholder}
        disabled={disabled}
        loading={loading}
        options={options}
        allowClear={allowClear}
        showSearch={showSearch}
        mode={mode}
        aria-label={ariaLabel}
        data-testid={testId}
        {...selectProps}
        {...(isFormField ? {} : { value, onChange })}
      />
    </Form.Item>
  );
};
