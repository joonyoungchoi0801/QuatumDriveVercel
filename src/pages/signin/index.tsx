import { useState } from 'react';
import styles from './signin.module.scss';
import quantum from '@/assets/quantum.svg';
import eyeOn from '@/assets/eye-on.svg';
import eyeOff from '@/assets/eye-off.svg';
import { isValidPassword, isValidEmail } from '@/utils/validation';
import { useForm } from 'react-hook-form';
import { postLogin } from '@/api/authAPI';
import { LoginData } from './signin.type';
import { useNavigate } from 'react-router-dom';
import { getToken } from '@/api/tokenAPI';

function Home() {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    const handleLogin = async () => {
      try {
        const res = await getToken();
        const { access_token } = res.data;
        localStorage.setItem('accessToken', access_token);
        navigate('/home');
      } catch (error) {
        localStorage.removeItem('accessToken');
      }
    };
    handleLogin();
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleClickEye = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const eyeIcon = isPasswordVisible ? eyeOn : eyeOff;

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await postLogin(data.email, data.password);
      const { access_token } = res.data;
      localStorage.setItem('accessToken', access_token);
      navigate('/home');
    } catch (error) {
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.signinWrapper}>
        <div className={styles.titleWrapper}>
          <img className={styles.logo} src={quantum} alt='Logo' />
          <div className={styles.subtitleWrapper}>
            <span className={styles.subtitle}>회원이 아니신가요?</span>
            <a href='/signup' className={styles.signupLink}>
              회원가입
            </a>
          </div>
          <form
            className={styles.inputWrapper}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.inputContainer}>
              <label className={styles.label}>이메일</label>
              <input
                type='email'
                placeholder='이메일을 입력해주세요'
                className={styles.input}
                {...register('email', {
                  required: '이메일을 입력해주세요',
                  validate: (value) =>
                    isValidEmail(value) || '이메일 형식이 올바르지 않습니다.',
                })}
              />
              {errors.email && typeof errors.email.message === 'string' && (
                <span className={styles.alert}>{errors.email.message}</span>
              )}
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.label}>비밀번호</label>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder='비밀번호를 입력해주세요'
                className={styles.input}
                {...register('password', {
                  required: '비밀번호를 입력해주세요',
                  validate: (value) =>
                    isValidPassword(value) ||
                    '비밀번호는 8자 이상이어야 하며, 특수문자를 포함해야 합니다.',
                })}
              />
              <img
                onClick={handleClickEye}
                className={styles.eye}
                src={eyeIcon}
                alt='eye'
              />
              {errors.password &&
                typeof errors.password.message === 'string' && (
                  <span className={styles.alert}>
                    {errors.password.message}
                  </span>
                )}
            </div>
            <button type='submit' className={styles.button}>
              로그인
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
