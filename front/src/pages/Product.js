import React, { useEffect, useState } from 'react'
import style from '../styles/product.module.css';

import { IoMdAdd } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { IoIosClose } from "react-icons/io";
import PriceGraph from '../components/priceGraph';

import { API_BASE_URL } from '../utils/constants';

export default function Product() {

  const navigate = useNavigate();

  const [productTitle, setProductTitle] = useState("");
  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const [priceList, setPriceList] = useState([]);

  // price에 천단위 콤마 추가
  const priceAddComma = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // price에 천단위 콤마 제거
  const priceRemoveComma = (price) => {
    return price.replace(/,/g, "");
  }

  const onChnagePrice = (price) => {
    // 입력값에서 숫자만 남기기
    const tempPrice = price.replace(/[^0-9]/g, "");
    if (tempPrice === "") {
      setPrice("");
    } else {
      setPrice(priceAddComma(tempPrice));
      console.log(price);
    }
  }

  useEffect(() => {
    if (video) {
      const videoURL = URL.createObjectURL(video);

      // 컴포넌트 언마운트 시 또는 비디오가 변경될 때 URL을 해제
      return () => {
        URL.revokeObjectURL(videoURL)
      };
    }
  }, [video]);

  // 이미지 추가
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]); // 새 이미지를 기존 배열에 추가
  };

  // 이미지 삭제
  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // 클릭한 이미지 삭제
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file); // 선택된 파일 정보 출력
      setVideo(null); // 비디오 상태 초기화
      setTimeout(() => {
        setVideo(file); // 상태를 초기화한 후 새로운 파일 설정
      }, 0);
      e.target.value = null; // 동일한 파일을 다시 선택할 수 있도록 input 리셋
    }
  };

  // 이미지 미리보기
  const previewImage = (image, index) => {
    return (
      <div key={index} className={style.product_select_image_wrap}>
        <img
          className={style.product_select_image}
            src={URL.createObjectURL(image)}
            alt={`Preview ${index + 1}`}
        ></img>
        <div className={style.remove_image_button_wrap}>
          <button className={style.remove_image_button} onClick={() => handleRemoveImage(index)}>
            <IoIosClose className={style.content_remove_icon}/>
          </button>
        </div>
      </div>
    );
  };

  // 카테고리 예측 요청 함수
  const predictCategory = async (imageFile) => { 
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/images/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // alert("카테고리 예측: " + response.data.category);
      // setCategory(response.data.categorya); // 예측된 카테고리 설정
      const [firstPart, secondPart] = response.data.category.split("-");

      setCategory(firstPart);
      setName(secondPart);
      
    } catch (err) {
      console.error("카테고리 예측 실패:", err);
      alert("카테고리 예측에 실패했습니다.");
    }
  };

  // 이미지 변경 시 카테고리 예측 요청
  useEffect(() => {
    if (images.length > 0) {
      predictCategory(images[0]); // 첫 번째 이미지를 사용해 카테고리 예측 요청
    }
    else if (images.length == 0) {
      setName("");
      setCategory("");
    }
  }, [images]);

  // name에 따른 price값 요청
  const pricesByName = async (productName) => {
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/prices`, {
        params: { name: productName },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // 토큰과 함께 전송
        }
      });
      setPriceList(response.data)
    } catch (err) {
      console.log("가격 데이터를 불러오는 데 실패했습니다.", err);
    }
  };

  // name 변경 시 그래프를 위해 name에 따른 price값 요청
  useEffect(() => {
    if (name) {
      pricesByName(name);
    }
    else {
      setName("");
      setCategory("");
    }
  }, [name])

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 동작 방지

    const formData = new FormData();
    // formData.append('product', JSON.stringify({
    //   title: productTitle,
    //   name,
    //   category,
    //   price,
    //   startDate,
    //   endDate,
    //   description
    // }));
    formData.append('title', productTitle);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', priceRemoveComma(price));
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);

    formData.append('description', description);

    images.forEach((image) => {
        formData.append('images', image);
    });

    if (video) {
        formData.append('video', video);
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/api/products`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // 토큰과 함께 전송
            },
        });
        if (response.status === 200) {
            alert('상품 등록이 되었습니다.');
            // setProductTitle('');
            // setName('');
            // setCategory('');
            // setPrice('');
            // setStartDate('');
            // setEndDate('');
            // setDescription('');
            // setImages([]);
            // setVideo(null);
            // setVideoPreview(null); // 비디오 미리보기 초기화
            navigate('/main')
        }
    } catch (error) {
        alert('상품 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={style.productAdd_page}>
      <div className={style.productAdd_content}>
        <div className={style.page_title_wrap}>
          <h2 className={style.page_title}>상품 등록</h2>
        </div>
        <div className={style.product_title_wrap}>
          <p className={`${style.product_title} ${style.title_p_type}`}>제목</p>
          <input className={`${style.product_title_input} ${style.input_type}`} type="text" onChange={(e) => setProductTitle(e.target.value)} value={productTitle}></input>
        </div>
        <div className={style.product_name_wrap}>
          <p className={`${style.product_name_title} ${style.title_p_type}`}>상품 이름</p>
          <input className={`${style.product_name_input} ${style.input_type}`} type="text" onChange={(e) => setName(e.target.value)} value={name}></input>
        </div>
        <div className={style.product_content_wrap}>
          <div className={style.product_image_wrap}>
            <p className={`${style.product_image_title} ${style.title_p_type}`}>상품 이미지</p>
            <div className={style.product_select_image_box}>
              <input type="file" id="imageInput" className={style.hiddenFileInput} multiple onChange={handleImageChange}></input>
              <div className={`${style.add_product_image_button_wrap} ${style.product_select_image_wrap}`}>
                <button className={`${style.add_product_image_button} ${style.content_add_button}`} onClick={(e) => {document.getElementById("imageInput").click()}}>
                  <IoMdAdd className={`${style.add_product_image_button_icon} ${style.content_add_icon}`}/>
                </button>
              </div>

              {images.length > 0 &&
                images.map((image, index) => (
                  previewImage(image, index)
                ))
              }

              {/* <div className={style.product_select_image_wrap}>
                <img className={style.product_select_image} src='https://placehold.co/70x90'></img>
              </div>
              <div className={style.product_select_image_wrap}>
                <img className={style.product_select_image} src='https://placehold.co/190x90'></img>
              </div>
              <div className={style.product_select_image_wrap}>
                <img className={style.product_select_image} src='https://placehold.co/90x90'></img>
              </div>
              <div className={style.product_select_image_wrap}>
                <img className={style.product_select_image} src='https://placehold.co/90x90'></img>
              </div>
              <div className={style.product_select_image_wrap}>
                <img className={style.product_select_image} src='https://placehold.co/90x90'></img>
              </div> */}
            </div>
          </div>
          <div className={style.product_video_wrap}>
            <p className={`${style.product_video_title} ${style.title_p_type}`}>상품 동영상</p>
            <div className={style.product_select_video_box}>
              <input type="file" id="videoInput" className={style.hiddenFileInput} onChange={handleVideoChange}></input>
              <div className={style.product_select_video_wrap}>
                
                {video ? (
                  <div className={style.product_select_video_button_wrap}>
                    <video className={style.product_select_video} controls>
                      <source src={URL.createObjectURL(video)} type="video/mp4"/>
                      브라우저에서 비디오를 지원하지 않습니다.
                    </video>
                    <div className={style.remove_video_button_wrap}>
                      <button className={style.remove_video_button} onClick={() => {setVideo(null)}}>
                        <IoIosClose className={style.video_remove_icon}/>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={style.product_select_video_button_wrap}>
                    <button className={`${style.add_product_video_button} ${style.content_add_button}`} onClick={() => document.getElementById("videoInput").click()}>
                      <IoMdAdd className={`${style.add_product_video_button_icon} ${style.content_add_icon}`}/>
                    </button>
                  </div>
                )}
                
                {/* <div className={style.product_select_video_wrap}>
                  <video className={style.product_video} src='/Users/giho/Desktop/화면 기록 2024-09-12 오후 5.09.49.mov'></video>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className={style.product_info_wrap}>
          <div className={style.product_detail_info_wrap}>
            <div className={style.product_detail_info_top_wrap}>
              <div className={style.product_category_wrap}>
                <p className={`${style.product_category_title} ${style.title_p_type}`}>카테고리</p>
                <input className={`${style.product_category_input} ${style.input_type}`} id="category" list='categoryList' onChange={(e) => {setCategory(e.target.value)}} value={category} placeholder='직접입력'></input>
                <datalist id="categoryList">
                  <option value="전자제품">전자제품</option>
                  <option value="가구">가구</option>
                  <option value="의류">의류</option>
                  <option value="도서">도서</option>
                </datalist>

              </div>
              <div className={style.product_price_wrap}>
                <p className={`${style.product_price_title} ${style.title_p_type}`}>대여가격</p>
                <input className={`${style.product_price_input} ${style.input_type}`} type="text" onChange={(e) => {onChnagePrice(e.target.value)}} value={price}></input>
              </div>
            </div>
            <div className={style.product_detail_info_bottom_wrap}>
              <p className={`${style.product_lent_period_title} ${style.title_p_type}`}>대여 가능 날짜</p>
              <div className={style.product_lent_period_select_wrap}>
                <input className={`${style.start_date} ${style.input_type}`} type="date" onChange={(e) => {setStartDate(e.target.value)}} value={startDate}></input>
                <p>~</p>
                <input className={`${style.end_date} ${style.input_type}`} type="date" onChange={(e) => {setEndDate(e.target.value)}} value={endDate}></input>                
              </div>
            </div>
          </div>
          <div className={style.product_price_graph_wrap}>
            <p className={`${style.product_price_graph_title} ${style.title_p_type}`}>유사 상품 가격 분포</p>
            <div className={style.product_price_graph_image_wrap}>
              {/* <img className={style.product_price_graph_image} src="https://placehold.co/200x100"></img> */}
              {name ? (
                <PriceGraph priceList={priceList}/>
              ) : (
                <>
                  사진을 등록해주세요.
                </>
              )}
            </div>
          </div>
        </div>
        <div className={style.product_description_wrap}>
          <p className={`${style.product_price_graph_title} ${style.title_p_type}`}>상품 설명</p>
          <textarea className={`${style.product_description} ${style.input_type}`} onChange={(e) => {setDescription(e.target.value)}} value={description} ></textarea>
        </div>
        <div className={style.product_add_button_wrap}>
          <button className={style.product_add_button} onClick={(e) => {handleSubmit(e)}}>물건 등록</button>
        </div>
      </div>
    </div>
  )
}
