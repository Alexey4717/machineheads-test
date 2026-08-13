import { useSelector } from 'react-redux';

import { Button, Form } from 'antd';

import { selectTagIsSubmitting } from '../../../../../model/selectors';

export interface TagFormSubmitButtonProps {
  mode: 'create' | 'edit';
}

export const TagFormSubmitButton = ({ mode }: TagFormSubmitButtonProps) => {
  const isSubmitting = useSelector(selectTagIsSubmitting);

  return (
    <Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        loading={isSubmitting}
        data-testid="tagForm_button_submit"
      >
        {mode === 'edit' ? 'Сохранить' : 'Создать'}
      </Button>
    </Form.Item>
  );
};
