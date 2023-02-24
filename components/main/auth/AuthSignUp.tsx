import { useState } from 'react';
import styled from 'styled-components';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { authService } from '@/firebase';
import { customAlert } from '@/utils/alerts';
import { useMutation } from 'react-query';
import { addUser } from '@/api';

interface AuthForm {
  email: string;
  password: string;
  confirm: string;
  nickname: string;
}
interface Props {
  changeModalButton: () => void;
  closeLoginModal: () => void;
}

//* user 초기 데이터
let userState: any = {
  uid: '',
  userName: '',
  userImg: '/profileicon.svg',
};

const AuthSignUp = (props: Props) => {
  //* useMutation 사용해서 유저 추가하기
  const { mutate: onAddUser } = useMutation(addUser);

  const [registering, setRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthForm>({ mode: 'onBlur' });

  const onSubmit = async (data: AuthForm) => {
    if (data.password !== data.confirm) {
      alert('비밀번호가 일치하지 않습니다.');
      setError('비밀번호가 일치하지 않습니다');
      return;
    }
    if (error !== '') setError('');

    setRegistering(true);
    await createUserWithEmailAndPassword(authService, data.email, data.password)
      .then(() => {
        updateProfile(authService?.currentUser!, {
          displayName: nickname,
          photoURL: '/profileicon.svg',
        });
        userState = {
          ...userState,
          uid: authService.currentUser?.uid,
          userName: nickname,
        };
        customAlert('회원가입을 축하합니다!');
        props.closeLoginModal();
      })
      .then(() => {
        //* 회원가입 시 user 추가하기
        onAddUser(userState),
          {
            onSuccess: () => {
              console.log('유저추가 요청 성공');
            },
            onError: () => {
              console.log('유저추가 요청 실패');
            },
          };
      })
      .catch((error) => {
        if (error.code.includes('auth/weak-password')) {
          setRegistering(false);
          alert('비밀번호는 6자 이상이어야 합니다.');
          return;
        }
        if (error.code.includes('auth/email-already-in-use')) {
          setRegistering(false);
          alert('이메일이 이미 존재합니다');
          return;
        }
        if (error.code.includes('auth/invalid-display-name-in-use')) {
          setRegistering(false);
          alert('닉네임이 이미 존재합니다');
          return;
        }
        setRegistering(false);
        alert('등록할 수 없습니다. 다시 시도해주세요');
      });
  };
  return (
    <SignUpContainer onClick={(e) => e.stopPropagation()}>
      <StHeder onClick={props.changeModalButton}> 〈 돌아가기 </StHeder>

      <SignUpTextDiv>회원가입하기</SignUpTextDiv>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SignUpEmailPwContainer>
          <SignUpEmailInput
            {...register('email', {
              required: '*올바른 이메일 형식을 입력해주세요',
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: '*올바른 이메일 형식을 입력해주세요',
              },
            })}
            name="email"
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="이메일을 입력해주세요"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(onSubmit);
              }
            }}
            autoFocus
          />
          <AuthWarn>{errors?.email?.message}</AuthWarn>

          <SignUpPwInput
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
              minLength: {
                value: 8,
                message:
                  '*7~20자리 숫자 내 영문 숫자 혼합 비밀번호를 입력해주세요',
              },
              pattern: {
                value:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                message:
                  '*7~20자리 숫자 내 영문 숫자 혼합 비밀번호를 입력해주세요',
              },
            })}
            name="password"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력해주세요"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(onSubmit);
              }
            }}
          />
          <AuthWarn>{errors?.password?.message}</AuthWarn>

          <SignUpPwConfirmInput
            {...register('confirm', {
              required: '비밀번호를 입력해주세요.',
              minLength: {
                value: 8,
                message: '입력하신 비밀번호와 일치하지 않아요',
              },
            })}
            autoComplete="new-password"
            name="confirm"
            type="password"
            id="confirm"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="비밀번호를 다시한번 입력해 주세요"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(onSubmit);
              }
            }}
          />
          <AuthWarn>{errors?.confirm?.message}</AuthWarn>

          <NicknameInput
            {...register('nickname', {
              required: '닉네임를 입력해주세요.',
              minLength: {
                value: 2,
                message: '2글자이상 입력해씨펄',
              },
            })}
            type="username"
            value={nickname}
            placeholder="닉네임을 입력해 주세요"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSubmit(onSubmit);
              }
            }}
          />
          <AuthWarn>{errors?.nickname?.message}</AuthWarn>
        </SignUpEmailPwContainer>
      </form>

      <SignUpBtnContainer>
        <SignUpBtn
          onClick={handleSubmit(onSubmit)}
          type="submit"
          disabled={registering}
        >
          <div>회원가입 완료</div>
        </SignUpBtn>
      </SignUpBtnContainer>
    </SignUpContainer>
  );
};

export default AuthSignUp;

const SignUpContainer = styled.div`
  background-color: #ffffff;
  width: 400px;
  height: 75%;
  padding: 30px 30px 30px 30px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
`;

const StHeder = styled.header`
  cursor: pointer;
  color: #1882ff;
  font-size: 15px;
  display: flex;
`;

const SignUpTextDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  font-size: 20px;
  font-weight: 700;
  margin-top: 2vh;
`;

const SignUpEmailPwContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 auto;
  margin-top: 40px;
`;

const SignUpEmailInput = styled.input`
  height: 40px;
  padding-left: 10px;
  background-color: #fbfbfb;
  border: 1px solid #8e8e93;
  font-size: 15px;
`;

const SignUpPwInput = styled.input`
  height: 40px;
  padding-left: 10px;
  background-color: #fbfbfb;
  border: 1px solid #8e8e93;
  font-size: 15px;
  margin-top: 10px;
`;

const SignUpPwConfirmInput = styled.input`
  height: 40px;
  padding-left: 10px;
  background-color: #fbfbfb;
  border: 1px solid #8e8e93;
  font-size: 15px;
  margin-top: 10px;
`;

const NicknameInput = styled.input`
  height: 40px;
  padding-left: 10px;
  background-color: #fbfbfb;
  border: 1px solid #8e8e93;
  font-size: 15px;
  margin-top: 10px;
`;

const AuthWarn = styled.p`
  color: red;
  font-size: 10px;
`;

const SignUpBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 90%;
  margin-top: 20px;
`;

const SignUpBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border: transparent;
  transition: 0.1s;
  background-color: #1882ff;
  color: white;
  font-size: 15px;
  &:hover {
    cursor: pointer;
  }
`;
