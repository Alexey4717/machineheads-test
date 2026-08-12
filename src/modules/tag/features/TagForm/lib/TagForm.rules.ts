import { required } from '@/core/lib/formRules/formRules';

export const tagFormRules = {
  code: [required('Укажите код')],
  name: [required('Укажите название')],
  sort: [
    required('Укажите сортировку'),
    { type: 'number' as const, message: 'Сортировка должна быть числом' },
  ],
};
