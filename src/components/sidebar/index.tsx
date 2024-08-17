import React, { useEffect, useRef, useState } from 'react';
import styles from './sidebar.module.scss';
import Menu from './menu';
import useSidebarStore from '@/store/sidebarStore';

const sidebarFirstItems = [
  { title: '모든 파일', href: '/' },
  { title: '최근', href: '/recent' },
  { title: '즐겨찾기', href: '/favorite' },
  { title: '공유', href: '/share' },
];
const sidebarSecondItems = [
  { title: '사진', href: '/picture' },
  { title: '동영상', href: '/video' },
  { title: '문서', href: '/document' },
  { title: '음악', href: '/music' },
  { title: '암호 폴더', href: '/encrypted' },
];

function Sidebar() {
  const { sidebarWidth, setSidebarWidth } = useSidebarStore();
  const [selectedMenu, setSelectedMenu] = useState('모든 파일');
  // const [sidebarWidth, setSidebarWidth] = useState(220);
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
  const handleMouseMove = (e: MouseEvent) => {
    if (sideBarRef.current) {
      const newWidth = Math.min(Math.max(e.clientX, MIN_WIDTH), MAX_WIDTH);
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    sideBarRef.current = false;
  };

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

  const handleClickMenu = (menu: string) => {
    setSelectedMenu(menu);
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
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarLeft} style={{ width: sidebarWidth }}>
        <ul className={styles.sidebarMenu}>
          {sidebarFirstItems.map((item, i) => (
            <Menu
              key={i}
              item={item.title}
              href={item.href}
              onMenuClick={handleClickMenu}
              isSelected={item.title === selectedMenu}
            />
          ))}
          {sidebarSecondItems.map((item, i) => (
            <Menu
              key={i}
              item={item.title}
              href={item.href}
              onMenuClick={handleClickMenu}
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
