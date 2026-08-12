import type { FormInstance } from 'antd/es/form';

import type { NormalizedApiError } from '../../api/errorTypes';

/**
 * Пробрасывает 422 field-errors в antd Form через `setFields`.
 * Для прочих ошибок ничего не делает.
 */
export function applyFormFieldErrors(
  form: FormInstance,
  error: NormalizedApiError,
): void {
  if (error.kind !== 'validation') {
    return;
  }

  form.setFields(
    error.fields.map(({ field, message }) => ({
      name: field,
      errors: [message],
    })),
  );
}
