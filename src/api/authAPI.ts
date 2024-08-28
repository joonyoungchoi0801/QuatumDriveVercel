import { API_AUTH } from '@/constants/API';

import logininstance from './logininstance';

export const postLogin = (username: string, password: string) => {
  const data = new URLSearchParams();
  data.append('grant_type', 'password');
  data.append('username', username);
  data.append('password', password);

  return logininstance({
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

export const postSignup = (
  email: string,
  phonenum: string,
  username: string,
  password: string
) => {
  return logininstance({
    method: 'POST',
    url: API_AUTH.SIGNUP,
    data: {
      email,
      phonenum,
      username,
      password,
    },
    headers: {
      accept: 'application/json',
    },
  });
};
