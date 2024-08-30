import { useEffect } from 'react';
import { getProfile } from '@/api/profile';
import useProfileStore from '@/store/profileStore';
import styles from './header.module.scss';
import quantumlogo from '@/assets/quantum.svg';
import downIcon from '@/assets/arrow-down.svg';

function Header() {
  const {
    phonenum,
    setPhonenum,
    username,
    setUsername,
    profilePath,
    setProfilePath,
    email,
    setEmail,
    setUsedVolume,
    setMaxVolume,
  } = useProfileStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const {
          phonenum,
          username,
          profilePath,
          email,
          usedVolume,
          maxVolume,
        } = res?.data;
        setPhonenum(phonenum);
        setUsername(username);
        setProfilePath(profilePath);
        setEmail(email);
        setUsedVolume(usedVolume);
        setMaxVolume(maxVolume);
      } catch (error) {}
    };
    fetchProfile();
  }, [
    setEmail,
    setPhonenum,
    setProfilePath,
    setUsername,
    setUsedVolume,
    setMaxVolume,
  ]);

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
          src={
            profilePath
              ? profilePath
              : 'https://ssl.pstatic.net/static/common/myarea/myInfo.gif'
          }
        />
        <div className={styles.profile_text}>
          <span>{username}</span>
          <img src={downIcon} alt='down' />
        </div>
      </div>
    </header>
  );
}

export default Header;
