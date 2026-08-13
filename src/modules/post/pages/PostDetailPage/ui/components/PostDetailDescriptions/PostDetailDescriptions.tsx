import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Avatar, Descriptions, Image, Tag } from 'antd';

import { formatDate } from '@/core/lib/formatDate/formatDate';

import { selectCurrentPost } from '../../../../../model/selectors';
import { useStyles } from './PostDetailDescriptions.styles';

/** Поля текущего поста. Сам сверяет id из URL с currentDetail. */
export const PostDetailDescriptions = () => {
  const params = useParams<{ id: string }>();
  const postId = Number(params.id);
  const post = useSelector(selectCurrentPost);
  const { styles } = useStyles();

  if (!post || post.id !== postId) {
    return null;
  }

  return (
    <Descriptions column={1} bordered size="middle">
      <Descriptions.Item label="ID">{post.id}</Descriptions.Item>
      <Descriptions.Item label="Название">{post.title}</Descriptions.Item>
      <Descriptions.Item label="Код">{post.code}</Descriptions.Item>
      <Descriptions.Item label="Текст">{post.text || '—'}</Descriptions.Item>
      <Descriptions.Item label="Автор">
        {post.author ? (
          <span className={styles.author}>
            {post.author.avatar?.url ? (
              <Avatar src={post.author.avatar.url} size={32} />
            ) : null}
            {post.author.fullName}
          </span>
        ) : (
          (post.authorName ?? '—')
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Теги">
        {post.tags && post.tags.length > 0
          ? post.tags.map((tag) => <Tag key={tag.id}>{tag.name}</Tag>)
          : (post.tagNames ?? []).join(', ') || '—'}
      </Descriptions.Item>
      <Descriptions.Item label="Превью">
        {post.previewPicture?.url ? (
          <Image
            src={post.previewPicture.url}
            alt={post.previewPicture.name}
            width={120}
          />
        ) : (
          '—'
        )}
      </Descriptions.Item>
      <Descriptions.Item label="Создан">
        {formatDate(post.createdAt)}
      </Descriptions.Item>
      <Descriptions.Item label="Обновлён">
        {formatDate(post.updatedAt)}
      </Descriptions.Item>
    </Descriptions>
  );
};
