import { authService } from '@/firebase';
import Link from 'next/link';
import { ChangeEventHandler, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { loginModalAtom } from '@/atom';

const Header = ({
  selectCity,
  onChangeSelectCity,
}: {
  selectCity: string | undefined;
  onChangeSelectCity: ChangeEventHandler<HTMLSelectElement> | undefined;
}) => {
  const [currentUser, setCurrentUser] = useState(false);
  const [closeLoginModal, setCloseLoginModal] = useRecoilState(loginModalAtom);
  const [userImg, setUserImg] = useState<string | null>(null);
  const router = useRouter();
  const nowUser = authService.currentUser;
  // 로그인 모달 창 버튼
  const closeLoginModalButton = () => {
    setCloseLoginModal(!closeLoginModal);
  };

  useEffect(() => {
    if (authService.currentUser) {
      setCurrentUser(true);
      setUserImg(authService.currentUser.photoURL);
    }
  }, [nowUser]);
  return (
    <HeaderContainer>
      {/* picspot */}
      <Link
        href="/main?city=제주전체"
        style={{ color: 'black', textDecorationLine: 'none' }}
      >
        <Title
          onClick={() => {
            // sessionStorage.clear();
            localStorage.clear();
          }}
        >
          <LogoImg src="/logo.png" alt="logo" />
        </Title>
      </Link>
      {router.route === '/main' ? (
        <CityCategory value={selectCity} onChange={onChangeSelectCity}>
          <option value="제주전체">제주전체</option>
          <option value="제주시">제주시</option>
          <option value="서귀포시">서귀포시</option>
        </CityCategory>
      ) : null}
      {/* 로그인, 로그아웃, 마이페이지 버튼 */}
      {currentUser ? (
        <div onClick={() => router.push('/mypage')}>
          <Profile>
            {userImg ? (
              <ProfileImg src={userImg} alt="profile" />
            ) : (
              <ProfileImg src="/profileicon.svg" alt="profile" />
            )}
          </Profile>
        </div>
      ) : (
        <div onClick={closeLoginModalButton}>
          <Profile>
            <ProfileImg src="/profileicon.svg" alt="profile" />
          </Profile>
        </div>
      )}
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.div`
  background-color: white;
  display: flex;
  width: 1440px;
  margin: auto;
  padding: 0 37px 0 37px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  height: 70px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.08);
  /* @media only screen and (max-width: 1400px) {
    width: 1200px;
    margin: 0px;
  }
  @media only screen and (max-width: 900px) {
    width: 760px;
    margin: 0px;
  }
  @media only screen and (max-width: 600px) {
    width: 380px;
    margin: 0px;
  } */
  @media ${(props) => props.theme.mobile} {
    width: 375px;
    height: 70px;
    margin: 0;
    padding: 0;
    box-shadow: none;
  }
`;
const Title = styled.div`
  width: 107px;
  font-weight: 900;
  font-size: 24px;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    margin-left: 12px;
    width: inherit;
  }
`;

const LogoImg = styled.img`
  width: 107px;
  height: 29px;
  @media ${(props) => props.theme.mobile} {
    width: 92px;
    height: 25px;
  }
`;

const CityCategory = styled.select`
  text-align: center;
  background-color: inherit;
  font-size: 24px;
  border: none;
  height: 40px;
  z-index: 1;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const HeaderRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Menu = styled.img`
  display: none;
  @media ${(props) => props.theme.mobile} {
    display: inherit;
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }
`;
const Profile = styled.div`
  width: 107px;
  background-color: inherit;
  @media ${(props) => props.theme.mobile} {
    width: inherit;
    margin-right: 12px;
  }
`;
const ProfileImg = styled.img`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;
