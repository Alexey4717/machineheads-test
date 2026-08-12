import { App } from 'antd';

import { setAppMessageApi } from './appMessage';

/**
 * Мост App.useApp() → модульный ref для саг/не-React кода.
 * Паттерн antd «Global scene (redux)» — https://ant.design/components/app
 */
export const AppMessageHolder = () => {
  const { message } = App.useApp();
  setAppMessageApi(message);
  return null;
};
