import { API_PROFILE } from '@/constants/API';

import instance from './instance';

export const getProfile = () => {
  return instance({
    method: 'GET',
    url: API_PROFILE.PROFILE,
    headers: {
      accept: 'application/json',
    },
  });
};
