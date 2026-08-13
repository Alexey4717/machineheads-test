import { createSelector } from 'reselect';

export const selectRouterState = (state: RootState) => state.router;

/** Search-строка из connected-react-router. */
export const selectRouterSearch = createSelector(
  selectRouterState,
  (router): string => router.location.search,
);
