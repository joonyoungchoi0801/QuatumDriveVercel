import { useEffect, useState } from 'react';
import { getProfile } from '@/api/profile';
import useProfileStore from '@/store/profileStore';
import styles from './header.module.scss';
import quantumlogo from '@/assets/quantum.svg';
import downIcon from '@/assets/arrow-down.svg';
import { useNavigate } from 'react-router-dom';
import { deleteLogout } from '@/api/authAPI';

interface ProfileProps {
  name: string;
  email: string;
  profilePath: string | null;
  phonenum: string | null;
  onClick: () => void;
}

const Profile = ({
  name,
  email,
  profilePath,
  phonenum,
  onClick,
}: ProfileProps) => {
  return (
    <div className={styles.gnbContentWrapper}>
      <div className={styles.gnbContent}>
        <img
          src={
            profilePath
              ? profilePath
              : 'https://ssl.pstatic.net/static/common/myarea/myInfo.gif'
          }
          alt='profile'
          className={styles.gnbProfile}
        />
        <div className={styles.gnbData}>
          <span>{name}님</span>
          <span>{phonenum}</span>
          <span>{email}</span>
        </div>
      </div>
      <button className={styles.btnLogout} onClick={onClick}>
        로그아웃
      </button>
    </div>
  );
};

function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  const navigate = useNavigate();

  const handleClickProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async () => {
    try {
      await deleteLogout();
      localStorage.removeItem('accessToken');
      alert('로그아웃 되었습니다.');
      navigate('/');
    } catch (error) {
      alert('로그아웃에 실패했습니다.');
    }
  };

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
      <div className={styles.profile} onClick={handleClickProfile}>
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
        {isProfileOpen && (
          <Profile
            name={username}
            email={email}
            profilePath={profilePath}
            phonenum={phonenum}
            onClick={handleLogout}
          />
        )}
      </div>
    </header>
  );
}

export default Header;
