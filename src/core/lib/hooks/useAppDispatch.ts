import { useDispatch } from 'react-redux';

/**
 * Typed dispatch for react-redux
 * Relies on global `AppDispatch` from `app/store/types.d.ts`.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
