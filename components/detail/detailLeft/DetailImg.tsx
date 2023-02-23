import Image from 'next/image';
import styled from 'styled-components';

const DetailImg = ({ item }: any) => {
  return (
    <StDetailImgContainer>
      <StDetailImg src={item.imgUrl} alt="image" />
    </StDetailImgContainer>
  );
};

export default DetailImg;

const StDetailImgContainer = styled.div`
  background-color: #f1f1f1;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StDetailImg = styled.img`
  height: 90%;
  width: 90%;
`;