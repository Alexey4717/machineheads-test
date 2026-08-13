import type { RcFile } from 'antd/es/upload/interface';
import { describe, expect, it } from 'vitest';

import type { PostFormValues } from '../model/types';
import { toPostFormData } from './postsApi';

function entriesOf(formData: FormData): [string, FormDataEntryValue][] {
  return Array.from(formData.entries());
}

describe('toPostFormData', () => {
  const basePayload: PostFormValues = {
    code: 'post-code',
    title: 'Post title',
    authorId: 42,
    tagIds: [116, 109],
    text: 'Body',
  };

  it('сериализует tagIds как tagIds[] (Yii2 multipart)', () => {
    const formData = toPostFormData(basePayload);
    const tagEntries = entriesOf(formData).filter(([key]) =>
      key.startsWith('tagIds'),
    );

    expect(tagEntries).toEqual([
      ['tagIds[]', '116'],
      ['tagIds[]', '109'],
    ]);
  });

  it('отправляет authorId строкой целого числа', () => {
    const formData = toPostFormData(basePayload);
    expect(formData.get('authorId')).toBe('42');
  });

  it('аппендит File из previewPicture[0].originFileObj', () => {
    const file = new File(['img'], 'preview.png', {
      type: 'image/png',
    }) as RcFile;
    const formData = toPostFormData({
      ...basePayload,
      previewPicture: [
        {
          uid: '1',
          name: 'preview.png',
          originFileObj: file,
        },
      ],
    });

    expect(formData.get('previewPicture')).toBe(file);
  });

  it('не аппендит previewPicture без originFileObj', () => {
    const formData = toPostFormData({
      ...basePayload,
      previewPicture: [{ uid: '1', name: 'preview.png', url: '/old.png' }],
    });

    expect(formData.get('previewPicture')).toBeNull();
  });
});
