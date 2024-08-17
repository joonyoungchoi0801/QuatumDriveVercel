import { API_AUTH } from '@/constants/API';

import instance from './instance';

export const postLogin = (username: string, password: string) => {
  const data = new URLSearchParams();
  data.append('grant_type', 'password');
  data.append('username', username);
  data.append('password', password);

  return instance({
    method: 'POST',
    url: API_AUTH.LOGIN,
    data,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  });
};
