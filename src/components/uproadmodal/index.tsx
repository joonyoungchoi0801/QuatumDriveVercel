import { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './uproadmodal.module.scss';
import { UploadModalProps } from './uproadmodal.type';
import close from '@/assets/close.svg';
import { postFileCache, postFileUpload } from '@/api/fileAPI';
import { AxiosError } from 'axios';

function UproadModal({ isOpen, resourceKey, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [hash, setHash] = useState('');

  if (!isOpen) return null;
  const modalRoot = document.getElementById('modal-root') as HTMLElement;
  modalRoot.classList.add('active');

  const handleUproadFile = async () => {
    if (!file) {
      alert('file을 넣어주세요');
      return;
    }
    try {
      await postFileCache(fileName, resourceKey, false, false, hash);
      await postFileUpload(file);
      modalRoot.classList.remove('active');
      setFileName('');
      setFile(null);
      onClose();
    } catch (error: AxiosError | any) {
      if (error.response?.status === 401) {
        alert('로그인이 필요합니다.');
      } else if (error.response?.status === 409) {
        alert('이미 존재하는 파일입니다.');
      } else if (error.response?.status === 418) {
        alert('용량 초과입니다.');
      } else {
        alert('파일 업로드에 실패했습니다');
      }
    }
  };

  const handleClose = () => {
    modalRoot.classList.remove('active');
    onClose();
  };
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] as File;
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      const hash = await calculateSHA256(selectedFile);
      setHash(hash);
    }
  };

  const calculateSHA256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
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
          <strong className={styles.modalTitle}>파일 추가</strong>
        </div>
        <input
          type='file'
          className={styles.folderNameInput}
          onChange={handleInputChange}
        />
        <div className={styles.btnArea}>
          <button className={styles.button} onClick={handleUproadFile}>
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

export default UproadModal;
