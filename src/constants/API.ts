export const BASE_URL = 'https://121.157.24.40:5300/';

export const API_FILE = Object.freeze({
  FILE: 'file/',
  KEYWORD: 'file/search',
  CACHE: 'file/insert',
  UPLOAD: 'file/upload',
  FILEINFO: (contentId: number) => `file/${contentId}`,
});

export const API_AUTH = Object.freeze({
  LOGIN: 'auth/login',
  SIGNUP: 'auth/signup',
});

export const API_PROFILE = Object.freeze({
  PROFILE: 'profile/',
});

export const API_TRASH = Object.freeze({
  TRASH: 'trashbin/',
  TRASHBIN: (contentId: number) => `trashbin/${contentId}`,
});

export const API_DEFAULT = Object.freeze({
  TOKEN: 'token',
});
