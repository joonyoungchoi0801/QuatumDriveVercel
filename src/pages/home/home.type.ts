export interface ThumbnailData {
  createdAt: string;
  id: number;
  name: string;
  href: string;
  isFavorite: boolean;
  type: string | null;
  image?: string;
}

export interface FileData {
  id: number;
  name: string;
  volume: number | null;
  isEncrypted: boolean;
  userId: string;
  isDirectory: boolean;
  createdAt: string;
  extension: string | null;
  isFavorite: boolean;
  resourcekey: string;
  thumbnail: string | null;
}
