import axios from 'axios';
import { BASE_URL } from '@/constants/API';

// const getAccessToken = () => {
//   return localStorage.getItem('accessToken') || '';
// };

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// headers: {
//   Authorization: getAccessToken() ? `Bearer ${getAccessToken()}` : '',
// },

// instance.interceptors.request.use((config) => {
//   const token = getAccessToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default instance;
