import type { NormalizedApiError } from '@/core/api/errorTypes';

export type TagRequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface Tag {
  id: number;
  name: string;
  code: string;
  sort: number;
  updatedAt: string;
  createdAt: string;
}

export interface TagFormValues {
  code: string;
  name: string;
  sort: number;
}

export interface TagOption {
  value: number;
  label: string;
}

export interface TagState {
  entities: Record<number, Tag>;
  listIds: number[];
  listStatus: TagRequestStatus;
  listError: NormalizedApiError | null;
  detailStatus: TagRequestStatus;
  detailError: NormalizedApiError | null;
  currentDetailId: number | null;
  submitStatus: TagRequestStatus;
  submitError: NormalizedApiError | null;
  removeStatus: TagRequestStatus;
  removeError: NormalizedApiError | null;
}
