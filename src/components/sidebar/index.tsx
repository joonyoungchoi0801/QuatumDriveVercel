import React, { useEffect, useRef, useState } from 'react';
import styles from './sidebar.module.scss';

const sidebarFirstItems = ['모든 파일', '최근', '즐겨찾기', '공유'];
const sidebarSecondItems = ['사진', '동영상', '문서', '음악', '암호 폴더'];

function Sidebar() {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const sideBarRef = useRef(false);

  const MIN_WIDTH = 200;
  const MAX_WIDTH = 500;

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
      <ul className={styles.sidebarMenu} style={{ width: sidebarWidth }}>
        {sidebarFirstItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
        {sidebarSecondItems.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
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
