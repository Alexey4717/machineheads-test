import type { UploadFile } from 'antd/es/upload/interface';

import type { NormalizedApiError } from '@/core/api/errorTypes';
import type { PaginationMeta } from '@/core/api/parsePaginationHeaders';
import type { RequestStatus } from '@/core/types/RequestStatus';

export interface PostFile {
  id: number;
  name: string;
  url: string;
}

export interface PostAuthorRef {
  id: number;
  fullName: string;
  avatar: PostFile | null;
}

export interface PostTagRef {
  id: number;
  name: string;
  code: string;
}

/**
 * Пост в store: list и detail поля объединены.
 * List: authorName, tagNames; detail: text, author, tags.
 */
export interface Post {
  id: number;
  title: string;
  code: string;
  previewPicture: PostFile | null;
  updatedAt: string;
  createdAt: string;
  authorName?: string;
  tagNames?: string[];
  text?: string;
  author?: PostAuthorRef;
  tags?: PostTagRef[];
}

export interface PostFormValues {
  title: string;
  code: string;
  authorId: number;
  tagIds: number[];
  text: string;
  previewPicture?: UploadFile[];
}

export interface PostsListResult {
  items: Post[];
  pagination: PaginationMeta;
}

export interface PostListPageCache {
  ids: number[];
  fetchedAt: number;
  pagination: PaginationMeta;
}

export interface PostState {
  entities: Record<number, Post>;
  listIds: number[];
  pagination: PaginationMeta | null;
  detailFetchedAt: Record<number, number>;
  listCacheByPage: Record<number, PostListPageCache>;
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
