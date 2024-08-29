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
import checkbox from '@/assets/file/checkbox.svg';
import checkedbox from '@/assets/file/checkedbox.svg';
import { useNavigate } from 'react-router-dom';

interface ThumbnailProps {
  type: string | null;
  name: string;
  image?: string;
  isFavorite: boolean;
  href: string;
  isChecked: boolean;
  onClick?: () => void;
}

function Thumbnail({
  type,
  name,
  image,
  isFavorite,
  href,
  isChecked,
  onClick,
}: ThumbnailProps) {
  const [isHover, setIsHover] = useState(false);
  const navigate = useNavigate();
  const handleThumbnailClick = () => {
    navigate(href);
  };
  const checkboxIcon = isChecked ? checkedbox : checkbox;

  const isImg = type === 'png' || type === 'jpg' || type === 'jpeg';
  const isMusic = type === 'mp3' || type === 'wav' || type === 'flac';
  const isVideo = type === 'mp4' || type === 'avi' || type === 'wmv';

  let thumb;
  if (image) {
    thumb = image;
  } else if (type === 'directory') {
    thumb = folder;
  } else if (isImg) {
    thumb = imageIcon;
  } else if (isMusic) {
    thumb = music;
  } else if (type === 'pdf') {
    thumb = pdf;
  } else if (isVideo) {
    thumb = video;
  } else if (type === 'word') {
    thumb = word;
  } else if (type === 'zip') {
    thumb = zip;
  } else if (type === 'excel') {
    thumb = excel;
  } else if (type === 'ppt') {
    thumb = ppt;
  } else {
    thumb = file;
  }

  return (
    <div className={styles.thumbnailWrapper}>
      <div
        className={styles.thumbnail}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={handleThumbnailClick}
      >
        <img src={thumb} className={styles.thumb} alt='thumbnail' />
        {isFavorite && (
          <img src={clickstar} alt='favorite' className={styles.favorite} />
        )}
        {(isHover || isChecked) && (
          <img
            src={checkboxIcon}
            alt='checkbox'
            className={styles.checkbox}
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) {
                onClick();
              }
            }}
          />
        )}
      </div>
      <div className={styles.title}>{name}</div>
    </div>
  );
}

export default Thumbnail;
