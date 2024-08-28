import { useState } from 'react';
import styles from './signup.module.scss';
import quantum from '@/assets/quantum.svg';
import eyeOn from '@/assets/eye-on.svg';
import eyeOff from '@/assets/eye-off.svg';
import { isValidPassword, isValidEmail } from '@/utils/validation';
import { useForm } from 'react-hook-form';
import { postSignup } from '@/api/authAPI';
import { SignupData } from './signup.type';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

function Home() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupData>();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] =
    useState(false);

  const password = watch('password');

  const validatePasswordConfirm = (value: string) => {
    if (value !== password) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return true;
  };

  const handleClickEye = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleClickEyeConfirm = () => {
    setIsPasswordConfirmVisible(!isPasswordConfirmVisible);
  };

  const eyeIcon = isPasswordVisible ? eyeOn : eyeOff;

  const eyeIconConfirm = isPasswordConfirmVisible ? eyeOn : eyeOff;

  const onSubmit = async (data: SignupData) => {
    try {
      const res = await postSignup(
        data.email,
        data.phonenum,
        data.name,
        data.password
      );
      const { access_token } = res.data;
      sessionStorage.setItem('accessToken', access_token);
      navigate('/home');
    } catch (error: AxiosError | any) {
      if (error.response && error.response.request.status === 403) {
        alert('이미 존재하는 유저입니다.');
      } else {
        alert('회원가입에 실패했습니다.');
      }
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.signinWrapper}>
        <div className={styles.titleWrapper}>
          <img className={styles.logo} src={quantum} alt='Logo' />
          <div className={styles.subtitleWrapper}>
            <span className={styles.subtitle}>회원이신가요?</span>
            <a href='/' className={styles.signupLink}>
              로그인
            </a>
          </div>
          <form
            className={styles.inputWrapper}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.inputContainer}>
              <label className={styles.label}>이름</label>
              <input
                type='text'
                placeholder='이름을 입력해주세요'
                className={styles.input}
                {...register('name', {
                  required: '이름을 입력해주세요',
                })}
              />
              {errors.name && typeof errors.name.message === 'string' && (
                <span className={styles.alert}>{errors.name.message}</span>
              )}
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.label}>전화번호</label>
              <input
                type='text'
                placeholder='전화번호를 입력해주세요 (-제외)'
                className={styles.input}
                {...register('phonenum', {
                  required: '전화번호를 입력해주세요',
                })}
              />
              {errors.phonenum &&
                typeof errors.phonenum.message === 'string' && (
                  <span className={styles.alert}>
                    {errors.phonenum.message}
                  </span>
                )}
            </div>
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
            <div className={styles.inputContainer}>
              <label className={styles.label}>비밀번호 확인</label>
              <input
                type={isPasswordConfirmVisible ? 'text' : 'password'}
                placeholder='비밀번호를 한번더 입력해주세요'
                className={styles.input}
                {...register('passwordConfirm', {
                  required: '비밀번호를 한번더 입력해주세요',
                  validate: validatePasswordConfirm,
                })}
              />
              <img
                onClick={handleClickEyeConfirm}
                className={styles.eye}
                src={eyeIconConfirm}
                alt='eye'
              />
              {errors.passwordConfirm &&
                typeof errors.passwordConfirm.message === 'string' && (
                  <span className={styles.alert}>
                    {errors.passwordConfirm.message}
                  </span>
                )}
            </div>
            <button type='submit' className={styles.button}>
              회원가입
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
