import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import style from '../../styles/chatting/ChatMidPoint.module.css';

const ChatMidPoint = () => {
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [map, setMap] = useState(null);
    const [midPointMarker, setMidPointMarker] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState('');
    const location = useLocation();

    let selectedMarker = null; // 마커를 함수 외부에 선언하여 전역 변수로 관리

    const API_KEY = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const existingScript = document.getElementById('googleMaps');
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
                script.id = 'googleMaps';
                document.body.appendChild(script);
                script.onload = initializeMap;
            } else {
                initializeMap();
            }
        };

        const initializeMap = () => {
            const mapCenter = { lat: 37.5665, lng: 126.9780 }; // 서울 중심 좌표
            const newMap = new window.google.maps.Map(document.getElementById('map'), {
                center: mapCenter,
                zoom: 14,
            });
            setMap(newMap);

            newMap.addListener('click', (event) => handleMapClick(event, newMap));
        };

        loadGoogleMapsScript();
    }, []);

    const loadDaumPostcodeScript = (callback) => {
        const existingScript = document.getElementById('daumPostcode');
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            script.id = 'daumPostcode';
            document.body.appendChild(script);
            script.onload = callback;
        } else {
            callback();
        }
    };

    const openAddressSearch = (setAddress) => {
        loadDaumPostcodeScript(() => {
            if (window.daum && window.daum.Postcode) {
                new window.daum.Postcode({
                    oncomplete: function (data) {
                        setAddress(data.address);
                    },
                }).open();
            } else {
                alert('카카오 주소 검색 API를 불러오지 못했습니다.');
            }
        });
    };

    const findMidPoint = async () => {
        if (!address1 || !address2) {
            alert('주소를 모두 입력해주세요.');
            return;
        }

        try {
            const geocoder = new window.google.maps.Geocoder();
            const results1 = await geocoder.geocode({ address: address1 });
            const results2 = await geocoder.geocode({ address: address2 });

            if (results1 && results1.results.length > 0 && results2 && results2.results.length > 0) {
                const location1 = results1.results[0].geometry.location;
                const location2 = results2.results[0].geometry.location;

                const midLat = (location1.lat() + location2.lat()) / 2;
                const midLng = (location1.lng() + location2.lng()) / 2;

                // 기존 중간지점 마커가 있는 경우 위치 이동
                if (midPointMarker) {
                    midPointMarker.setPosition({ lat: midLat, lng: midLng });
                } else {
                    // 중간지점 마커가 없는 경우 새로 생성
                    const newMidPointMarker = new window.google.maps.Marker({
                        position: { lat: midLat, lng: midLng },
                        map: map,
                        title: '중간지점',
                    });
                    setMidPointMarker(newMidPointMarker);
                }
                map.setCenter({ lat: midLat, lng: midLng });
            } else {
                alert('주소를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('중간지점 찾기 에러:', error);
            alert('중간지점을 찾는 중 문제가 발생했습니다.');
        }
    };

    const handleMapClick = async (event, newMap) => {
        const geocoder = new window.google.maps.Geocoder();
        const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };

        try {
            const results = await geocoder.geocode({ location: latLng });
            if (results && results.results.length > 0) {
                const foundAddress = results.results[0].formatted_address;
                setSelectedAddress(foundAddress);

                // 기존 선택된 마커가 있는 경우 위치만 이동
                if (selectedMarker) {
                    selectedMarker.setPosition(latLng);
                } else {
                    // 선택된 마커가 없는 경우 새로 생성
                    selectedMarker = new window.google.maps.Marker({
                        position: latLng,
                        map: newMap,
                        title: '선택된 지점',
                    });
                }
            } else {
                alert('주소를 가져올 수 없습니다.');
            }
        } catch (error) {
            console.error('클릭 에러:', error);
            alert('주소를 가져오는 중 문제가 발생했습니다.');
        }
    };

    const handleSelectAddress = () => {
        if (selectedAddress) {
            console.log('선택된 주소:', selectedAddress);
            window.opener?.postMessage(
                { type: 'ADDRESS_SELECTED', address: selectedAddress },
                window.location.origin
            ); // 부모 창으로 메시지 전송
            window.close(); // 창 닫기
        } else {
            alert('먼저 주소를 선택해주세요.');
        }
    };

    return (
        <div className={style.container}>
            <h2 className={style.title}>중간 거리 찾기</h2>
            <div id="map" className={style.map}></div>
            <div className={style.inputContainer}>
                <div className={style.containerWrap}>
                    <div className={style.firstWrap}>
                        <input
                            type="text"
                            value={address1}
                            onChange={(e) => setAddress1(e.target.value)}
                            placeholder="첫 번째 주소를 입력하세요"
                            className={style.input}
                        />
                        <button onClick={() => openAddressSearch(setAddress1)} className={style.button}>
                            우편 주소
                        </button>
                    </div>
                    <div className={style.secondWrap}>
                        <input
                            type="text"
                            value={address2}
                            onChange={(e) => setAddress2(e.target.value)}
                            placeholder="두 번째 주소를 입력하세요"
                            className={style.input}
                        />
                        <button onClick={() => openAddressSearch(setAddress2)} className={style.button}>
                            우편 주소
                        </button>
                    </div>
                </div>
                <div className={style.containerWrap}>
                    <button onClick={findMidPoint} className={style.midButton}>
                        중간 지점 찾기
                    </button>
                    <div className={style.selectedAddressBox}>
                        <input
                            type="text"
                            value={selectedAddress}
                            readOnly
                            className={style.selectedAddressInput}
                            placeholder="선택된 주소"
                        />
                        <button onClick={handleSelectAddress} className={style.selectButton}>
                            선택
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMidPoint;
