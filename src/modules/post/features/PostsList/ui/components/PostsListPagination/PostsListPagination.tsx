import { useSelector } from 'react-redux';

import { Pagination } from 'antd';
import { push } from 'connected-react-router';

import { PATHS } from '@/core/config/router/paths';
import { useAppDispatch } from '@/core/lib/hooks/useAppDispatch';

import {
  selectPostListStatus,
  selectPostPagination,
} from '../../../../../model/selectors';
import { useStyles } from './PostsListPagination.styles';

function buildPostsPagePath(page: number): string {
  return page <= 1 ? PATHS.POSTS : `${PATHS.POSTS}?page=${page}`;
}

/** antd Pagination, синхронизированная с `?page=` и meta из headers. */
export const PostsListPagination = () => {
  const dispatch = useAppDispatch();
  const pagination = useSelector(selectPostPagination);
  const listStatus = useSelector(selectPostListStatus);
  const { styles } = useStyles();

  if (!pagination || pagination.pageCount <= 1) {
    return null;
  }

  return (
    <div className={styles.root} data-testid="posts-list-pagination">
      <Pagination
        current={pagination.currentPage}
        total={pagination.totalCount}
        pageSize={pagination.perPage}
        showSizeChanger={false}
        disabled={listStatus === 'loading'}
        onChange={(page) => {
          dispatch(push(buildPostsPagePath(page)));
        }}
      />
    </div>
  );
};
