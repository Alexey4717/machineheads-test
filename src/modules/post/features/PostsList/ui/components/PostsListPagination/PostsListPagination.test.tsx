import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { push } from 'connected-react-router';
import { describe, expect, it, vi } from 'vitest';

import { componentRender } from '@/__test__/componentRender';

import { postInitialState, postReducer } from '../../../../../model/reducer';
import { PostsListPagination } from './PostsListPagination';

vi.mock('./PostsListPagination.styles', () => ({
  useStyles: () => ({
    styles: {
      root: 'pagination',
    },
  }),
}));

describe('PostsListPagination', () => {
  it('по клику на страницу диспатчит push с ?page=', async () => {
    const user = userEvent.setup();
    const dispatchSpy = vi.fn();

    componentRender(<PostsListPagination />, {
      reducers: { post: postReducer },
      preloadedState: {
        post: {
          ...postInitialState,
          listStatus: 'success',
          pagination: {
            currentPage: 1,
            pageCount: 3,
            perPage: 10,
            totalCount: 25,
          },
        },
      },
      dispatchSpy,
    });

    const page2 = screen
      .getByTestId('posts-list-pagination')
      .querySelector('.ant-pagination-item-2');

    expect(page2).toBeTruthy();
    await user.click(page2!);

    expect(dispatchSpy).toHaveBeenCalledWith(push('/posts?page=2'));
  });
});
