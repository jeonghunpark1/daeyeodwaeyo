import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TiThMenu } from "react-icons/ti";
import { TiThMenuOutline } from "react-icons/ti";
import style from "../styles/productDetail.module.css"
import ReviewList from './ReviewList';

import { API_BASE_URL } from '../utils/constants';

export default function ProductDetail( {loggedInUserId, chatWindowRef} ) {

  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.state.productId || "";
  const [productDetail, setProductDetail] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 이미지 인덱스 상태
  const productImageBoxRef = useRef(null); // 이미지 컨테이너 참조
  const [selectContentPreview, setSelectContentPreview] = useState("selectImage");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lentPeriod, setLentPeriod] = useState(0);
  const [lentPrice, setLentPrice] = useState(0);
  const [reviews, setReviews] = useState([]);

  // 토글 메뉴
  const [isMenuOpen, setIsMenuOpen] = useState({
    postMenu: false,
  });
  // 리뷰 가져오기
  useEffect(() => {
    // 리뷰 가져오기
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/reviews/product/${productId}`);
        console.log("리뷰 데이터:", response.data); // 리뷰 데이터 확인
        setReviews(response.data);
      } catch (error) {
        console.error("리뷰 가져오기 실패:", error);
      }
    };

    // 상품 상세 정보 가져오기
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/detailInfo`, {
          params: { productId }
        });
        console.log("상품 상세 데이터:", response.data); // 상품 데이터 확인
        setProductDetail(response.data);
        setLentPrice(response.data.price);
      } catch (error) {
        console.error("상품 상세 정보 가져오기 실패:", error);
      }
    };

    fetchProductDetail();
    fetchReviews();
  }, [productId]); // productId 변경 시 재호출



  const toggleMenu = (menu) => {
    setIsMenuOpen(prevState => ({
      ...prevState,
      [menu]: !prevState[menu] // 해당 메뉴 상태를 토글
    }));
    console.log("postMenu", isMenuOpen.postMenu);
  }

  const requestProductImageURL = (productImage) => {
    const productImageURL = `${API_BASE_URL}/api/productImagePath/` + productImage;
    return productImageURL;
  };

  const requestProductVideoURL = (productVideo) => {
    const productVideoURL = `${API_BASE_URL}/api/productVideoPath/` + productVideo;
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

  // price에 천단위 콤마 추가
  const priceAddComma = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // 렌트 날짜 선택
  const chooseLentPeriod = (type, value) => {
    if (type === "startDate") {
      if (endDate) {
        if (value < endDate || value == endDate) {
          setStartDate(value);
        }
        else {
          alert("종료일 이전 날짜로 선택해주세요.");
        }
      }
      else {
        setStartDate(value);
      }
    }
    else if (type === "endDate") {
      if (startDate) {
        if (value > startDate || value == startDate) {
          setEndDate(value);
        }
        else {
          alert("시작일 이후 날짜로 선택해주세요.");
        }
      }
      else {
        setEndDate(value);
      }
    }
    else {
      console("type 입력 오류");
    }
  }

  useEffect(() => {
    if (startDate && endDate) {
      // 날짜 객체로 변환
      let s_date = new Date(startDate);
      let e_date = new Date(endDate);

      // 두 날짜 간의 시간 차이를 밀리초 단위로 계산
      let diffTime = e_date.getTime() - s_date.getTime();

      // 밀리초를 일 단위로 변환
      let diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;

      console.log(diffDays);
      setLentPeriod(diffDays);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (productDetail) {
      if (lentPeriod === 0) {
        setLentPrice(productDetail.price);
      }
      setLentPrice(productDetail.price * lentPeriod);
    }
  }, [lentPeriod])

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/detailInfo`, {
          params: { productId }
        });
        setProductDetail(response.data); // 상품 정보를 상태에 저장
        console.log("productDetail", response.data);
        setLentPrice(response.data.price);
      } catch (err) {
        console.log("error: ", err);
      }
    };

    // 비동기 함수 호출
    fetchProductDetail();
  }, [productId]); // productId가 변경될 때마다 useEffect가 다시 실행됨

  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/products/remove/${productId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // 토큰과 함께 전송
        }
      });
      if (response.status === 200) {
        alert("상품이 삭제되었습니다.")
        navigate(-1) // 이전 페이지로 이동
      }
    } catch (err) {
      console.log("error: ", err);
      alert("상품 삭제 중 오류가 발생했습니다.");
    }
  }

  const handleLentButton = async (writerId) => {
    try {
      // 채팅방 생성 또는 조회 요청
      const response = await axios.post(`${API_BASE_URL}/api/chat/findOrCreateRoom`, {
        joinerId: writerId,
        productId: productId, // productId도 함께 전송

      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // 토큰과 함께 전송
        }
      });

      // 채팅방 생성 성공 시 chatRoomId를 가져옴
      console.log("API 응답 데이터:", response.data);
      const roomId = response.data.chatRoomId; // chatRoomId로 변경

      // roomId가 undefined가 아닌지 확인
      if (!roomId) {
        console.error("채팅방 ID(roomId)가 없습니다. 응답 데이터를 확인하세요:", response.data);
        alert("채팅방 생성에 문제가 발생했습니다. 다시 시도해주세요.");
        return;
      }

      // ChatHome 팝업 열기
      const chatHomeUrl = '/ChatHome';
      if (chatWindowRef.current && !chatWindowRef.current.closed) {
        console.log("이미 열린 ChatHome 창이 있습니다. 포커스를 맞춥니다.");
        chatWindowRef.current.focus();
      } else {
        console.log("새 ChatHome 창을 엽니다.");
        chatWindowRef.current = window.open(chatHomeUrl, 'ChatHome', 'width=400,height=600');
        if (!chatWindowRef.current) {
          console.error("새 ChatHome 창을 열 수 없습니다. 팝업 차단이 설정되었을 수 있습니다.");
        } else {
          console.log("새 ChatHome 창이 성공적으로 열렸습니다.");
        }
      }

      // ChatWindow 팝업 열기 (roomId 포함) - 크기를 width=400, height=600으로 변경
      const chatWindowUrl = `/ChatWindow/${roomId}`;
      const newChatWindow = window.open(chatWindowUrl, 'ChatWindow', 'width=400,height=600');
      if (!newChatWindow) {
        console.error("새 ChatWindow 창을 열 수 없습니다. 팝업 차단이 설정되었을 수 있습니다.");
      } else {
        console.log("새 ChatWindow 창이 성공적으로 열렸습니다.");
      }
    } catch (err) {
      console.error('채팅방 생성에 실패했습니다:', err);
      alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleBorrowButton = async (writerId) => {
    try {
      // startDate와 endDate가 선택되지 않았을 경우 경고 메시지 표시
      if (!startDate || !endDate) {
        alert("대여 시작일과 종료일을 모두 선택해주세요.");
        return;
      }

      console.log("빌리기 버튼 클릭 - startDate:", startDate, "endDate:", endDate);

      // API를 사용해 채팅방 생성 또는 조회
      const response = await axios.post(`${API_BASE_URL}/api/chat/findOrCreateRoom`, {
        joinerId: writerId,
        productId: productId,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log("API 응답 데이터:", response.data);
      const roomId = response.data.chatRoomId;

      if (!roomId) {
        console.error("채팅방 ID(roomId)가 없습니다. 응답 데이터를 확인하세요:", response.data);
        alert("채팅방 생성에 문제가 발생했습니다. 다시 시도해주세요.");
        return;
      }

      alert('채팅방 생성에 성공했습니다.');

      // 새로운 창에 ChatWindow 컴포넌트 렌더링
      const chatWindowUrl = `/ChatWindow/${roomId}`;
      const newChatWindow = window.open(chatWindowUrl, 'ChatWindow', 'width=400,height=600');

      if (newChatWindow) {
        console.log("새 ChatWindow 창이 성공적으로 열렸습니다.");

        // 새 창이 로드될 때까지 일정 시간 반복해서 확인
        const checkWindowLoaded = setInterval(() => {
          if (newChatWindow.closed) {
            // 창이 닫혔다면, 반복을 멈춤
            console.error("새 창이 사용자가 닫았습니다.");
            clearInterval(checkWindowLoaded);
          } else {
            try {
              // 새 창이 로드되었는지 확인하고 메시지 전달 시도
              newChatWindow.postMessage({ startDate, endDate }, window.location.origin);
              console.log("startDate와 endDate가 성공적으로 전달되었습니다.");
              clearInterval(checkWindowLoaded); // 메시지 전송에 성공하면 반복 중지
            } catch (e) {
              console.log("새 창 로드를 기다리는 중..."); // 창이 아직 로드되지 않았을 때 발생하는 오류를 처리
            }
          }
        }, 500); // 500ms 간격으로 체크
      } else {
        console.error("새 ChatWindow 창을 열 수 없습니다. 팝업 차단이 설정되었을 수 있습니다.");
      }
    } catch (err) {
      console.error('채팅방 생성에 실패했습니다:', err);
      alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };






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
            {loggedInUserId && loggedInUserId == productDetail.writerId ? (
                <>
                  <button className={style.postMenu} onClick={() => {
                    toggleMenu("postMenu")
                  }}>
                    {isMenuOpen.postMenu ? <TiThMenuOutline className={style.postMenu_icon}/> :
                        <TiThMenu className={style.postMenu_icon}/>}
                  </button>
                  {isMenuOpen.postMenu && (
                      <ul className={style.lowLevelMenu_box}>
                        <li className={style.lowLevelMenu_wrap}>
                          <button className={`${style.updatePost} ${style.lowLevelMenu}`} onClick={() => {
                          }}>게시물 수정
                          </button>
                        </li>
                        <li className={style.lowLevelMenu_wrap}>
                          <button className={`${style.deletePost} ${style.lowLevelMenu}`} onClick={() => {
                            deleteProduct(productId);
                          }}>게시물 삭제
                          </button>
                        </li>
                      </ul>
                  )}
                </>
            ) : (
                <></>
            )}
            <div className={style.productDetail_info_box}>
              <div className={style.productDetail_imageOrVideo_wrap}>
                <div className={style.product_imageOrVideo_box}>
                  <div className={style.imageOrVideo_wrap}>
                    <div
                        className={`${style.selectBox} ${selectContentPreview === "selectImage" ? style.selectImage : style.selectVideo}`}></div>
                    <div className={style.image_wrap} onClick={() => {
                      handelSelectContentPreview(selectContentPreview, "selectVideo");
                    }}>
                      이미지
                    </div>
                    <div className={style.video_wrap} onClick={() => {
                      handelSelectContentPreview(selectContentPreview, "selectImage");
                    }}>
                      동영상
                    </div>
                  </div>
                </div>
                <div className={style.productImage_box} ref={productImageBoxRef} onScroll={handleScroll}
                     onMouseUp={handleScrollEnd}>
                  {selectContentPreview === "selectImage" && productDetail.imageUrls && productDetail.imageUrls.map((imageUrl, index) => (
                      <div className={style.productImage_wrap} key={index}>
                        <img className={style.productImage} src={requestProductImageURL(imageUrl)}
                             alt={`상품 이미지 ${index + 1}`}/>
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
                      <div key={dotIndex}
                           className={`${style.dot} ${dotIndex === currentImageIndex ? style.active_dot : ""}`}></div>
                  ))}
                </div>
              </div>
              <div className={style.productDetail_info_wrap}>
                <div className={style.product_title_category_name_wrap}>
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
                  <div className={style.product_category_name_writer_box}>
                    <div className={style.product_category_name_wrap}>
                      <div className={style.productCategory_wrap}>
                        {productDetail.category}
                      </div>
                      <div className={style.productName_wrap}>
                        {productDetail.name}
                      </div>
                    </div>
                    <div className={style.product_writer_wrap}>
                      작성자: {productDetail.writerId}
                    </div>
                  </div>
                </div>
                <div className={style.product_info_wrap}>
                  <div className={style.product_start_end_date_wrap}>
                    <div className={style.product_start_end_date_title_wrap}>
                      대여 기간 선택
                    </div>
                    <div className={style.product_start_end_date_input_wrap}>
                      <input className={`${style.productStartDate} ${style.input_date}`} type="date"
                             min={productDetail.startDate} max={formatDateForInput(productDetail.endDate)}
                             onChange={(e) => {
                               chooseLentPeriod("startDate", e.target.value)
                             }} onKeyDown={(e) => e.preventDefault()}></input>
                      ~
                      <input className={`${style.productEndDate} ${style.input_date}`} type="date"
                             min={formatDateForInput(productDetail.startDate)}
                             max={formatDateForInput(productDetail.endDate)} onChange={(e) => {
                        chooseLentPeriod("endDate", e.target.value)
                      }} onKeyDown={(e) => e.preventDefault()}></input>
                    </div>
                  </div>
                  <div className={style.product_lentPeriod_wrap}>
                    <div className={style.product_lentPeriod_title_wrap}>
                      대여 기간
                    </div>
                    <div className={style.product_lentPeriod_display_wrap}>
                      <div className={style.product_lentPeriod_value_wrap}>
                        {startDate && endDate ? (
                            <>
                              {lentPeriod}일
                            </>
                        ) : (
                            <>
                              기간을 선택해주세요.
                            </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={style.product_price_wrap}>
                    <div className={style.product_price_title_wrap}>
                      대여 가격
                    </div>
                    <div className={style.product_price_display_wrap}>
                      <div className={style.product_price_value_wrap}>
                        {priceAddComma(lentPrice)}원
                      </div>
                    </div>
                  </div>
                  <div className={style.product_chat_lent_button_wrap}>
                    <div className={style.product_chat_button_wrap}>
                      <button className={`${style.chat_button} ${style.button}`} onClick={() => {
                        alert(productDetail.writerId);
                        handleLentButton(productDetail.writerId);
                      }}>
                        채팅하기
                      </button>
                    </div>
                    <div className={style.product_lent_button_wrap}>
                      <button className={`${style.lent_button} ${style.button}`} onClick={() => {
                        handleBorrowButton(productDetail.writerId);
                      }}>
                        빌리기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.productDetail_description_box}>
              {productDetail.description}
            </div>


            <div className={style.productDetail_review_box}>
              <div className={style.reviewCount}>
                총 {reviews.length}개의 리뷰
              </div>
              <ReviewList reviews={reviews}/>
            </div>
          </div>
      ) : (
          <p>Loading...</p>
      )}

    </div>
  )
}
