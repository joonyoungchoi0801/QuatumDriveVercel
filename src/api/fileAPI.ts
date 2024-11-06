import { API_FILE } from '@/constants/API';

import instance from './instance';

export const getFile = (
  resourcekey: string | null,
  filter: string | null,
  offset: number | null,
  limit: number | null,
  order: string | null,
  ascending: boolean | null
) => {
  const params = {
    ...(resourcekey !== null && resourcekey !== undefined && { resourcekey }),
    ...(filter !== null && filter !== undefined && { filter }),
    ...(offset !== null && offset !== undefined && { offset }),
    ...(limit !== null && limit !== undefined && { limit }),
    ...(order !== null && order !== undefined && { order }),
    ...(ascending !== null && ascending !== undefined && { ascending }),
  };

  return instance({
    method: 'GET',
    url: API_FILE.FILE,
    params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getKeywordFile = (
  keyword: string,
  offset: number | null,
  limit: number | null,
  order: string | null,
  ascending: boolean | null
) => {
  const params = {
    keyword,
    ...(offset !== null && offset !== undefined && { offset }),
    ...(limit !== null && limit !== undefined && { limit }),
    ...(order !== null && order !== undefined && { order }),
    ...(ascending !== null && ascending !== undefined && { ascending }),
  };
  return instance({
    method: 'GET',
    url: API_FILE.KEYWORD,
    params,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const postFileCache = (
  name: string,
  resourceKey: string | null,
  isEncrypted: boolean,
  isDirectory: boolean,
  validationToken: string | null
) => {
  return instance({
    method: 'POST',
    url: API_FILE.CACHE,
    data: {
      name,
      resourceKey,
      isEncrypted,
      isDirectory,
      validationToken,
    },
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

export const postFileUpload = (
  file: File,
  onProgress: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('file', file);
  return instance({
    method: 'POST',
    url: API_FILE.UPLOAD,
    data: formData,
    headers: {
      accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (event) => {
      if (event.total) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        onProgress(percentCompleted);
      }
    },
  });
};

export const deleteFile = (contentId: number) => {
  return instance({
    method: 'DELETE',
    url: API_FILE.FILEINFO(contentId),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getDownloadFile = (contentId: number) => {
  return instance({
    method: 'GET',
    url: API_FILE.DOWNLOAD(contentId),
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  });
};

export const getPreviewFile = (contentId: number) => {
  return instance({
    method: 'GET',
    url: API_FILE.PREVIEW(contentId),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const postFavoriteFile = (contentId: number) => {
  return instance({
    method: 'POST',
    url: API_FILE.FAVORITE(contentId),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getFileDetailInfo = (contentId: number) => {
  return instance({
    method: 'GET',
    url: API_FILE.FILEINFO(contentId),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
