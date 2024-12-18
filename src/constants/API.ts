export const BASE_URL = 'https://121.157.24.40:5300/';

export const API_FILE = Object.freeze({
  FILE: 'file/',
  KEYWORD: 'file/search',
  CACHE: 'file/insert',
  UPLOAD: 'file/upload',
  FILEINFO: (contentId: number) => `file/${contentId}`,
  DOWNLOAD: (contentId: number) => `file/download/${contentId}`,
  PREVIEW: (contentId: number) => `file/preview/${contentId}`,
  FAVORITE: (contentId: number) => `file/favorite/${contentId}`,
});

export const API_AUTH = Object.freeze({
  LOGIN: 'auth/login',
  SIGNUP: 'auth/signup',
  LOGOUT: 'auth/logout',
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
