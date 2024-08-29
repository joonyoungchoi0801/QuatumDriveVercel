import { API_TRASH } from '@/constants/API';
import instance from './instance';

export const getTrash = () => {
  return instance({
    method: 'GET',
    url: API_TRASH.TRASH,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const postTrash = (contentId: number) => {
  return instance({
    method: 'POST',
    url: API_TRASH.TRASHBIN(contentId),
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
