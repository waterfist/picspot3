import Image from 'next/image';
import {
  Map,
  MapMarker,
  MapTypeControl,
  ZoomControl,
} from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import DetailMapLanding from './DetailMapLanding';

const DetailMap = ({
  item,
  editBtnToggle,
  setIsOpen,
  searchCategory,
  saveLatLng,
  setSaveLatLng,
  saveAddress,
  setSaveAddress,
  setPlace,
  place,
}: any) => {
  if (editBtnToggle) {
    return (
      <div>
        <DetailMapLanding
          searchCategory={searchCategory}
          saveLatLng={saveLatLng}
          setSaveLatLng={setSaveLatLng}
          saveAddress={saveAddress}
          setSaveAddress={setSaveAddress}
          setPlace={setPlace}
          place={place}
        />
      </div>
    );
  }

  return (
    <MapContainer>
      <Map // 지도를 표시할 Container
        center={{
          // 지도의 중심좌표
          lat: item.lat,
          lng: item.long,
        }}
        style={{
          // 지도의 크기
          width: '100%',
          height: '230px',
        }}
        level={11} // 지도의 확대 레벨
      >
        <MapMarker
          position={{
            // 지도의 중심좌표
            lat: item.lat,
            lng: item.long,
          }}
          onClick={() => setIsOpen(true)}
        />
        <ZoomControl position={kakao.maps.ControlPosition?.RIGHT} />
        <MapTypeControl position={kakao.maps.ControlPosition?.TOPRIGHT} />
      </Map>
    </MapContainer>
  );
};

export default DetailMap;

const MapContainer = styled.div`
  @media ${(props) => props.theme.mobile} {
    width: 350px;
    margin: auto;
  }
`;
