import { useNavigate } from 'react-router-dom';
import styles from './sidebar.module.scss';

interface MenuProps {
  item: string;
  href: string;
  isSelected: boolean;
  onMenuClick: (item: string) => void;
}

function Menu({ item, href, isSelected, onMenuClick }: MenuProps) {
  const navigate = useNavigate();
  const handleNavigateClick = (item: string) => {
    navigate(href, { replace: true });
    onMenuClick(item);
  };

  return (
    <li
      className={`${styles.menu} ${isSelected ? styles.clicked : ''}`}
      onClick={() => handleNavigateClick(item)}
    >
      {item}
    </li>
  );
}

export default Menu;
