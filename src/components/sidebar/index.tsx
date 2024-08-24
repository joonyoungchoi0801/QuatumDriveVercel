import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './sidebar.module.scss';
import Menu from './menu';
import useSidebarStore from '@/store/sidebarStore';
import trash from '@/assets/trash.svg';
import { useNavigate, useLocation } from 'react-router-dom';

const sidebarFirstItems = [
  { title: '모든 파일', href: '/home' },
  { title: '최근', href: '/home/recent' },
  { title: '즐겨찾기', href: '/home/favorite' },
  { title: '공유', href: '/share' },
];
const sidebarSecondItems = [
  { title: '사진', href: '/home/image' },
  { title: '동영상', href: '/home/video' },
  { title: '문서', href: '/home/document' },
  { title: '음악', href: '/home/audio' },
  { title: '암호 폴더', href: '/home/encrypted' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarWidth, setSidebarWidth } = useSidebarStore();
  const [selectedMenu, setSelectedMenu] = useState('모든 파일');
  const sideBarRef = useRef(false);

  const MIN_WIDTH = 180;
  const MAX_WIDTH = 280;

  const TOTAL_CAPACITY = 100;
  const USED_CAPACITY = 61.5;
  const FREE_CAPACITY = TOTAL_CAPACITY - USED_CAPACITY;
  const CAPACITY_PERCENTAGE = (USED_CAPACITY / TOTAL_CAPACITY) * 100;

  const handleMouseDown = () => {
    sideBarRef.current = true;
  };
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (sideBarRef.current) {
        const newWidth = Math.min(Math.max(e.clientX, MIN_WIDTH), MAX_WIDTH);
        setSidebarWidth(newWidth);
      }
    },
    [setSidebarWidth]
  );

  const handleMouseUp = useCallback(() => {
    sideBarRef.current = false;
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    sideBarRef.current = true;
    const touch = e.touches[0];
    const newWidth = Math.min(Math.max(touch.clientX, MIN_WIDTH), MAX_WIDTH);
    setSidebarWidth(newWidth);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (sideBarRef.current) {
      const touch = e.touches[0];
      const newWidth = Math.min(Math.max(touch.clientX, MIN_WIDTH), MAX_WIDTH);
      setSidebarWidth(newWidth);
    }
  };

  const handleTouchEnd = () => {
    sideBarRef.current = false;
  };

  // const handleClickMenu = (menu: string) => {
  //   setSelectedMenu(menu);
  // };

  const handleClickTrash = () => {
    navigate('./trash');
  };

  useEffect(() => {
    const handleDocumentMouseMove = (e: MouseEvent) => handleMouseMove(e);
    const handleDocumentMouseUp = () => handleMouseUp();

    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const currentPath = location.pathname;
    const foundMenu = [...sidebarFirstItems, ...sidebarSecondItems].find(
      (item) => item.href === currentPath
    );

    if (foundMenu) {
      setSelectedMenu(foundMenu.title);
    }
  }, [location.pathname]);
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarLeft} style={{ width: sidebarWidth }}>
        <ul className={styles.sidebarMenu}>
          {sidebarFirstItems.map((item, i) => (
            <Menu
              key={i}
              item={item.title}
              href={item.href}
              isSelected={item.title === selectedMenu}
            />
          ))}
          {sidebarSecondItems.map((item, i) => (
            <Menu
              key={i}
              item={item.title}
              href={item.href}
              isSelected={item.title === selectedMenu}
            />
          ))}
        </ul>
        <div className={styles.sidebarBottom} style={{ width: sidebarWidth }}>
          <div className={styles.capacityArea}>
            <div className={styles.capacityText}>
              <div className={styles.capacity}>
                <span style={{ color: '#4078ff' }}>{USED_CAPACITY}GB</span>
                <span> / {TOTAL_CAPACITY}GB</span>
              </div>
              <span className={styles.capacityInfo}>
                여유 {FREE_CAPACITY}GB
              </span>
            </div>
            <span className={styles.graph}>
              <span
                className={styles.bar}
                style={{ width: `${CAPACITY_PERCENTAGE}%` }}
              />
            </span>
          </div>
          <div className={styles.trashArea} onClick={handleClickTrash}>
            <img className={styles.trashIcon} src={trash} alt='trash' />
            <span className={styles.trashText}>휴지통</span>
          </div>
        </div>
      </div>
      <button
        className={styles.sidebarResize}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label='Resize sidebar'
        tabIndex={0}
      >
        <div className={styles.bar} />
      </button>
    </div>
  );
}

export default Sidebar;
