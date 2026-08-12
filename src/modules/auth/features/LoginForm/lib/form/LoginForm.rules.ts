import { email, required } from '@/core/lib/formRules/formRules';

export const loginRules = {
  email: [required('Укажите e-mail'), email()],
  password: [required('Укажите пароль')],
};
