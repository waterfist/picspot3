import { authService, dbService } from '@/firebase';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import MyCollectItem from './MyCollectItem';

const Town = ({ value }: { value: string }) => {
  //* post town 기준 데이터 가져오기
  const getTownData = async ({ queryKey }: { queryKey: string[] }) => {
    const [_, town] = queryKey;
    const response: any = [];
    let q = query(
      collection(dbService, 'post'),
      where('town', '==', town),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      response.push({ id: doc.id, ...doc.data() });
    });
    console.log('컬렉션 카테고리 데이터를 불러왔습니다.');

    return response;
  };

  //* useQuery 사용해서 town 데이터 불러오기
  //* => 해당 town의 data들
  const { data } = useQuery(['data', value], getTownData);
  // console.log('data:', data);

  //* town데이터 creator 와 내 id가 같으면 그 item을 출력
  const myPostList = data?.filter(
    (item: any) => item.creator === authService.currentUser?.uid
  );
  // console.log('myPostList', myPostList);

  return (
    <TownWrap>
      <div>{value}</div>
      {myPostList?.map((item: any) => (
        <MyCollectItem item={item} />
      ))}
    </TownWrap>
  );
};

export default Town;

const TownWrap = styled.div`
  width: 300px;
  height: 300px;
  border: solid 1px tomato;
`;
