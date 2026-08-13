import { useEffect } from 'react';

import { Form } from 'antd';

import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { ImageUploadField } from '@/core/ui/ImageUploadField/ImageUploadField';
import { TextAreaField } from '@/core/ui/TextAreaField/TextAreaField';
import { TextField } from '@/core/ui/TextField/TextField';

import { postActions } from '../../../model/actions';
import type { PostFormValues } from '../../../model/types';
import { postFormRules } from '../lib/PostForm.rules';
import { PostFormAuthorField } from './components/PostFormAuthorField/PostFormAuthorField';
import { PostFormSubmitButton } from './components/PostFormSubmitButton/PostFormSubmitButton';
import { PostFormSubmitError } from './components/PostFormSubmitError/PostFormSubmitError';
import { PostFormTagIdsField } from './components/PostFormTagIdsField/PostFormTagIdsField';
import { useStyles } from './PostForm.styles';

export interface PostFormProps {
  mode: 'create' | 'edit';
  postId?: number;
  initialValues?: Partial<PostFormValues>;
}

export const PostForm = ({ mode, postId, initialValues }: PostFormProps) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<PostFormValues>();
  const { styles } = useStyles();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  const onFinish = (values: PostFormValues) => {
    if (mode === 'edit') {
      if (postId == null) {
        return;
      }

      dispatch(postActions.updateRequest({ id: postId, values }));
      return;
    }

    dispatch(postActions.createRequest(values));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className={styles.form}
      initialValues={{
        tagIds: [],
        ...initialValues,
      }}
    >
      <PostFormSubmitError />

      <TextField
        name="title"
        label="Название"
        rules={postFormRules.title}
        data-testid="postForm_input_title"
        placeholder="Название поста"
      />

      <TextField
        name="code"
        label="Код"
        rules={postFormRules.code}
        data-testid="postForm_input_code"
        placeholder="post-code"
      />

      <PostFormAuthorField />

      <PostFormTagIdsField />

      <TextAreaField
        name="text"
        label="Текст"
        rules={postFormRules.text}
        data-testid="postForm_input_text"
        rows={6}
        placeholder="Текст поста"
      />

      <ImageUploadField
        name="previewPicture"
        label="Превью"
        rules={postFormRules.previewPicture}
        data-testid="postForm_upload_previewPicture"
        tip="JPG/PNG, один файл"
      />

      <PostFormSubmitButton mode={mode} />
    </Form>
  );
};
