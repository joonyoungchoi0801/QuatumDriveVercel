import { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './foldermodal.module.scss';
import { FolderModalProps } from './foldermodal.type';
import close from '@/assets/close.svg';
import { postFileCache } from '@/api/fileAPI';
import { AxiosError } from 'axios';

function FolderModal({ isOpen, resourceKey, onClose }: FolderModalProps) {
  const [folderName, setFolderName] = useState('');

  if (!isOpen) return null;
  const modalRoot = document.getElementById('modal-root') as HTMLElement;
  modalRoot.classList.add('active');

  const handleCreateFolder = async () => {
    if (!folderName) {
      alert('폴더 이름을 입력해주세요!');
      return;
    }
    try {
      await postFileCache(folderName, resourceKey, false, true, '');
      modalRoot.classList.remove('active');
      setFolderName('');
      onClose();
    } catch (error: AxiosError | any) {
      if (error.response && error.response.request.status === 400) {
        alert('이미 존재하는 폴더 이름입니다.');
      } else {
        alert('폴더 생성에 실패했습니다.');
      }

      console.log(error.response.request.status);
    }
  };

  const handleClose = () => {
    modalRoot.classList.remove('active');
    onClose();
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value);
  };

  return ReactDOM.createPortal(
    <div className={styles.folderModal}>
      <img
        src={close}
        alt='close'
        className={styles.close}
        onClick={handleClose}
      />
      <div className={styles.modalContent}>
        <div className={styles.titleWrapper}>
          <strong className={styles.modalTitle}>새 폴더 만들기</strong>
        </div>
        <input
          type='text'
          placeholder='폴더 이름을 입력해주세요'
          className={styles.folderNameInput}
          value={folderName}
          onChange={handleInputChange}
        />
        <div className={styles.btnArea}>
          <button className={styles.button} onClick={handleCreateFolder}>
            확인
          </button>
          <button
            className={`${styles.button} ${styles.last}`}
            onClick={handleClose}
          >
            <strong>취소</strong>
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  );
}

export default FolderModal;
