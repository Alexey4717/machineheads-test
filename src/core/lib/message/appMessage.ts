import type { MessageInstance } from 'antd/es/message/interface';

export const APP_MESSAGE_ERROR_TEXT = 'Что-то пошло не так';

let messageApi: MessageInstance | null = null;

/** Регистрирует instance из `App.useApp()` (см. AppMessageHolder). */
export function setAppMessageApi(api: MessageInstance): void {
  messageApi = api;
}

export function appMessageSuccess(content: string): void {
  messageApi?.success(content);
}

/**
 * Toast об ошибке + `console.error` с исходной ошибкой.
 * Безопасно вызывать из саг и UI (no-op, пока holder не смонтирован).
 */
export function appMessageError(
  error: unknown,
  content: string = APP_MESSAGE_ERROR_TEXT,
): void {
  console.error(error);
  messageApi?.error(content);
}
