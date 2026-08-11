import axios from 'axios';

import type {
  FieldValidationError,
  NormalizedApiError,
  SystemApiError,
} from './errorTypes';

function isFieldValidationError(value: unknown): value is FieldValidationError {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as FieldValidationError;
  return (
    typeof candidate.field === 'string' && typeof candidate.message === 'string'
  );
}

function isSystemApiError(value: unknown): value is SystemApiError {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as SystemApiError;
  return typeof candidate.message === 'string';
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (!axios.isAxiosError(error)) {
    return {
      kind: 'unknown',
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }

  const status = error.response?.status;
  const data = error.response?.data;

  if (
    status === 422 &&
    Array.isArray(data) &&
    data.every(isFieldValidationError)
  ) {
    return { kind: 'validation', status: 422, fields: data };
  }

  if (isSystemApiError(data)) {
    return {
      kind: 'system',
      status: status ?? data.status ?? 500,
      error: data,
    };
  }

  return {
    kind: 'unknown',
    status,
    message: error.message || 'Ошибка запроса',
  };
}

export function getErrorMessage(error: NormalizedApiError): string {
  if (error.kind === 'validation') {
    return error.fields[0]?.message || 'Ошибка валидации';
  }

  if (error.kind === 'system') {
    return error.error.message;
  }

  return error.message;
}
