import { required } from '@/core/lib/formRules/formRules';

export const authorFormRules = {
  name: [required('Укажите имя')],
  lastName: [required('Укажите фамилию')],
  secondName: [required('Укажите отчество')],
  shortDescription: [required('Укажите краткое описание')],
  description: [required('Укажите описание')],
};
