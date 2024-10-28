import { API_TRASH } from '@/constants/API';
import instance from './instance';

export const getTrash = () => {
  return instance({
    method: 'GET',
    url: API_TRASH.TRASH,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const postTrash = (deleteArray: number[]) => {
  const trashData = `lContentID=[${deleteArray.join(',')}]`;
  return instance({
    method: 'POST',
    url: API_TRASH.TRASH,
    data: trashData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const putTrash = (restoreId: number) => {
  return instance({
    method: 'PUT',
    url: API_TRASH.TRASHBIN(restoreId),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteTrash = (deleteId: number) => {
  return instance({
    method: 'DELETE',
    url: API_TRASH.TRASHBIN(deleteId),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteAllTrash = () => {
  return instance({
    method: 'DELETE',
    url: API_TRASH.TRASH,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
