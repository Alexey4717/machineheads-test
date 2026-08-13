import { useSelector, useStore } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { Button, Space } from 'antd';

import { getPath } from '@/core/config/router/getPath';
import { PATHS } from '@/core/config/router/paths';
import { useConfirmModal } from '@/core/ui/ConfirmModal/useConfirmModal';

import { selectCurrentTag } from '../../../../../model/selectors';
import { waitForTagRemove } from '../../../lib/waitForTagRemove';

/**
 * Действия деталки тега: редактирование и удаление с confirm.
 * Сам подписывается на current tag. Спиннер удаления — на OK модалки, не здесь.
 */
export const TagDetailActions = () => {
  const { confirm } = useConfirmModal();
  const store = useStore();
  const params = useParams<{ id: string }>();
  const tagId = Number(params.id);
  const tag = useSelector(selectCurrentTag);

  if (!tag || tag.id !== tagId) {
    return null;
  }

  const onDelete = () => {
    confirm({
      title: 'Удалить тег?',
      content: `Тег «${tag.name}» будет удалён без возможности восстановления.`,
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => waitForTagRemove(store, tag.id),
    });
  };

  return (
    <Space wrap>
      <Link
        to={getPath(PATHS.TAG_EDIT, { id: tag.id })}
        data-testid="tagDetail_link_TAG_EDIT"
      >
        <Button>Редактировать</Button>
      </Link>
      <Button danger onClick={onDelete} data-testid="tagDetail_button_onDelete">
        Удалить
      </Button>
    </Space>
  );
};
