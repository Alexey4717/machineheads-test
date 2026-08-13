import { useEffect } from 'react';

import { Form } from 'antd';

import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { NumberField } from '@/core/ui/NumberField/NumberField';
import { TextField } from '@/core/ui/TextField/TextField';

import { tagActions } from '../../../model/actions';
import type { TagFormValues } from '../../../model/types';
import { tagFormRules } from '../lib/TagForm.rules';
import { TagFormSubmitButton } from './components/TagFormSubmitButton/TagFormSubmitButton';
import { TagFormSubmitError } from './components/TagFormSubmitError/TagFormSubmitError';
import { useStyles } from './TagForm.styles';

export interface TagFormProps {
  mode: 'create' | 'edit';
  tagId?: number;
  initialValues?: Partial<TagFormValues>;
}

export const TagForm = ({ mode, tagId, initialValues }: TagFormProps) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<TagFormValues>();
  const { styles } = useStyles();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  const onFinish = (values: TagFormValues) => {
    if (mode === 'edit') {
      if (tagId == null) {
        return;
      }

      dispatch(tagActions.updateRequest({ id: tagId, values }));
      return;
    }

    dispatch(tagActions.createRequest(values));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className={styles.form}
      initialValues={initialValues}
    >
      <TagFormSubmitError />

      <TextField
        name="name"
        label="Название"
        rules={tagFormRules.name}
        data-testid="tagForm_input_name"
        placeholder="Название тега"
      />

      <TextField
        name="code"
        label="Код"
        rules={tagFormRules.code}
        data-testid="tagForm_input_code"
        placeholder="tag-code"
      />

      <NumberField
        name="sort"
        label="Сортировка"
        rules={tagFormRules.sort}
        data-testid="tagForm_input_sort"
        className={styles.sortInput}
        placeholder="0"
      />

      <TagFormSubmitButton mode={mode} />
    </Form>
  );
};
