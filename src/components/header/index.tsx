import React from 'react';
import styles from './header.module.scss';
import quantumlogo from '@/assets/quantum.svg';
import downIcon from '@/assets/arrow-down.svg';

function Header() {
  return (
    <header className={styles.header}>
      <a className={styles.headerLogo} href='/home'>
        <img
          className={styles.headerLogo_img}
          src={quantumlogo}
          alt='Quantum Logo'
        />
        <span className={styles.headerLogo_text}>QuantumDrive</span>
      </a>
      <div className={styles.profile}>
        <img
          className={styles.profile_img}
          alt='profile'
          src='https://ssl.pstatic.net/static/common/myarea/myInfo.gif'
        />
        <div className={styles.profile_text}>
          <span>최준영</span>
          <img src={downIcon} alt='down' />
        </div>
      </div>
    </header>
  );
}

export default Header;
