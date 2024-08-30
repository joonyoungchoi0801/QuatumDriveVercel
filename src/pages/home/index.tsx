import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import styles from './home.module.scss';
import useSidebarStore from '@/store/sidebarStore';
import Thumbnail from '@/components/thumbnail';
import filesearch from '@/assets/filesearch.svg';
import search from '@/assets/search.svg';
import { useNavigate } from 'react-router-dom';
import { getFile, getKeywordFile } from '@/api/fileAPI';
import { debounce } from 'lodash';
import Button from '@/components/button';
import UproadButton from '@/components/uproadbutton';
import uparrow from '@/assets/uparrow.svg';
import downarrow from '@/assets/downarrow.svg';
import info from '@/assets/info.svg';
import { FileData, ThumbnailData } from './home.type';
import { utf8_to_b64, b64_to_utf8 } from '@/utils/base64';
import FolderModal from '@/components/foldermodal';
import UproadModal from '@/components/uproadmodal';
import { AxiosError } from 'axios';
import { postTrash } from '@/api/trashAPI';

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

interface SortOptionProps {
  setSortType: (type: string) => void;
}

const TypeList: {
  [key in
    | 'recent'
    | 'favorite'
    | 'image'
    | 'video'
    | 'document'
    | 'audio'
    | 'encrypted']: string;
} = {
  recent: '최근 항목',
  favorite: '즐겨찾기',
  image: '사진',
  video: '동영상',
  document: '문서',
  audio: '음악',
  encrypted: '암호 폴더',
};

type TypeKey = keyof typeof TypeList;

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
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [sortType, setSortType] = useState('날짜');
  const [methodType, setMethodType] = useState('오름차순');
  const [isSortButtonClicked, setIsSortButtonClicked] = useState(false);
  const [isMethodButtonClicked, setIsMethodButtonClicked] = useState(false);
  const [thumbnailData, setThumbnailData] = useState<ThumbnailData[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const sidebarWidth = useSidebarStore((state) => state.sidebarWidth);

  const accessToken = sessionStorage.getItem('accessToken');

  const keyword = searchParams.get('keyword');
  const encodedResourceKey = searchParams.get('resourceKey');
  let resourceKey = encodedResourceKey
    ? decodeURIComponent(encodedResourceKey)
    : '';
  resourceKey = resourceKey.replace(/ /g, '+');
  const prevTypeRef = useRef(type);
  const prevKeywordRef = useRef(keyword);
  const prevResourceKeyRef = useRef(resourceKey);
  const prevSortTypeRef = useRef(sortType);
  const prevMethodTypeRef = useRef(methodType);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const setKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
  };

  const path = resourceKey
    ? `QuantumBox${b64_to_utf8(resourceKey as string)}`
    : 'QuantumBox';
  const replacedPath = path.replace(/\//g, ' > ');
  const pathArray = replacedPath.split(' ');

  const isCheckedData = thumbnailData.some((data) => data.isChecked);
  const isAllChecked =
    thumbnailData.length > 0
      ? thumbnailData.every((data) => data.isChecked)
      : false;
  console.log(isAllChecked);
  const onClickSearchBtn = (keyword: string) => {
    navigate(`/?keyword=${keyword}`);
  };
  const onClickPath = (pathIndex: number, pathArray: string[]) => {
    if (pathIndex === 0) {
      navigate('/home');
      return;
    }
    const clickedPath = pathArray
      .slice(1, pathIndex + 1)
      .join('/')
      .replace(/>/g, '/');
    const normalizedPath = clickedPath.replace(/\/{2,}/g, '/');

    const base64Path = utf8_to_b64(normalizedPath);

    navigate(`/home?resourceKey=${base64Path}`);
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

  const handleTrashButtonClicked = async () => {
    const checkedData = thumbnailData.filter((data) => data.isChecked);
    const checkedIds = checkedData.map((data) => data.id);
    try {
      await postTrash(checkedIds);
      setThumbnailData((prevData) =>
        prevData.filter((data) => !checkedIds.includes(data.id))
      );
    } catch (error: AxiosError | any) {
      if (error.response && error.response.status === 422) {
        alert('요청한 리소스를 찾을 수 없습니다.');
      } else {
        alert('에러가 발생했습니다.');
      }
    }
  };

  const fetchMoreData = useCallback(async () => {
    if (!hasNext) return;
    if (!accessToken) {
      navigate('/');
    }
    const currentpath = resourceKey ? `${b64_to_utf8(resourceKey)}` : '';
    try {
      const fileData = !keyword
        ? await getFile(
            resourceKey,
            type ? type : null,
            page * 50,
            50,
            sortTypeApiList[sortType],
            optionTypeApiList[methodType]
          )
        : await getKeywordFile(
            keyword as string,
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
          ? type
            ? `/home/resourceKey=${data.resourcekey}&id=${data.id}`
            : `/home?resourceKey=${utf8_to_b64(currentpath + '/' + data.name)}&id=${data.id}`
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
  }, [
    hasNext,
    keyword,
    page,
    resourceKey,
    sortType,
    type,
    methodType,
    accessToken,
    navigate,
  ]);

  useEffect(() => {
    if (
      prevTypeRef.current !== type ||
      prevKeywordRef.current !== keyword ||
      prevResourceKeyRef.current !== resourceKey ||
      prevSortTypeRef.current !== sortType ||
      prevMethodTypeRef.current !== methodType
    ) {
      setThumbnailData([]);
      setPage(0);
      setHasNext(true);
    }

    fetchMoreData();

    prevTypeRef.current = type;
    prevKeywordRef.current = keyword;
    prevResourceKeyRef.current = resourceKey;
    prevSortTypeRef.current = sortType;
    prevMethodTypeRef.current = methodType;
  }, [
    type,
    keyword,
    resourceKey,
    sortType,
    methodType,
    page,
    fetchMoreData,
    isNewFolderModalOpen,
    isUploadModalOpen,
    accessToken,
  ]);

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
              {type ? (
                <li className={styles.pathText}>{TypeList[type as TypeKey]}</li>
              ) : (
                pathArray.map((path, index) => (
                  <li
                    key={index}
                    className={
                      path === '>' ? styles.rightArrow : styles.pathText
                    }
                    onClick={() => onClickPath(index, pathArray)}
                  >
                    {path}
                  </li>
                ))
              )}
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
              <Button>
                <input
                  type='checkbox'
                  checked={isAllChecked ?? false}
                  onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
                />
              </Button>
              {isCheckedData ? (
                <>
                  <Button onClick={handleTrashButtonClicked}>선택 삭제</Button>
                  <Button>선택 공유</Button>
                </>
              ) : !type && !keyword ? (
                <>
                  <UproadButton onClick={() => setIsUploadModalOpen(true)} />
                  <Button onClick={() => setIsNewFolderModalOpen(true)}>
                    새 폴더
                  </Button>
                  <Button>공유</Button>
                </>
              ) : (
                <></>
              )}
            </div>

            <FolderModal
              isOpen={isNewFolderModalOpen}
              resourceKey={resourceKey}
              onClose={() => {
                setHasNext(true);
                setIsNewFolderModalOpen(false);
                fetchMoreData();
              }}
            />
            <UproadModal
              isOpen={isUploadModalOpen}
              resourceKey={resourceKey}
              onClose={() => {
                setHasNext(true);
                setIsUploadModalOpen(false);
                fetchMoreData();
              }}
            />
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
                image={data?.image}
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
