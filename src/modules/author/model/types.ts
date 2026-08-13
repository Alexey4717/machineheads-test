import type { UploadFile } from 'antd/es/upload/interface';

import type { NormalizedApiError } from '@/core/api/errorTypes';
import type { RequestStatus } from '@/core/types/RequestStatus';

export interface AuthorAvatar {
  id: number;
  name: string;
  url: string;
}

export interface Author {
  id: number;
  name: string;
  lastName: string;
  secondName: string;
  avatar: AuthorAvatar | null;
  shortDescription?: string;
  description?: string;
  updatedAt: string;
  createdAt: string;
}

export interface AuthorFormValues {
  name: string;
  lastName: string;
  secondName: string;
  shortDescription: string;
  description: string;
  avatar?: UploadFile[];
  removeAvatar?: boolean;
}

export interface AuthorOption {
  value: number;
  label: string;
}

export interface AuthorState {
  entities: Record<number, Author>;
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
