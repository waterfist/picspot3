import Header from '@/components/Header';
import { getData, getFollwing, getUser } from '@/api';
import Profile from '@/components/mypage/Profile';
import Seo from '@/components/Seo';
import { authService } from '@/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { customAlert } from '@/utils/alerts';
import { useState } from 'react';
import CollectionList from '@/components/mypage/CollectionList';
import { uuidv4 } from '@firebase/util';

export default function Mypage() {
  console.log(authService.currentUser?.displayName);
  console.log(authService.currentUser?.photoURL);
  const [currentUser, setCurrentUser] = useState(false);

  // 로그아웃
  const logOut = () => {
    signOut(authService).then(() => {
      // Sign-out successful.
      localStorage.clear();
      setCurrentUser(false);
      customAlert('로그아웃에 성공하였습니다!');
    });
  };
  //* useQuery 사용해서 데이터 불러오기
  const { data } = useQuery('data', getData);
  //* useQuery 사용해서 following 데이터 불러오기
  const {
    data: followingData,
    isLoading,
    isError,
  } = useQuery('followingData', getFollwing);
  // console.log('followingData: ', followingData);

  //* useQuery 사용해서 userData 데이터 불러오기
  const { data: userData } = useQuery('userData', getUser);
  // console.log('userData: ', userData);

  //* 팔로잉한 사람 프로필 닉네임 뽑아오기
  //? 팔로잉한 사람 uid를 배열에 담았습니다.
  const authFollowingUid = followingData
    ?.filter((item: any) => {
      return item.uid === authService?.currentUser?.uid;
    })
    ?.find((item: any) => {
      return item.follow;
    })?.follow;
  // console.log('authFollowingUid: ', authFollowingUid);

  //? user의 item.uid과 팔로잉한 사람 uid의 교집합을 배열에 담았습니다.
  const followingUser = userData?.filter((item: any) =>
    authFollowingUid?.includes(item.uid)
  );
  // console.log('followingUser: ', followingUser);

  if (isLoading) return <h1>로딩 중입니다.</h1>;
  if (isError) return <h1>연결이 원활하지 않습니다.</h1>;

  return (
    <MyContainer>
      <Header />
      <MyTextDiv>
        <Seo title="My" />
        <h1>마이페이지입니다</h1>
      </MyTextDiv>
      <Link href={'//main?city=제주전체'}>
        {authService.currentUser ? (
          <LogoutButton onClick={logOut}>로그아웃</LogoutButton>
        ) : null}
      </Link>
      <MyProfileContainer>
        <Profile />
      </MyProfileContainer>
      <h3>팔로잉 중인사람</h3>
      {followingUser?.map((item: any) => (
        <div key={item.uid} style={{ display: 'flex', flexDirection: 'row' }}>
          <div>{item.userName}</div>
          <Image src={item.userImg} alt="image" height={100} width={100} />
        </div>
      ))}
      <MyKeywordContainer>키워드</MyKeywordContainer>
      {/* 구분하기 위해 임의로 라인 그었습니다! */}
      <CollectionListBox>
        <CollectionList key={uuidv4()} postData={data} />
      </CollectionListBox>
    </MyContainer>
  );
}
const MyContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const MyTextDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const LogoutButton = styled.button``;

const MyProfileContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const MyKeywordContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const CollectionListBox = styled.div`
  border: solid 1px tomato;
`;
