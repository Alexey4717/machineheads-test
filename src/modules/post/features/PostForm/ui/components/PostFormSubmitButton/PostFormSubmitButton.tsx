import { useSelector } from 'react-redux';

import { Button, Form } from 'antd';

import { selectPostIsSubmitting } from '../../../../../model/selectors';

export interface PostFormSubmitButtonProps {
  mode: 'create' | 'edit';
}

export const PostFormSubmitButton = ({ mode }: PostFormSubmitButtonProps) => {
  const isSubmitting = useSelector(selectPostIsSubmitting);

  return (
    <Form.Item>
      <Button type="primary" htmlType="submit" loading={isSubmitting}>
        {mode === 'edit' ? 'Сохранить' : 'Создать'}
      </Button>
    </Form.Item>
  );
};
