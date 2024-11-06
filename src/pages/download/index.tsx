import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import styles from './download.module.scss';
import backIcon from '@/assets/backarrow.svg';
import downloadIcon from '@/assets/download.svg';
import starIcon from '@/assets/star.svg';
import clickStarIcon from '@/assets/file/clickstar.svg';
import {
  getDownloadFile,
  getPreviewFile,
  postFavoriteFile,
} from '@/api/fileAPI';

function Download() {
  const [fileName, setFileName] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<string[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFileDetailInfo = async () => {
      try {
        const response = await getPreviewFile(Number(id));
        setFileName(response.data.name);
        setIsFavorite(response.data.isFavorite);
        setThumbnail(response.data?.contents);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFileDetailInfo();
  }, [id]);

  const handleDownload = async (contentId: number) => {
    try {
      const response = await getDownloadFile(contentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };
  const handleFavorite = (contentId: number) => {
    postFavoriteFile(contentId);
    setIsFavorite(!isFavorite);
  };

  const starIconSrc = isFavorite ? clickStarIcon : starIcon;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <div className={styles.backBtnWrapper}>
          <img
            src={backIcon}
            alt='back'
            className={styles.btn}
            onClick={() => navigate(-1)}
          />
          <span className={styles.title}>{fileName}</span>
        </div>
        <div className={styles.downloadWrapper}>
          <img
            src={starIconSrc}
            alt='star'
            className={styles.icon}
            onClick={() => handleFavorite(Number(id))}
          />
          <img
            src={downloadIcon}
            alt='download'
            className={styles.icon}
            onClick={() => handleDownload(Number(id))}
          />
        </div>
      </div>
      <div className={styles.content}>
        {thumbnail &&
          thumbnail.length > 0 &&
          thumbnail.map((item, index) => (
            <img
              src={item}
              alt='thumbnail'
              className={styles.thumbnail}
              key={index}
            />
          ))}
      </div>
    </div>
  );
}

export default Download;
