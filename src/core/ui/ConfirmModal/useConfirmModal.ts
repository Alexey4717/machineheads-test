import { useContext } from 'react';

import {
  ConfirmModalContext,
  type ConfirmModalContextValue,
} from './ConfirmModalContext';

export const useConfirmModal = (): ConfirmModalContextValue => {
  const context = useContext(ConfirmModalContext);

  if (!context) {
    throw new Error('useConfirmModal must be used within ConfirmModalProvider');
  }

  return context;
};
