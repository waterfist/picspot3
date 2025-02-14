import React, { useState } from 'react';
import styled from 'styled-components';
import { CustomButton } from '../common/CustomButton';
import Maps from './Maps';

const MapLandingPage = ({
  searchCategory,
  saveLatLng,
  setSaveLatLng,
  saveAddress,
  setSaveAddress,
  setPlace,
  place,
}: any) => {
  const [inputText, setInputText] = useState('');
  const [infoDiv, setInfoDiv] = useState('');
  const onchange = (e: any) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPlace(inputText);
    setInputText('');
  };

  return (
    <MapWrap>
      <StyleContainer>
        <StyledForm onSubmit={handleSubmit}>
          <StyledInfo>{infoDiv}</StyledInfo>
          <StyledInput
            placeholder="제주도 지역명을 검색해주세요."
            onChange={onchange}
            value={inputText}
          />
          <SearchButton type="submit">
            <SearchImage src="/search.svg" />
          </SearchButton>
        </StyledForm>

        <Maps
          searchPlace={place ? place : searchCategory}
          saveLatLng={saveLatLng}
          setSaveLatLng={setSaveLatLng}
          saveAddress={saveAddress}
          setSaveAddress={setSaveAddress}
          setInfoDiv={setInfoDiv}
          infoDiv={infoDiv}
        />
      </StyleContainer>
    </MapWrap>
  );
};

export default MapLandingPage;

const StyleContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const StyledForm = styled.form`
  position: absolute;
  top: 10px;
  z-index: 999;
  width: 80%;
  text-align: center;
`;

const StyledInput = styled.input`
  margin-top: 3%;
  padding: 10px;
  width: 80%;
  border-radius: 15px;
  border: none;
  position: relative;
  box-shadow: 0 3px 2px 1px gray;
  @media ${(props) => props.theme.mobile} {
    margin-top: 5%;
    /* width: 100%; */
  }
`;

const StyledInfo = styled.div`
  color: black;
  background-color: #e7e7e7;

  padding: 10px;
  border: 0.3px solid gray;
  box-shadow: 1px 1px 1px 1px gray;
  opacity: 0.8;
  font-size: 14px;
  margin: auto;
  margin-left: -50px;
  width: 50%;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;
const SearchImage = styled.img`
  width: 15px;
  height: 15px;
`;
const SearchButton = styled.button`
  position: relative;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  background-color: white;
  position: absolute;
  right: 11%;
  bottom: 7%;
  @media ${(props) => props.theme.mobile} {
    display: none;
  }
`;

const MapWrap = styled.div`
  @media ${(props) => props.theme.mobile} {
    width: 375;
    margin-top: 280px;
  }
`;
