import React, { useState } from 'react';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import styles from './home.module.scss';
import useSidebarStore from '@/store/sidebarStore';
import Thumbnail from '@/components/thumbnail';
import filesearch from '@/assets/filesearch.svg';
import search from '@/assets/search.svg';
import { useNavigate } from 'react-router-dom';
import { getFile } from '@/api/fileAPI';
import { postLogin } from '@/api/authAPI';

function Home() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const sidebarWidth = useSidebarStore((state) => state.sidebarWidth);

  const setKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const onClickSearchBtn = (keyword: string) => {
    navigate(`/keyword=${keyword}`);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onClickSearchBtn(searchKeyword);
    }
  };
  const handleInfoOpen = () => {
    setIsInfoOpen(!isInfoOpen);
  };

  const gridStyle = isInfoOpen
    ? {
        width: 'calc(100% - 280px)',
      }
    : { width: '100%' };
  // const username = 'joeplay0801@naver.com';
  // const password = 'jyc08010801!';

  // postLogin(username, password)
  //   .then((response) => {
  //     console.log('Login successful:', response.data);
  //   })
  //   .catch((error) => {
  //     console.error('Login failed:', error);
  //   });
  // const fileData = getFile(null, null, null, null, null);
  // console.log(fileData);
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
              <li className={styles.pathText}>Mybox &nbsp;</li>
              <li className={styles.pathText}>&gt;&nbsp;</li>
              <li className={styles.pathText}>web,front</li>
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
                onKeyDown={handleKeyDown}
              />
              <button
                className={styles.searchBtn}
                onClick={() => onClickSearchBtn(searchKeyword)}
              >
                <img src={search} alt='search' />
              </button>
            </div>
          </div>
          <div className={styles.taskBtn}>
            <input type='checkbox' onClick={handleInfoOpen}></input>
          </div>
        </div>
        <div className={styles.mainArea}>
          <div className={styles.thumbnailGridWrapper} style={gridStyle}>
            <Thumbnail type='music' title='web' isFavorite={true} />
            <Thumbnail type='pdf' title='지크르지' isFavorite={true} />
            <Thumbnail type='word' title='web' isFavorite={true} />
            <Thumbnail type='pdf' title='지크르지' isFavorite={false} />
            <Thumbnail type='folder' title='web' isFavorite={true} />
            <Thumbnail type='pdf' title='지크르지' isFavorite={true} />
            <Thumbnail type='folder' title='web' isFavorite={true} />
            <Thumbnail type='pdf' title='지크르지' isFavorite={true} />
            <Thumbnail type='folder' title='web' isFavorite={true} />
            <Thumbnail type='pdf' title='지크르지' isFavorite={true} />
            <Thumbnail type='folder' title='web' isFavorite={true} />
            <Thumbnail type='pdf' title='지크르지' isFavorite={true} />
            <Thumbnail type='pdf' title='지크르지' isFavorite={true} />
            <Thumbnail type='folder' title='web' isFavorite={true} />
            <Thumbnail type='pdf' title='지크르지' isFavorite={true} />
            <Thumbnail type='folder' title='web' isFavorite={true} />
            <Thumbnail type='pdf' title='지크르지' isFavorite={true} />
            <Thumbnail type='folder' title='web' isFavorite={true} />
            <Thumbnail type='pdf' title='지크르지' isFavorite={true} />
          </div>
          {isInfoOpen && <div className={styles.infoArea}>abc</div>}
        </div>
      </div>
    </>
  );
}

export default Home;
