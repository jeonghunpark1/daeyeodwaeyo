import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import style from "../styles/productDetail.module.css"

export default function ProductDetail() {

  const location = useLocation();

  const productId = location.state.productId || "";

  const [productDetail, setProductDetail] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 이미지 인덱스 상태
  const productImageBoxRef = useRef(null); // 이미지 컨테이너 참조

  const [selectContentPreview, setSelectContentPreview] = useState("selectImage");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const requestProductImageURL = (productImage) => {
    const productImageURL = "http://localhost:8080/productImagePath/" + productImage;
    return productImageURL;
  };

  const requestProductVideoURL = (productVideo) => {
    const productVideoURL = "http://localhost:8080/productVideoPath/" + productVideo;
    console.log("동영상 URL: ", productVideoURL);
    return productVideoURL;
  };

  const handelSelectContentPreview = (current, change) => {
    if (current === change) {
      if (change === "selectImage") {
        setSelectContentPreview("selectVideo");
      }
      else if (change === "selectVideo") {
        setSelectContentPreview("selectImage");
      }
    } else {
      // setSelectContentPreview(current);
      return;
    }
  }

  // 이미지 미리보기
  const previewImage = (image, index) => {
    return (
      <div key={index} className={style.product_select_image_wrap}>
        <img
          className={style.product_select_image}
            src={URL.createObjectURL(image)}
            alt={`Preview ${index + 1}`}
        ></img>
      </div>
    );
  };

  // 스크롤 시 이미지 위치 계산 핸들러
  const handleScroll = () => {
    if (productImageBoxRef.current) {
      const scrollLeft = productImageBoxRef.current.scrollLeft;
      const width = productImageBoxRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / width);
      setCurrentImageIndex(newIndex);
    }
  };

  // 스크롤 이동 시 스냅처럼 처리
  const handleScrollEnd = () => {
    if (productImageBoxRef.current) {
      const width = productImageBoxRef.current.offsetWidth;
      productImageBoxRef.current.scrollTo({
        left: currentImageIndex * width,
        behavior: 'smooth'
      });
    }
  };

  // 현재 표시할 점들의 시작 인덱스를 계산하는 함수
  const getVisibleDots = () => {
    const totalImages = productDetail.imageUrls.length;
    const maxVisibleDots = 5; // 보이는 점 개수
    if (totalImages <= maxVisibleDots) {
      return Array.from({ length: totalImages }, (_, i) => i);
    }

    const middleIndex = Math.floor(maxVisibleDots / 2);
    if (currentImageIndex < middleIndex) {
      return Array.from({ length: maxVisibleDots }, (_, i) => i);
    } else if (currentImageIndex > totalImages - middleIndex -1) {
      return Array.from({ length: maxVisibleDots }, (_, i) => totalImages - maxVisibleDots + i);
    } else {
      return Array.from({ length: maxVisibleDots }, (_, i) => currentImageIndex - middleIndex + i);
    }
  };

  const formatDateForInput = (dateString) => {
    // 초 부분을 제거하고 'yyyy-MM-ddTHH:mm' 형식으로 반환
    return dateString.slice(0, 16);
    
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products/detailInfo", {
          params: { productId }
        });
        setProductDetail(response.data); // 상품 정보를 상태에 저장
        console.log("productDetail", response.data);
      } catch (err) {
        console.log("error: ", err);
      }
    };

    // 비동기 함수 호출
    fetchProductDetail();
  }, [productId]); // productId가 변경될 때마다 useEffect가 다시 실행됨

  return (
    <div className={style.productDetail_page}>
      {/* {productId}
      {productDetail ? (
        <div>
          <h2>{productDetail.title}</h2>
          {productDetail.id}
          {productDetail.name}
          {productDetail.category}
          {productDetail.price}
          {productDetail.startDate}
          {productDetail.endDate}
          {productDetail.description}
          {productDetail.createdAt}
          {productDetail.writerId}
          <img src={requestProductImageURL(productDetail.imageUrls[0])} alt="상품 사진" />
          <video className={style.product_select_video} controls>
            <source src={requestProductVideoURL(productDetail.videoUrl)} type="video/mp4"/>
            브라우저에서 비디오를 지원하지 않습니다.
          </video>
        </div>
      ) : (
        <p>Loading...</p>
      )} */}
      {productDetail ? (
        <div className={style.productDetail_content_wrap}>
          <div className={style.product_title_writer_wrap}>
            {/* <div className={style.productWriterId_wrap}>
              {productDetail.writerId}
            </div> */}
            <div className={style.productTitle_wrap}>
              <h2 className={style.productTitle}>
                {productDetail.title}
              </h2>
            </div>
          </div>  
          <div className={style.product_category_name_wrap}>
            <div className={style.productCategory_wrap}>
              {productDetail.category}
            </div>
            <div className={style.productName_wrap}>
              {productDetail.name}
            </div>
          </div>
          <div className={style.productDetail_image_info_wrap}>
            <div className={style.productDetail_image_wrap}>
              <div className={style.product_imageOrVideo_box}>
                <div className={style.imageOrVideo_wrap}>
                  <div className={`${style.selectBox} ${selectContentPreview === "selectImage" ? style.selectImage : style.selectVideo}`}></div>
                  <div className={style.image_wrap} onClick={() => {handelSelectContentPreview(selectContentPreview, "selectVideo");}}>
                    이미지
                  </div>
                  <div className={style.video_wrap} onClick={() => {handelSelectContentPreview(selectContentPreview, "selectImage");}}>
                    동영상
                  </div>
                </div>
              </div>
              <div className={style.productImage_box} ref={productImageBoxRef} onScroll={handleScroll} onMouseUp={handleScrollEnd}>
                {selectContentPreview === "selectImage" && productDetail.imageUrls && productDetail.imageUrls.map((imageUrl, index) => (
                  <div className={style.productImage_wrap} key={index}>
                    <img className={style.productImage} src={requestProductImageURL(imageUrl)} alt={`상품 이미지 ${index + 1}`} />
                  </div>
                ))} 
                {selectContentPreview === "selectVideo" && productDetail.videoUrl && (
                  <video className={style.productVideo_wrap} controls>
                    <source src={requestProductVideoURL(productDetail.videoUrl)} type="video/mp4"/>
                    브라우저에서 비디오를 지원하지 않습니다.
                  </video>
                )}
              </div>
              {/* 이미지 점 표시 */}
              <div className={style.dots_container}>
                {selectContentPreview === "selectImage" && getVisibleDots().map((dotIndex) => (
                  <div key={dotIndex} className={`${style.dot} ${dotIndex === currentImageIndex ? style.active_dot : ""}`}> </div>
                ))}
              </div> 
            </div>
            <div className={style.productDetail_info_wrap}>
              <div className={style.product_info_wrap}>
                <div className={style.product_start_end_date_wrap}>
                
                
                  <div className={style.productStartDate_wrap}>
                  {productDetail.startDate}
                  
                    <label className={style.productStartDate_label}>렌트 시작 날짜</label>
                    <input className={`${style.productStartDate} ${style.input_date}`} type="date" min={formatDateForInput(productDetail.startDate)} max={formatDateForInput(productDetail.endDate)} onChange={(e) => {setStartDate(e.target.value)}} value={startDate}></input>
                  </div>
                  <div className={style.productEndDate_wrap}>
                  {productDetail.endDate}
                  
                    <label className={style.productEndDate_label}>렌트 종료 날짜</label>
                    <input className={`${style.productEndDate} ${style.input_date}`} type="date" min={formatDateForInput(productDetail.startDate)} max={formatDateForInput(productDetail.endDate)} onChange={(e) => {setEndDate(e.target.value)}} value={endDate}></input>
                  </div>
                </div>
              </div>
              
              price
              start_date
              end_date
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      
    </div>
  )
}
