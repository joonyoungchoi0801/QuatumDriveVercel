import React, { useEffect, useRef, useState } from 'react';

import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import styles from './trash.module.scss';
import useSidebarStore from '@/store/sidebarStore';
import Thumbnail from '@/components/thumbnail';
import filesearch from '@/assets/filesearch.svg';
import search from '@/assets/search.svg';

import Button from '@/components/button';

import { ThumbnailData } from './trash.type';

import { AxiosError } from 'axios';
import {
  deleteAllTrash,
  deleteTrash,
  getTrash,
  putTrash,
} from '@/api/trashAPI';

function Home() {
  const [searchKeyword, setSearchKeyword] = useState('');

  const [thumbnailData, setThumbnailData] = useState<ThumbnailData[]>([]);
  const [displayData, setDisplayData] = useState<ThumbnailData[]>([]);
  const [checkedData, setCheckedData] = useState<ThumbnailData[]>([]);

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const sidebarWidth = useSidebarStore((state) => state.sidebarWidth);

  const gridRef = useRef<HTMLDivElement | null>(null);

  const setKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
  };

  const isAllChecked =
    thumbnailData.length > 0
      ? thumbnailData.every((data) => data.isChecked)
      : false;

  const gridStyle = { width: '100%' };

  const handleCheckboxClick = (id: number) => {
    setThumbnailData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
    setDisplayData(thumbnailData);
  };

  const fetchTrash = async () => {
    try {
      const response = await getTrash();
      const data = response.data;
      console.log(data);
      setThumbnailData(data);
      setDisplayData(data);
    } catch (error: AxiosError | any) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 422
      ) {
        alert('요청한 리소스를 찾을 수 없습니다.');
      } else {
        alert('에러가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestoreBtnClick = async () => {
    try {
      for (const item of checkedData) {
        await putTrash(item.id);
      }
      alert('복원되었습니다.');
      fetchTrash();
    } catch (error: AxiosError | any) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 422
      ) {
        alert('에러가 발생했습니다.');
      }
    }
  };
  const handleSelectedDeleteBtnClick = async () => {
    try {
      for (const item of checkedData) {
        await deleteTrash(item.id);
      }
      alert('삭제되었습니다.');
      fetchTrash();
    } catch (error: AxiosError | any) {
      if (
        (error instanceof AxiosError &&
          error.response &&
          error.response.status === 422) ||
        error.response.status === 404
      ) {
        alert('에러가 발생했습니다.');
      }
    }
  };

  const handleAllDeleteBtnClick = async () => {
    try {
      await deleteAllTrash();
      alert('전체 삭제되었습니다.');
      fetchTrash();
    } catch (error: AxiosError | any) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 422
      ) {
        alert('에러가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    if (isCheckboxChecked) {
      setThumbnailData((prevData) =>
        prevData.map((item) => ({ ...item, isChecked: true }))
      );
    } else {
      setThumbnailData((prevData) =>
        prevData.map((item) => ({ ...item, isChecked: false }))
      );
    }
  }, [isCheckboxChecked]);

  useEffect(() => {
    const checkData = thumbnailData.filter((data) => data.isChecked === true);
    setCheckedData(checkData);
    const keywordData = thumbnailData.filter((data) =>
      data.name.includes(searchKeyword)
    );
    setDisplayData(keywordData);
  }, [thumbnailData, searchKeyword]);

  return (
    <>
      <Header />
      <Sidebar />
      <div
        className={styles.task}
        style={{
          marginLeft: sidebarWidth,
          minWidth: `${1200 - sidebarWidth}px`,
        }}
      >
        <div className={styles.taskHeader}>
          <div className={styles.taskTitle}>
            <ul className={styles.path}>
              <li className={styles.pathText}>휴지통</li>
            </ul>
            <div className={styles.searchInput}>
              <img
                className={styles.searchIcon}
                src={filesearch}
                alt='search'
              />
              <input
                className={styles.input}
                type='text'
                placeholder='파일, 문서, 확장자 검색'
                autoComplete='off'
                onChange={setKeyword}
              />
              <button className={styles.searchBtn}>
                <img src={search} alt='search' />
              </button>
            </div>
          </div>
          <div className={styles.taskBtn}>
            <div className={styles.btnArea}>
              <Button>
                <input
                  type='checkbox'
                  checked={isAllChecked ?? false}
                  onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
                />
              </Button>
              <Button onClick={handleAllDeleteBtnClick}>전체 삭제</Button>
              <Button onClick={handleSelectedDeleteBtnClick}>선택 삭제</Button>
              <Button onClick={handleRestoreBtnClick}>선택 복원</Button>
            </div>
          </div>
        </div>
        <div className={styles.mainArea} ref={gridRef}>
          <div className={styles.thumbnailGridWrapper} style={gridStyle}>
            {displayData.map((data) => (
              <Thumbnail
                key={data.id}
                type={data.type}
                name={data.name}
                isFavorite={data.isFavorite}
                href={data.href}
                image={data?.image}
                isChecked={data.isChecked ?? false}
                onClick={() => handleCheckboxClick(data.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
