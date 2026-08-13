import { describe, expect, it } from 'vitest';

import { postFormRules } from './PostForm.rules';

describe('postFormRules', () => {
  it('title: required', () => {
    expect(postFormRules.title).toEqual([
      { required: true, message: 'Укажите название' },
    ]);
  });

  it('code: required', () => {
    expect(postFormRules.code).toEqual([
      { required: true, message: 'Укажите код' },
    ]);
  });

  it('authorId: required', () => {
    expect(postFormRules.authorId).toEqual([
      { required: true, message: 'Выберите автора' },
    ]);
  });

  it('tagIds: required array min 1', () => {
    expect(postFormRules.tagIds).toEqual([
      {
        required: true,
        type: 'array',
        min: 1,
        message: 'Выберите хотя бы один тег',
      },
    ]);
  });

  it('text: required', () => {
    expect(postFormRules.text).toEqual([
      { required: true, message: 'Укажите текст' },
    ]);
  });

  it('previewPicture: required array min 1', () => {
    expect(postFormRules.previewPicture).toEqual([
      {
        required: true,
        type: 'array',
        min: 1,
        message: 'Необходимо заполнить «Изображение».',
      },
    ]);
  });
});
