import { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './uproadmodal.module.scss';
import { UploadModalProps } from './uproadmodal.type';
import close from '@/assets/close.svg';
import { postFileCache, postFileUpload } from '@/api/fileAPI';
import { AxiosError } from 'axios';
import useProfileStore from '@/store/profileStore';
import { getProfile } from '@/api/profile';
import { createSHA256 } from 'hash-wasm';

function UproadModal({ isOpen, resourceKey, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [hash, setHash] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCalculatingHash, setIsCalculatingHash] = useState(false);

  const { setUsedVolume } = useProfileStore();

  if (!isOpen) return null;
  const modalRoot = document.getElementById('modal-root') as HTMLElement;

  modalRoot.classList.add('active');

  const confirmBtnClass = isCalculatingHash
    ? `${styles.button} ${styles.disabled}`
    : `${styles.button}`;

  const handleUproadFile = async () => {
    if (!file) {
      alert('file을 넣어주세요');
      return;
    }
    try {
      await postFileCache(fileName, resourceKey, false, false, hash);
      await postFileUpload(file, (progress) => setUploadProgress(progress));
      modalRoot.classList.remove('active');
      setFileName('');
      setFile(null);
      onClose();
      setHash('');
      setUploadProgress(0);
      const res = await getProfile();
      const { usedVolume } = res?.data;
      setUsedVolume(usedVolume);
    } catch (error: AxiosError | any) {
      if (error instanceof AxiosError && error.response?.status === 401) {
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
    setHash('');
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setIsCalculatingHash(true);
      // const hash = await calculateSHA256(selectedFile);
      const hash = await calculateSHA256Stream(selectedFile);
      setHash(hash);
      setIsCalculatingHash(false);
    }
  };

  async function calculateSHA256Stream(file: File): Promise<string> {
    const reader = file.stream().getReader();
    const sha256 = await createSHA256();

    let done = false;

    while (!done) {
      const { done: doneReading, value } = await reader.read();
      if (value) {
        sha256.update(value);
      }
      done = doneReading;
    }

    const hashHex = sha256.digest('hex');
    return hashHex;
  }

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
        {uploadProgress > 0 && (
          <div className={styles.progressWrapper}>
            <div
              className={styles.progressBar}
              style={{ width: `${uploadProgress}%` }}
            />
            <span>{uploadProgress}%</span>
          </div>
        )}
        <div className={styles.btnArea}>
          <button
            className={confirmBtnClass}
            onClick={handleUproadFile}
            disabled={!file || isCalculatingHash}
          >
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
