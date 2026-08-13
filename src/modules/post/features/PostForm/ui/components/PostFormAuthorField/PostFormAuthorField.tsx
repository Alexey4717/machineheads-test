import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Alert, Button } from 'antd';
import { push } from 'connected-react-router';

import { PATHS } from '@/core/config/router/paths';
import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';
import { withReturnTo } from '@/core/lib/router/parseReturnTo';
import { SelectField } from '@/core/ui/SelectField/SelectField';

import {
  authorActions,
  selectAuthorListStatus,
  selectAuthorOptions,
} from '@/modules/author';

import { postFormRules } from '../../../lib/PostForm.rules';
import { useStyles } from './PostFormAuthorField.styles';

export const PostFormAuthorField = () => {
  const { styles } = useStyles();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const options = useSelector(selectAuthorOptions);
  const listStatus = useSelector(selectAuthorListStatus);

  const isLoading = listStatus === 'loading';
  const showEmptyAlert = listStatus === 'success' && options.length === 0;

  useEffect(() => {
    dispatch(authorActions.listRequest());
  }, [dispatch]);

  const onCreateAuthor = () => {
    const returnTo = `${location.pathname}${location.search}`;
    dispatch(push(withReturnTo(PATHS.AUTHOR_CREATE, returnTo)));
  };

  return (
    <>
      <SelectField
        name="authorId"
        label="Автор"
        rules={postFormRules.authorId}
        showSearch={{
          optionFilterProp: 'label',
        }}
        placeholder="Выберите автора"
        options={options}
        loading={isLoading}
        disabled={isLoading}
        allowClear
        data-testid="postForm_select_authorId"
      />
      {showEmptyAlert && (
        <Alert
          type="warning"
          showIcon
          title="Отсутствуют авторы, необходимые для создания поста"
          className={styles.alert}
          data-testid="post-author-empty-alert"
          action={
            <Button
              size="small"
              type="primary"
              onClick={onCreateAuthor}
              data-testid="postForm_button_onCreateAuthor"
            >
              Создать
            </Button>
          }
        />
      )}
    </>
  );
};
