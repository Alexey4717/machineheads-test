export interface PostState {
  items: unknown[];
}

export const postInitialState: PostState = {
  items: [],
};

export function postReducer(state: PostState = postInitialState): PostState {
  return state;
}
