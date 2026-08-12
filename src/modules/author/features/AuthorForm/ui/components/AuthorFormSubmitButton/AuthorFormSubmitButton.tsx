import { useSelector } from 'react-redux';

import { Button, Form } from 'antd';

import { selectAuthorIsSubmitting } from '../../../../../model/selectors';

export interface AuthorFormSubmitButtonProps {
  mode: 'create' | 'edit';
}

export const AuthorFormSubmitButton = ({
  mode,
}: AuthorFormSubmitButtonProps) => {
  const isSubmitting = useSelector(selectAuthorIsSubmitting);

  return (
    <Form.Item>
      <Button type="primary" htmlType="submit" loading={isSubmitting}>
        {mode === 'edit' ? 'Сохранить' : 'Создать'}
      </Button>
    </Form.Item>
  );
};
