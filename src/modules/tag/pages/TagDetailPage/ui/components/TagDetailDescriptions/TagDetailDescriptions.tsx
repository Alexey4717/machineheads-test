import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Descriptions } from 'antd';

import { formatDate } from '@/core/lib/formatDate/formatDate';

import { selectCurrentTag } from '../../../../../model/selectors';

/** Поля текущего тега. Сам сверяет id из URL с currentDetail. */
export const TagDetailDescriptions = () => {
  const params = useParams<{ id: string }>();
  const tagId = Number(params.id);
  const tag = useSelector(selectCurrentTag);

  if (!tag || tag.id !== tagId) {
    return null;
  }

  return (
    <Descriptions column={1} bordered size="middle">
      <Descriptions.Item label="ID">{tag.id}</Descriptions.Item>
      <Descriptions.Item label="Название">{tag.name}</Descriptions.Item>
      <Descriptions.Item label="Код">{tag.code}</Descriptions.Item>
      <Descriptions.Item label="Сортировка">{tag.sort}</Descriptions.Item>
      <Descriptions.Item label="Создан">
        {formatDate(tag.createdAt)}
      </Descriptions.Item>
      <Descriptions.Item label="Обновлён">
        {formatDate(tag.updatedAt)}
      </Descriptions.Item>
    </Descriptions>
  );
};
