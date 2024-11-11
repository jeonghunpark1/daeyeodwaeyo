import React, { useEffect, useRef, useState } from 'react';
import style from "../styles/shorts.module.css";
import axios from 'axios';
import { IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

export default function Shorts() {

  const navigate = useNavigate();

  const [productVideos, setProductVideos] = useState([]);
  const [loadedVideos, setLoadedVideos] = useState([]); // 로딩된 비디오 목록 상태
  const videoRefs = useRef([]);
  const [isMuted, setIsMuted] = useState(true);
  const [showIcon, setShowIcon] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보이는 비디오 인덱스

  const fetchAndShuffleVideos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products/shorts");
      console.log("API Response:", response.data); // 데이터 확인을 위한 로그
      const videoList = response.data;
      const shuffledVideos = videoList.sort(() => Math.random() - 0.5);
      setProductVideos(shuffledVideos);
    } catch (error) {
      console.error("Failed to fetch video list:", error);
    }
  };
  
  useEffect(() => {
    fetchAndShuffleVideos();
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5, // 비디오의 50% 이상이 보일 때 트리거
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          const currentVideoIndex = videoRefs.current.indexOf(entry.target);
          
          // 현재 인덱스의 바로 앞이나 바로 뒤에 있는 경우에만 업데이트
          if (Math.abs(currentIndex - currentVideoIndex) === 1) {
            setCurrentIndex(currentVideoIndex);
          }

          if (video.paused && video.readyState >= 3) {
            video.play().catch((e) => {
              console.error("Play request interrupted", e);
            });
          }
        } else {
          video.pause(); // 50% 미만이 보이면 비디오 일시 정지
          video.currentTime = 0; // 재생 위치를 처음으로 되돌림
        }
      });
    }, observerOptions);
  
    // 비디오 요소들을 한 번만 관찰하도록 설정
    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });
  
    // 컴포넌트가 언마운트될 때 옵저버 해제
    return () => observer.disconnect();
  }, [loadedVideos]); // loadedVideos가 변경될 때마다 옵저버를 업데이트
  

  // currentIndex 변경에 따라 로딩할 비디오 목록 설정
  useEffect(() => {
    let numOfLoadVideo = 2;
    const startIndex = Math.max(0, currentIndex - numOfLoadVideo);
    let endIndex = 0;

    if ((productVideos.length - 1) - (currentIndex + numOfLoadVideo) < 0) {
      
      endIndex = currentIndex + ((productVideos.length - 1) - (currentIndex + numOfLoadVideo) + numOfLoadVideo);
    } else {
      endIndex = Math.min(currentIndex + numOfLoadVideo);
    }

    console.log("Start Index:", startIndex, "End Index:", endIndex);
    setLoadedVideos(productVideos.slice(startIndex, endIndex));
    console.log("productVideos", productVideos);
    console.log("loaded video:", loadedVideos);
  }, [currentIndex, productVideos]);
  
  

  // 음소거 상태를 토글하는 함수
  const toggleMute = () => {
    setIsMuted(prevMuted => !prevMuted);
    setShowIcon(true); // 아이콘을 표시
    setTimeout(() => setShowIcon(false), 1000); // 1초 후 아이콘을 숨김
  };

  // 음소거 상태가 변경될 때 비디오 요소에 반영
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = isMuted;
      }
    });
  }, [isMuted]);

  // 동영상 URL을 반환하는 함수
  const requestProductVideoURL = (productVideo) => {
    return `http://localhost:8080/productVideoPath/${productVideo}`;
  };

  // // 현재 보여지는 비디오와 앞뒤로 2개의 비디오만 로딩하도록 필터링
  // const getVideosToRender = () => {
  //   const startIndex = Math.max(0, currentIndex - 2);
  //   const endIndex = Math.min(productVideos.length - 1, currentIndex + 2);
  //   return productVideos.slice(startIndex, endIndex + 1);
  // };

  // currentIndex가 변경될 때마다 값을 콘솔에 출력하는 useEffect
  useEffect(() => {
    console.log("Current Index:", currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    console.log("Video Refs:", videoRefs.current);
  }, [productVideos]);
  
  const handleProductClick = (product_id) => {
    navigate("/productDetail", { state: {productId: product_id} })
  }

  return (
    <div className={style.shorts_page}>
      <div className={`${style.shorts_content} video-container`}>
        {loadedVideos.map((product, index) => {
          // 실제 렌더링되는 인덱스를 원래의 인덱스와 맞추기 위해 계산
          const actualIndex = Math.max(0, currentIndex - 2) + index;
          return (
            <div key={actualIndex} className={style.videoWrapper}>
              <video
                className={style.video}
                ref={(el) => {
                  if (el && !videoRefs.current.includes(el)) {
                    videoRefs.current[actualIndex] = el;
                  }
                }}
                src={requestProductVideoURL(product.videoUrl)}
                type="video/mp4"
                muted={isMuted}
                onClick={toggleMute}
                loop
              />
              
              {/* 음소거 아이콘 표시 */}
              {showIcon && (
                <div className={style.iconOverlay}>
                  {isMuted ? <IoVolumeMute className={style.soundIcon}/> : <IoVolumeHigh className={style.soundIcon}/>}
                </div>
              )}

              <div className={style.videoInfo_wrap}>
                <div className={style.product_title_wrap} onClick={() => {handleProductClick(product.id)}}>
                  {product.title}
                </div>
                <div className={style.product_category_name_wrap}>
                  <div className={style.product_category}>
                    {product.category}
                  </div>
                  <div className={style.product_name}>
                    {product.name}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}