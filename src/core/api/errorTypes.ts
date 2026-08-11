export interface FieldValidationError {
  field: string;
  message: string;
}

export interface SystemApiError {
  name?: string;
  message: string;
  code?: number;
  status?: number;
  type?: string;
}

export type NormalizedApiError =
  | { kind: 'validation'; status: 422; fields: FieldValidationError[] }
  | { kind: 'system'; status: number; error: SystemApiError }
  | { kind: 'unknown'; status?: number; message: string };
