import Header from '@/components/Header';
import { getData, postCounter } from '@/api';
import Seo from '@/components/Seo';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import CommentList from '@/components/detail/detailRight/CommentList';
import FollowingButton from '@/components/detail/detailLeft/FollowingButton';
import DetailMap from '@/components/detail/detailRight/DetailMap';
import CollectionButton from '@/components/detail/detailLeft/CollectionButton';
import DetailImg from '@/components/detail/detailLeft/DetailImg';
import DetailProfile from '@/components/detail/detailLeft/DetailProfile';
import DetailList from '@/components/detail/detailRight/DetailList';
import DataError from '@/components/common/DataError';
import DataLoading from '@/components/common/DataLoading';

const Post = ({ id }: any) => {
  // console.log('id: ', id);

  //* Map 관련
  //? category 클릭, 검색 시 map이동에 관한 통합 state
  const [searchCategory, setSearchCategory]: any = useState('');
  const [saveLatLng, setSaveLatLng]: any = useState([]);
  const [saveAddress, setSaveAddress]: any = useState('');

  //? 카테고리버튼 눌렀을 때 실행하는 함수
  const [place, setPlace] = useState('');
  const onClickEditTown = (e: any) => {
    setPlace('');
    setEditTown(e.target.value);
    setSearchCategory(e.target.value);
  };

  //* Text 관련
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editTown, setEditTown] = useState('');

  //* input 토글
  const [inputToggle, setInputToggle] = useState(false);

  //* collection 저장 state
  const [isOpen, setIsOpen] = useState(false);

  // const [imageUpload, setImageUpload]: any = useState(null); //* 이미지 업로드 상태값
  // const editImg = { imgUrl: '' }; //* 이미지 수정 시 보내주는 데이터

  const [editBtnToggle, setEditBtnToggle]: any = useState(false); //* 수정 토글 상태값

  //* 데이터 수정 시 보내주는 데이터
  let editData = {
    title: editTitle,
    content: editContent,
    city: editCity,
    town: editTown,
    lat: saveLatLng.Ma,
    long: saveLatLng.La,
    address: saveAddress,
  };

  //* 게시물 수정 버튼을 눌렀을때 실행하는 함수
  const onClickEditToggle = () => {
    setEditBtnToggle(!editBtnToggle);
  };

  //! useQuery 사용해서 포스트 데이터 불러오기
  const {
    data: detail,
    isLoading,
    isError,
  } = useQuery('detailData', getData, {
    staleTime: 60 * 1000, // 1분, default >> 0
    cacheTime: 60 * 5 * 1000, // 5분, default >> 5분
  });

  const queryClient = useQueryClient();

  //* mutation 사용해서 counting값 보내기
  const { mutate: countMutate } = useMutation(postCounter, {
    onSuccess: () => {
      queryClient.invalidateQueries('detailData');
    },
  });

  //* 변화된 counting 값 인지
  useEffect(() => {
    countMutate(id);
  }, []);

  if (isLoading) return <DataLoading />;
  if (isError) return <DataError />;

  return (
    <DetailContainer>
      <Seo title="Detail" />
      <Header selectCity={undefined} onChangeSelectCity={undefined} />

      {detail
        ?.filter((item: any) => {
          return item.id === id;
        })
        .map((item: any) => (
          <DetailContents key={item.id}>
            <ImgAndProfileAndFollowingAndCollection>
              <DetailImg
                item={item}
                // imageUpload={imageUpload}
                // setImageUpload={setImageUpload}
                // editImg={editImg}
              />

              <ProfileAndFollowingAndCollection>
                <ProfileAndFollwing>
                  <DetailProfile item={item} />
                </ProfileAndFollwing>

                <FollowingButton item={item} />
                <CollectionButton item={item} />
              </ProfileAndFollowingAndCollection>
            </ImgAndProfileAndFollowingAndCollection>

            <ListAndMapAndComment>
              <DetailList
                item={item}
                editBtnToggle={editBtnToggle}
                onClickEditToggle={onClickEditToggle}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editContent={editContent}
                setEditContent={setEditContent}
                editCity={editCity}
                setEditCity={setEditCity}
                editTown={editTown}
                setEditTown={setEditTown}
                onClickEditTown={onClickEditTown}
                editData={editData}
                saveLatLng={saveLatLng}
                setSaveLatLng={setSaveLatLng}
                saveAddress={saveAddress}
                setSaveAddress={setSaveAddress}
                setEditBtnToggle={setEditBtnToggle}
                setPlace={setPlace}
                place={place}
              />

              <DetailMap
                item={item}
                editBtnToggle={editBtnToggle}
                setEditBtnToggle={setEditBtnToggle}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                inputToggle={inputToggle}
                searchCategory={searchCategory}
                saveLatLng={saveLatLng}
                setSaveLatLng={setSaveLatLng}
                saveAddress={saveAddress}
                setSaveAddress={setSaveAddress}
                setPlace={setPlace}
                place={place}
              />

              <CommentList postId={id} />
            </ListAndMapAndComment>
          </DetailContents>
        ))}
    </DetailContainer>
  );
};

export default Post;

const DetailContainer = styled.div`
  position: relative;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
  }
`;

const DetailContents = styled.div`
  top: 50px;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 600px;
  @media ${(props) => props.theme.mobile} {
    flex-direction: column;
    width: 100%;
    height: auto;
    margin-top: 40px;
  }
`;

const ImgAndProfileAndFollowingAndCollection = styled.div`
  width: 400px;
  @media ${(props) => props.theme.mobile} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 400px;
  }
`;

const ProfileAndFollowingAndCollection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 350px;
  padding-top: 20px;
  @media ${(props) => props.theme.mobile} {
    height: 50px;
    padding-top: 0px;
    margin-top: 10px;
  }
`;

const ProfileAndFollwing = styled.div`
  display: flex;
  /* justify-content: space-between; */
`;

const ListAndMapAndComment = styled.div`
  width: 650px;
  @media ${(props) => props.theme.mobile} {
    flex-direction: column;
    width: 100%;
  }
`;

//* SSR방식으로 server에서 id 값 보내기
export async function getServerSideProps(context: { params: any }) {
  const { params } = context;
  const { id }: any = params;
  return {
    props: {
      id: id,
    },
  };
}
