import type { ComponentType, ReactNode } from 'react';

import {
  DynamicModuleLoader as BaseDynamicModuleLoader,
  type IDynamicModuleLoaderProps,
} from 'redux-dynamic-modules-react';

interface DynamicModuleLoaderProps extends IDynamicModuleLoaderProps {
  children?: ReactNode;
}

const Loader =
  BaseDynamicModuleLoader as unknown as ComponentType<DynamicModuleLoaderProps>;

/**
 * Typed wrapper around redux-dynamic-modules DynamicModuleLoader.
 * Library typings predate React 18 explicit children; Strict Mode needs `strictMode`.
 */
export const DynamicModuleLoader = ({
  children,
  strictMode = true,
  ...props
}: DynamicModuleLoaderProps) => {
  return (
    <Loader {...props} strictMode={strictMode}>
      {children}
    </Loader>
  );
};
