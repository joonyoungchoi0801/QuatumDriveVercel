import { useState } from 'react';

import styles from './thumbnail.module.scss';
import folder from '@/assets/file/folder.svg';
import imageIcon from '@/assets/file/img.svg';
import music from '@/assets/file/music.svg';
import pdf from '@/assets/file/pdf.svg';
import video from '@/assets/file/video.svg';
import word from '@/assets/file/word.svg';
import zip from '@/assets/file/zip.svg';
import excel from '@/assets/file/excel.svg';
import ppt from '@/assets/file/ppt.svg';
import file from '@/assets/file/file.svg';
import clickstar from '@/assets/file/clickstar.svg';
import square from '@/assets/file/square.svg';

interface ThumbnailProps {
  type: string;
  title: string;
  image?: string;
  isFavorite: boolean;
}

function Thumbnail({ type, title, image, isFavorite }: ThumbnailProps) {
  const [isHover, setIsHover] = useState(false);
  let thumb;
  if (type === 'folder') {
    thumb = folder;
  } else if (type === 'image') {
    thumb = image;
  } else if (type === 'music') {
    thumb = music;
  } else if (type === 'pdf') {
    thumb = pdf;
  } else if (type === 'video') {
    thumb = video;
  } else if (type === 'word') {
    thumb = word;
  } else if (type === 'zip') {
    thumb = zip;
  } else if (type === 'excel') {
    thumb = excel;
  } else if (type === 'ppt') {
    thumb = ppt;
  } else if (type === 'image') {
    thumb = imageIcon;
  } else {
    thumb = file;
  }

  return (
    <div className={styles.thumbnailWrapper}>
      <div
        className={styles.thumbnail}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <img src={thumb} className={styles.thumb} alt='thumbnail' />
        {isFavorite && (
          <img src={clickstar} alt='favorite' className={styles.favorite} />
        )}
        {/* {isHover && <img src={square} alt='square' className={styles.square} />} */}
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  );
}

export default Thumbnail;
