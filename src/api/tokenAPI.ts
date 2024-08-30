import { API_DEFAULT } from '@/constants/API';

import instance from './instance';

export const getToken = () => {
  return instance({
    method: 'GET',
    url: API_DEFAULT.TOKEN,
    headers: {
      Accept: 'application/json',
    },
  });
};
