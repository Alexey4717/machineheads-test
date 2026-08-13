import type { NormalizedApiError } from '@/core/api/errorTypes';
import type { RequestStatus } from '@/core/types/RequestStatus';

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
  detailFetchedAt: Record<number, number>;
  listFetchedAt: number | null;
  listStatus: RequestStatus;
  listError: NormalizedApiError | null;
  detailStatus: RequestStatus;
  detailError: NormalizedApiError | null;
  currentDetailId: number | null;
  submitStatus: RequestStatus;
  submitError: NormalizedApiError | null;
  removeStatus: RequestStatus;
  removeError: NormalizedApiError | null;
}
