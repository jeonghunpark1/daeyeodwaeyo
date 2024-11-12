import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import style from '../../styles/chatting/ChatMidPoint.module.css';

const ChatMidPoint = () => {
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [map, setMap] = useState(null);
    const location = useLocation();
    const [marker, setMarker] = useState(null); // 마커 상태 추가
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get("roomId");
    useEffect(() => {
        console.log("전달된 방 ID:", roomId);
    }, [roomId]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const existingScript = document.getElementById('googleMaps');
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places`;
                script.id = 'googleMaps';
                document.body.appendChild(script);
                script.onload = initializeMap;
            } else {
                initializeMap();
            }
        };

        const initializeMap = () => {
            const mapCenter = { lat: 37.5665, lng: 126.9780 };
            const mapOptions = {
                center: mapCenter,
                zoom: 14,
            };
            const newMap = new window.google.maps.Map(document.getElementById('map'), mapOptions);
            setMap(newMap);
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

    const findMidPoint = () => {
        const geocoder = new window.google.maps.Geocoder();

        if (address1 && address2) {
            geocoder.geocode({ address: address1 }, (results1, status1) => {
                if (status1 === 'OK' && results1[0]) {
                    const location1 = results1[0].geometry.location;
                    geocoder.geocode({ address: address2 }, (results2, status2) => {
                        if (status2 === 'OK' && results2[0]) {
                            const location2 = results2[0].geometry.location;

                            const midLat = (location1.lat() + location2.lat()) / 2;
                            const midLng = (location1.lng() + location2.lng()) / 2;

                            // 이전 마커 삭제
                            if (marker) {
                                marker.setMap(null);
                            }

                            // 새로운 마커 생성
                            const newMarker = new window.google.maps.Marker({
                                position: { lat: midLat, lng: midLng },
                                map: map,
                                title: '중간 지점',
                            });

                            setMarker(newMarker); // 새로운 마커 저장
                            map.setCenter({ lat: midLat, lng: midLng });
                        } else {
                            alert('두 번째 주소를 찾을 수 없습니다.');
                        }
                    });
                } else {
                    alert('첫 번째 주소를 찾을 수 없습니다.');
                }
            });
        } else {
            alert('주소를 모두 입력해주세요.');
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
                <button onClick={findMidPoint} className={style.midButton}>
                    중간 지점 찾기
                </button>
            </div>
        </div>
    );
};

export default ChatMidPoint;
