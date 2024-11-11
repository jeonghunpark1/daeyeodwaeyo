import React from 'react'

import style from "../styles/shortBox.module.css"
import { useNavigate } from 'react-router-dom';

export default function ShortBox({ short }) {

  const navigate = useNavigate();

  // 동영상 URL을 반환하는 함수
  const requestProductVideoURL = (productVideo) => {
    return `http://localhost:8080/productVideoPath/${productVideo}`;
  };

  const handleProductClick = (product_id) => {
    navigate("/productDetail", { state: {productId: product_id} })
  }

  // 비디오 재생 핸들러
  const handleVideoPlay = (videoElement) => {
    if (videoElement) {
      videoElement.play().catch((e) => {
        console.error("Play request interrupted", e);
      });
    }
  };

  // 비디오 일시 정지 핸들러
  const handleVideoPause = (videoElement) => {
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0; // 재생 위치를 처음으로 되돌림
    }
  };

  return (
    <div key={short.id} className={style.short_box} onMouseEnter={() => handleVideoPlay(document.getElementById(`video-${short.id}`))} onMouseLeave={() => handleVideoPause(document.getElementById(`video-${short.id}`))}>
      <video id={`video-${short.id}`} className={style.short_video} src={requestProductVideoURL(short.videoUrl)} type="video/mp4" muted loop/>
      <div className={style.videoInfo_wrap}>
        <div className={style.product_title_wrap} onClick={() => {handleProductClick(short.id)}}>
          {short.title}
        </div>
        <div className={style.product_category_name_wrap}>
          <div className={style.product_category}>
            {short.category}
          </div>
          <div className={style.product_name}>
            {short.name}
          </div>
        </div>
      </div>
    </div>
  )
}
