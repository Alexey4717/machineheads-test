import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Alert, Button, Form, Select } from 'antd';
import { push } from 'connected-react-router';

import { PATHS } from '@/core/config/router/paths';
import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { withReturnTo } from '@/core/lib/router/parseReturnTo';

import {
  selectTagListStatus,
  selectTagOptions,
  tagActions,
} from '@/modules/tag';

import { postFormRules } from '../../../lib/PostForm.rules';
import { useStyles } from './PostFormTagIdsField.styles';

export const PostFormTagIdsField = () => {
  const { styles } = useStyles();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const options = useSelector(selectTagOptions);
  const listStatus = useSelector(selectTagListStatus);

  const isLoading = listStatus === 'loading';
  const showEmptyAlert = listStatus === 'success' && options.length === 0;

  useEffect(() => {
    dispatch(tagActions.listRequest());
  }, [dispatch]);

  const onCreateTag = () => {
    const returnTo = `${location.pathname}${location.search}`;
    dispatch(push(withReturnTo(PATHS.TAG_CREATE, returnTo)));
  };

  return (
    <>
      <Form.Item
        name="tagIds"
        label="Теги"
        rules={postFormRules.tagIds}
        data-testid="post-tag-ids"
      >
        <Select
          mode="multiple"
          showSearch={{
            optionFilterProp: 'label',
          }}
          placeholder="Выберите теги"
          options={options}
          loading={isLoading}
          disabled={isLoading}
          allowClear
        />
      </Form.Item>
      {showEmptyAlert && (
        <Alert
          type="warning"
          showIcon
          title="Отсутствуют теги, необходимые для создания поста"
          className={styles.alert}
          data-testid="post-tag-empty-alert"
          action={
            <Button size="small" type="primary" onClick={onCreateTag}>
              Создать
            </Button>
          }
        />
      )}
    </>
  );
};
