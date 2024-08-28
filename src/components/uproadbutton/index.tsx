import styles from './uproadbutton.module.scss';
import uproad from '@/assets/uproad.svg';

interface ButtonProps {
  onClick?: () => void;
}

function UproadButton({ onClick }: ButtonProps) {
  return (
    <button className={styles.uproad} onClick={onClick}>
      <img src={uproad} alt='uproad' />
      <span>올리기</span>
    </button>
  );
}

export default UproadButton;
