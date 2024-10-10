import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ProductAdd.module.css';
import style from "../styles/myPage.module.css";
import { useNavigate } from 'react-router-dom';


const ProductAdd = () => {

  const navigate = useNavigate();

  const [productTitle, setProductTitle] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);  // videoPreview 상태 추가

  useEffect(() => {
      if (video) {
          const videoURL = URL.createObjectURL(video);
          setVideoPreview(videoURL);  // 비디오 미리보기 URL 설정

          // 컴포넌트 언마운트 시 또는 비디오가 변경될 때 URL을 해제
          return () => {
              URL.revokeObjectURL(videoURL);
          };
      }
    }, [video]);

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {  // 숫자만 입력 가능하도록 제어
            setPrice(value);
        }
    };


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
            setVideo(null);  // 비디오 상태 초기화
            setTimeout(() => {
                setVideo(file); // 상태를 초기화한 후 새로운 파일 설정
            }, 0);
            e.target.value = null; // 동일한 파일을 다시 선택할 수 있도록 input 리셋
        }
    };


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
        formData.append('price', price);
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
            const response = await axios.post('/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // 토큰과 함께 전송
                },
            });
            if (response.status === 200) {
                alert('상품 등록에 성공했습니다.' + response.status);
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
        <div className={styles.productAdd_container}>
            <div className={styles.productAdd_content_wrap}>
                <div className={styles.productAdd}>
                    <h1>상품등록</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.productAdd_title}>
                        <h3>제목</h3>
                    </div>
                    <div className={styles.productAdd_wrap_name}>
                        <input
                            type="text"
                            className={styles.productAdd_inputText}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles.productAdd_title}>
                        <h3>상품 이름</h3>
                    </div>
                    <div className={styles.productAdd_wrap_title}>
                        <input
                            type="text"
                            className={styles.productAdd_inputText}
                            value={productTitle}
                            onChange={(e) => setProductTitle(e.target.value)}
                        />
                    </div>
                    <div className={styles.productAdd_mediaSection}>
                        <div className={styles.productAdd_imageSection}>
                                <div className={styles.customFileButton}
                                     onClick={() => document.getElementById('imageInput').click()}>
                                    이미지 선택
                                </div>
                            <input
                                type="file"
                                id="imageInput"
                                className={styles.hiddenFileInput}
                                multiple
                                onChange={handleImageChange}
                            />
                            <div ClassName={styles.productAdd}>
                                <div className={styles.productAdd_imagePreview}>
                                    {images.length > 0 &&
                                        images.map((image, index) => (
                                            <div key={index} className={styles.imageContainer}>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Preview ${index + 1}`}
                                                    onClick={() => handleRemoveImage(index)} // 이미지 클릭 시 삭제
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>

                        </div>
                        <div className={styles.productAdd_videoSection}>
                            <div className={styles.customFileButton}
                                 onClick={() => document.getElementById('videoInput').click()}>
                                비디오 선택
                            </div>
                            <input
                                type="file"
                                id="videoInput"
                                className={styles.hiddenFileInput}
                                onChange={handleVideoChange}
                            />
                            <div className={styles.productAdd_videoPreview}>
                                {video && (
                                    <video controls>
                                        <source src={URL.createObjectURL(video)} type="video/mp4"/>
                                        브라우저에서 비디오를 지원하지 않습니다.
                                    </video>
                            )}
                            </div>

                        </div>
                    </div>

                    <div className={styles.productAdd_cdgp}>
                        <div className={styles.productAdd_categoryprice}>
                            <div className={styles.productAdd_category}>
                                <div className={styles.productAdd_title}>
                                    <h3>카테고리</h3>
                                </div>
                                <div className={styles.productAdd_categoryprice_wrap}>
                                    <select
                                        className={styles.productAdd_inputText}  // inputText 스타일 유지
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">카테고리 선택</option>
                                        <option value="electronics">전자제품</option>
                                        <option value="furniture">가구</option>
                                        <option value="clothing">의류</option>
                                        <option value="books">도서</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.productAdd_price}>
                            <div className={styles.productAdd_title}>
                                <h3>가격</h3>
                            </div>
                            <div className={styles.productAdd_categoryprice_wrap}>
                                <input
                                    type="number"
                                    className={styles.productAdd_inputText}
                                    value={price}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value)) {  // 숫자만 허용
                                            setPrice(value);
                                        }
                                    }}
                                />
                            </div>
                            </div>
                        </div>
                        <div className={styles.productAdd_graph}>
                            <div className={styles.productAdd_title}>
                                <h3>그래프</h3>
                            </div>
                            <div className={styles.productAdd_graphBox}>
                                <div className={styles.productAdd_graphBox1}>
                                    <h3>그래프 상자</h3>
                                </div>
                            </div>
                        </div>
                        <div className={styles.productAdd_date}>
                            <div className={styles.productAdd_datePicker}>
                                <div className={styles.productAdd_title}>
                                    <h3>시작날짜</h3>
                                </div>
                                <input
                                    type="datetime-local"
                                    className={styles.productAdd_inputDate}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                <div className={styles.productAdd_title}>
                                    <h3>종료날짜</h3>
                                </div>
                                <input
                                    type="datetime-local"
                                    className={styles.productAdd_inputDate}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.productAdd}>
                        <div className={styles.productAdd_title}>
                            <h3>설명</h3>
                        </div>
                        <textarea
                            className={styles.productAdd_textarea}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <button className={styles.productAdd_button} type="submit">
                        상품 등록
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductAdd;
