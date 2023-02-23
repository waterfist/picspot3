import { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { authService } from '@/firebase';
import AuthSocial from './AuthSocial';
import { customAlert } from '@/utils/alerts';

interface AuthForm {
  email: string;
}
interface Props {
  closeLoginModal: () => void;
  changeModalButton: () => void;
  forgotModalButton: () => void;
}

const Auth = (props: Props): JSX.Element => {
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  // const [isRemember, setIsRemember] = useState<boolean>(false);

  const {
    register,
    formState: { errors },
  } = useForm<AuthForm>({ mode: 'onBlur' });

  const onClickLoginHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (error !== '') setError('');

    setAuthenticating(true);
    await signInWithEmailAndPassword(authService, email, password)
      .then((res) => {
        customAlert('로그인에 성공하였습니다!');
        props.closeLoginModal();
      })
      .catch(() => {
        alert('로그인 실패, 다시 입력해주세요');
        setAuthenticating(false);
        setError('Failed Login');
      });
  };

  return (
    <LoginContainer className="modalBody" onClick={(e) => e.stopPropagation()}>
      <LoginTextDiv>
        <div>
          <b>픽스팟에 로그인</b> 하고, <br></br>
          제주 인생샷 알아보세요!
        </div>
      </LoginTextDiv>

      <form>
        <LoginEmailPwContainer>
          <LoginEmailInput
            {...register('email', {
              required: '*등록되지 않은 아이디예요',
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: '*등록되지 않은 아이디예요',
              },
            })}
            name="email"
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="이메일을 입력 해주세요"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                onClickLoginHandler(e);
              }
            }}
          />
          <LoginPwInput
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호를 입력 해주세요"
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                onClickLoginHandler(e);
              }
            }}
          />
          <AuthWarn>{errors?.email?.message}</AuthWarn>
        </LoginEmailPwContainer>

        <LoginBtnContainer>
          <LoginBtn
            type="submit"
            disabled={authenticating}
            onClick={(e) => onClickLoginHandler(e)}
          >
            <div>로그인 하기</div>
          </LoginBtn>
        </LoginBtnContainer>
      </form>

      <PwForgotContainer onClick={props.forgotModalButton}>
        <LoginCheckSignDiv>아이디/패스워드를 잊으셨나요?</LoginCheckSignDiv>
      </PwForgotContainer>

      <LoginGoogleContainer>
        <AuthSocial closeModal={props.closeLoginModal} />
      </LoginGoogleContainer>

      <LoginCheckContainer onClick={props.changeModalButton}>
        <LoginCheckSignDiv>회원가입</LoginCheckSignDiv>
      </LoginCheckContainer>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  background-color: #ffffff;
  /* padding: 40px; */
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
`;

const LoginTextDiv = styled.div`
  margin-top: 1vh;
  font-family: 'Noto Sans CJK KR';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 138.5%;
  text-align: center;
  color: #212121;
`;

const LoginEmailPwContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 auto;
  margin-top: 30px;
`;

const LoginEmailInput = styled.input`
  height: 48px;
  padding-left: 10px;
  background-color: #fbfbfb;
  border: 1px solid #8e8e93;
`;

const LoginPwInput = styled.input`
  height: 48px;
  padding-left: 10px;
  background-color: #fbfbfb;
  border: 1px solid #8e8e93;
  margin-top: 30px;
`;

const AuthWarn = styled.p`
  color: red;
  font-size: 12px;
  font-weight: 700px;
`;

const LoginBtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 90%;
`;

const LoginBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  border: transparent;
  margin-top: 20px;
  transition: 0.1s;
  background-color: #1882ff;
  color: white;
  &:hover {
    cursor: pointer;
  }
`;

const PwForgotContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  transition: color 0.2s ease-in;
  margin-top: 10px;
  color: #1882ff;
`;

const LoginGoogleContainer = styled.div`
  display: flex;
  width: 90%;
  margin: 0 auto;
  margin-top: 30px;
`;

const LoginCheckContainer = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  transition: color 0.2s ease-in;
  margin-top: 10px;
  color: #1882ff;
`;

const LoginCheckSignDiv = styled.div`
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
`;

export default Auth;
