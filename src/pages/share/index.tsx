import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import styles from './share.module.scss';
import useSidebarStore from '@/store/sidebarStore';
import Thumbnail from '@/components/thumbnail';
import filesearch from '@/assets/filesearch.svg';
import search from '@/assets/search.svg';
import { useNavigate } from 'react-router-dom';
import { getFile } from '@/api/fileAPI';
import Button from '@/components/button';
import uparrow from '@/assets/uparrow.svg';
import downarrow from '@/assets/downarrow.svg';
import info from '@/assets/info.svg';
import { FileData, ThumbnailData } from './share.type';
import { debounce } from 'lodash';

interface SortOptionProps {
  setSortType: (type: string) => void;
}

const sortTypeList = ['날짜', '이름', '용량'];
const sortTypeApiList: { [key: string]: string } = {
  날짜: 'createdAt',
  이름: 'name',
  용량: 'volume',
};
const optionTypeList = ['오름차순', '내림차순'];
const optionTypeApiList: { [key: string]: boolean } = {
  오름차순: true,
  내림차순: false,
};

const SortOption = ({ setSortType }: SortOptionProps) => {
  return (
    <div className={styles.sortOption}>
      {sortTypeList.map((type) => (
        <div
          key={type}
          onClick={() => {
            setSortType(type);
          }}
          className={styles.sortOptionItem}
        >
          {type}
        </div>
      ))}
    </div>
  );
};

const MethodOption = ({ setSortType }: SortOptionProps) => {
  return (
    <div className={styles.sortOption}>
      {optionTypeList.map((type) => (
        <div
          key={type}
          onClick={() => {
            setSortType(type);
          }}
          className={styles.sortOptionItem}
        >
          {type}
        </div>
      ))}
    </div>
  );
};

function Home() {
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [sortType, setSortType] = useState('날짜');
  const [methodType, setMethodType] = useState('오름차순');
  const [shareType, setShareType] = useState('share');
  const [isSortButtonClicked, setIsSortButtonClicked] = useState(false);
  const [isMethodButtonClicked, setIsMethodButtonClicked] = useState(false);
  const [thumbnailData, setThumbnailData] = useState<ThumbnailData[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const sidebarWidth = useSidebarStore((state) => state.sidebarWidth);

  const prevShareTypeRef = useRef(shareType);
  const prevSortTypeRef = useRef(sortType);
  const prevMethodTypeRef = useRef(methodType);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const accessToken = sessionStorage.getItem('accessToken');

  const setKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
  };

  const onClickSearchBtn = (keyword: string) => {
    navigate(`/?keyword=${keyword}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onClickSearchBtn(searchKeyword);
    }
  };
  const handleInfoOpen = () => {
    setIsInfoOpen(!isInfoOpen);
  };

  const handleSortButtonClicked = () => {
    setIsSortButtonClicked(!isSortButtonClicked);
    if (isMethodButtonClicked) {
      setIsMethodButtonClicked(false);
    }
  };
  const handleMethodButtonClicked = () => {
    setIsMethodButtonClicked(!isMethodButtonClicked);
    if (isSortButtonClicked) {
      setIsSortButtonClicked(false);
    }
  };

  const gridStyle = isInfoOpen
    ? {
        width: 'calc(100% - 280px)',
      }
    : { width: '100%' };

  const sortButtonImg = isSortButtonClicked ? uparrow : downarrow;
  const methodButtonImg = isMethodButtonClicked ? uparrow : downarrow;

  const handleCheckboxClick = (id: number) => {
    setThumbnailData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };

  const fetchMoreData = useCallback(async () => {
    if (!hasNext) return;
    if (!accessToken) {
      navigate('/');
    }
    try {
      const fileData = await getFile(
        null,
        shareType,
        page * 50,
        50,
        sortTypeApiList[sortType],
        optionTypeApiList[methodType]
      );

      const transformedData = fileData.data.map((data: FileData) => ({
        id: data.id,
        name: data.name,
        type: data.extension,
        createdAt: data.createdAt,
        href: data.isDirectory
          ? `/home?resourceKey=${data.resourcekey}&id=${data.id}`
          : `/download/${data.id}`,
        isFavorite: data.isFavorite,
        image: data.thumbnail,
        isChecked: false,
      }));

      setThumbnailData((prevData) =>
        page === 0 ? transformedData : [...prevData, ...transformedData]
      );
      setHasNext(fileData.data.length === 50);
    } catch (error) {
      alert('데이터를 불러오는데 실패했습니다.');
    }
  }, [hasNext, page, shareType, sortType, methodType, accessToken, navigate]);
  useEffect(() => {
    if (
      prevShareTypeRef.current !== shareType ||
      prevSortTypeRef.current !== sortType ||
      prevMethodTypeRef.current !== methodType
    ) {
      setThumbnailData([]);
      setPage(0);
      setHasNext(true);
    }
    fetchMoreData();
    prevShareTypeRef.current = shareType;
    prevSortTypeRef.current = sortType;
    prevMethodTypeRef.current = methodType;
  }, [shareType, sortType, methodType, page, fetchMoreData]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (gridRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = gridRef.current;

        if (scrollTop + clientHeight >= scrollHeight - 100) {
          if (hasNext) {
            setPage((prevPage) => prevPage + 1);
          }
        }
      }
    }, 200);
    const currentGrid = gridRef.current;

    if (currentGrid) {
      currentGrid.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentGrid) {
        currentGrid.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasNext, page]);

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
              <li className={styles.pathText}>공유파일</li>
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
            <div className={styles.btnArea}>
              <Button onClick={() => setShareType('share')}>공유 한</Button>
              <Button onClick={() => setShareType('shared')}>공유 받은</Button>
            </div>

            <div className={styles.sortArea}>
              <button
                className={styles.sortBtn}
                onClick={handleSortButtonClicked}
              >
                <span>{sortType}</span>
                <img src={sortButtonImg} alt='sort' />
                {isSortButtonClicked && (
                  <SortOption setSortType={setSortType} />
                )}
              </button>
              <button
                className={styles.sortBtn}
                onClick={handleMethodButtonClicked}
              >
                <span>{methodType}</span>
                <img src={methodButtonImg} alt='sort' />
                {isMethodButtonClicked && (
                  <MethodOption setSortType={setMethodType} />
                )}
              </button>
              <div className={styles.bar} />
              <img
                src={info}
                className={styles.infoBtn}
                alt='info'
                onClick={handleInfoOpen}
              />
            </div>
          </div>
        </div>
        <div className={styles.mainArea} ref={gridRef}>
          <div className={styles.thumbnailGridWrapper} style={gridStyle}>
            {thumbnailData.map((data) => (
              <Thumbnail
                key={data.id}
                type={data.type}
                name={data.name}
                isFavorite={data.isFavorite}
                href={data.href}
                isChecked={data.isChecked ?? false}
                onClick={() => handleCheckboxClick(data.id)}
              />
            ))}
          </div>
          {isInfoOpen && <div className={styles.infoArea}>abc</div>}
        </div>
      </div>
    </>
  );
}

export default Home;
