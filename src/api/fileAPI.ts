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
    withCredentials: true,
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
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
