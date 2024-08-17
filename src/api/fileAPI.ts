import { API_FILE } from '@/constants/API';

import instance from './instance';

export const getFile = (
  resourcekey: string | null,
  id: number | null,
  name: string | null,
  isEncrypted: boolean | null,
  isDirectory: boolean | null
) => {
  const params = {
    ...(resourcekey !== null && resourcekey !== undefined && { resourcekey }),
    ...(id !== null && id !== undefined && { id }),
    ...(name !== null && name !== undefined && { name }),
    ...(isEncrypted !== null && isEncrypted !== undefined && { isEncrypted }),
    ...(isDirectory !== null && isDirectory !== undefined && { isDirectory }),
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
