import type { Rule } from 'antd/es/form';

export const required = (message: string): Rule => ({
  required: true,
  message,
});

export const email = (message = 'Некорректный e-mail'): Rule => ({
  type: 'email',
  message,
});

export const minLen = (min: number, message: string): Rule => ({
  min,
  message,
});
