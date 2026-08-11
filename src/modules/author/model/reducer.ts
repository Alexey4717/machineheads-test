export interface AuthorState {
  items: unknown[];
}

export const authorInitialState: AuthorState = {
  items: [],
};

export function authorReducer(
  state: AuthorState = authorInitialState,
): AuthorState {
  return state;
}
