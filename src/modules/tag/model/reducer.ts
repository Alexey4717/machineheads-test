export interface TagState {
  items: unknown[];
}

export const tagInitialState: TagState = {
  items: [],
};

export function tagReducer(state: TagState = tagInitialState): TagState {
  return state;
}
