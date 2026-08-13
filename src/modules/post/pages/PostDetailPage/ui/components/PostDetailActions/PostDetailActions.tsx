import { useSelector, useStore } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { Button, Space } from 'antd';

import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import { useConfirmModal } from '@/core/ui/ConfirmModal/useConfirmModal';

import { selectCurrentPost } from '../../../../../model/selectors';
import { waitForPostRemove } from '../../../lib/waitForPostRemove';

/**
 * Действия деталки поста: редактирование и удаление с confirm.
 * Спиннер удаления — на OK модалки, не здесь.
 */
export const PostDetailActions = () => {
  const { confirm } = useConfirmModal();
  const store = useStore();
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const post = useSelector(selectCurrentPost);

  if (!post || post.id !== postId) {
    return null;
  }

  const onDelete = () => {
    confirm({
      title: 'Удалить пост?',
      content: `Пост «${post.title}» будет удалён без возможности восстановления.`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => waitForPostRemove(store, post.id),
    });
  };

  return (
    <Space wrap>
      <Link to={getPath(PATHS.POST_EDIT, { id: post.id })}>
        <Button>Редактировать</Button>
      </Link>
      <Button danger onClick={onDelete}>
        Удалить
      </Button>
    </Space>
  );
};
