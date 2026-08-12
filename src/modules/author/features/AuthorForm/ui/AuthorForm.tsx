import { useEffect } from 'react';

import { Form } from 'antd';

import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { TextAreaField } from '@/core/ui/TextAreaField/TextAreaField';
import { TextField } from '@/core/ui/TextField/TextField';

import { authorActions } from '../../../model/actions';
import type { AuthorFormValues } from '../../../model/types';
import { authorFormRules } from '../lib/AuthorForm.rules';
import { useStyles } from './AuthorForm.styles';
import { AuthorFormAvatarField } from './components/AuthorFormAvatarField/AuthorFormAvatarField';
import { AuthorFormSubmitButton } from './components/AuthorFormSubmitButton/AuthorFormSubmitButton';
import { AuthorFormSubmitError } from './components/AuthorFormSubmitError/AuthorFormSubmitError';

export interface AuthorFormProps {
  mode: 'create' | 'edit';
  authorId?: number;
  initialValues?: Partial<AuthorFormValues>;
}

export const AuthorForm = ({
  mode,
  authorId,
  initialValues,
}: AuthorFormProps) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<AuthorFormValues>();
  const { styles } = useStyles();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  const onFinish = (values: AuthorFormValues) => {
    const payload: AuthorFormValues = {
      ...values,
      removeAvatar: Boolean(form.getFieldValue('removeAvatar')),
    };

    if (mode === 'edit') {
      if (authorId == null) {
        return;
      }

      dispatch(authorActions.updateRequest({ id: authorId, values: payload }));
      return;
    }

    dispatch(authorActions.createRequest(payload));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className={styles.form}
      initialValues={{
        removeAvatar: false,
        ...initialValues,
      }}
    >
      <AuthorFormSubmitError />

      <TextField
        name="lastName"
        label="Фамилия"
        rules={authorFormRules.lastName}
        testId="author-last-name"
        placeholder="Иванов"
      />

      <TextField
        name="name"
        label="Имя"
        rules={authorFormRules.name}
        testId="author-name"
        placeholder="Иван"
      />

      <TextField
        name="secondName"
        label="Отчество"
        rules={authorFormRules.secondName}
        testId="author-second-name"
        placeholder="Иванович"
      />

      <TextAreaField
        name="shortDescription"
        label="Краткое описание"
        rules={authorFormRules.shortDescription}
        testId="author-short-description"
        rows={3}
        placeholder="Кратко об авторе"
      />

      <TextAreaField
        name="description"
        label="Описание"
        rules={authorFormRules.description}
        testId="author-description"
        rows={5}
        placeholder="Полное описание"
      />

      <AuthorFormAvatarField />

      <AuthorFormSubmitButton mode={mode} />
    </Form>
  );
};
