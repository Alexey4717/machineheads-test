import { useSelector, useStore } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { Button, Space } from 'antd';

import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import { useConfirmModal } from '@/core/ui/ConfirmModal/useConfirmModal';

import { formatAuthorName } from '../../../../../model/formatAuthorName';
import { selectCurrentAuthor } from '../../../../../model/selectors';
import { waitForAuthorRemove } from '../../../lib/waitForAuthorRemove';

/**
 * Действия деталки автора: редактирование и удаление с confirm.
 * Сам подписывается на current author. Спиннер удаления — на OK модалки, не здесь.
 */
export const AuthorDetailActions = () => {
  const { confirm } = useConfirmModal();
  const store = useStore();
  const params = useParams<{ id: string }>();
  const authorId = Number(params.id);
  const author = useSelector(selectCurrentAuthor);

  if (!author || author.id !== authorId) {
    return null;
  }

  const fullName = formatAuthorName(author);

  const onDelete = () => {
    confirm({
      title: 'Удалить автора?',
      content: `Автор «${fullName}» будет удалён без возможности восстановления.`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => waitForAuthorRemove(store, author.id),
    });
  };

  return (
    <Space wrap>
      <Link
        to={getPath(PATHS.AUTHOR_EDIT, { id: author.id })}
        data-testid="authorDetail_link_AUTHOR_EDIT"
      >
        <Button>Редактировать</Button>
      </Link>
      <Button
        danger
        onClick={onDelete}
        data-testid="authorDetail_button_onDelete"
      >
        Удалить
      </Button>
    </Space>
  );
};
