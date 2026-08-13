/** Search-строка из connected-react-router. */
export const selectRouterSearch = (state: RootState): string =>
  state.router.location.search;
