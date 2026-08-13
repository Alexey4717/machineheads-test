import { useSelector } from 'react-redux';

import { selectPostList, selectPostPagination } from '../../../model/selectors';
import { PostsListCard } from './components/PostsListCard/PostsListCard';
import { PostsListEmpty } from './components/PostsListEmpty/PostsListEmpty';
import { PostsListHeader } from './components/PostsListHeader/PostsListHeader';
import { PostsListPagination } from './components/PostsListPagination/PostsListPagination';
import { useStyles } from './PostsList.styles';

/** Список постов + пагинация. Empty — только на первой странице без элементов. */
export const PostsList = () => {
  const posts = useSelector(selectPostList);
  const pagination = useSelector(selectPostPagination);
  const { styles } = useStyles();
  const currentPage = pagination?.currentPage ?? 1;

  if (posts.length === 0 && currentPage <= 1) {
    return <PostsListEmpty />;
  }

  return (
    <div className={styles.root} data-testid="posts-list">
      {posts.length > 0 ? (
        <>
          <PostsListHeader />
          {posts.map((post) => (
            <PostsListCard key={post.id} post={post} />
          ))}
        </>
      ) : null}
      <PostsListPagination />
    </div>
  );
};
