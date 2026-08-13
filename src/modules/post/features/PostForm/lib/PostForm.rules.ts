import { required } from '@/core/lib/formRules/formRules';

export const postFormRules = {
  title: [required('Укажите название')],
  code: [required('Укажите код')],
  authorId: [required('Выберите автора')],
  tagIds: [
    {
      required: true,
      type: 'array' as const,
      min: 1,
      message: 'Выберите хотя бы один тег',
    },
  ],
  text: [required('Укажите текст')],
  previewPicture: [
    {
      required: true,
      type: 'array' as const,
      min: 1,
      message: 'Необходимо заполнить «Изображение».',
    },
  ],
};
