import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Avatar, Descriptions } from 'antd';

import { formatDate } from '@/core/lib/formatDate/formatDate';

import { selectCurrentAuthor } from '../../../../../model/selectors';
import { useStyles } from './AuthorDetailDescriptions.styles';

/** Поля текущего автора. Сам сверяет id из URL с currentDetail. */
export const AuthorDetailDescriptions = () => {
  const params = useParams<{ id: string }>();
  const authorId = Number(params.id);
  const author = useSelector(selectCurrentAuthor);
  const { styles } = useStyles();

  if (!author || author.id !== authorId) {
    return null;
  }

  return (
    <Descriptions className={styles.root} column={1} bordered size="middle">
      <Descriptions.Item label="ID">{author.id}</Descriptions.Item>
      <Descriptions.Item label="Фамилия">{author.lastName}</Descriptions.Item>
      <Descriptions.Item label="Имя">{author.name}</Descriptions.Item>
      <Descriptions.Item label="Отчество">
        {author.secondName}
      </Descriptions.Item>
      <Descriptions.Item label="Аватар">
        {author.avatar?.url ? (
          <Avatar src={author.avatar.url} size={64} />
        ) : (
          '—'
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Краткое описание">
        {author.shortDescription || '—'}
      </Descriptions.Item>
      <Descriptions.Item label="Описание">
        {author.description || '—'}
      </Descriptions.Item>
      <Descriptions.Item label="Создан">
        {formatDate(author.createdAt)}
      </Descriptions.Item>
      <Descriptions.Item label="Обновлён">
        {formatDate(author.updatedAt)}
      </Descriptions.Item>
    </Descriptions>
  );
};
