import React, { useState } from 'react';
import style from '../styles/ProductAdd.module.css';
import axios from 'axios';

function ProductAdd() {
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);
    const [form, setForm] = useState({
        title: '',
        category: '',
        price: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleVideoChange = (e) => {
        setVideo(e.target.files[0]);
    };

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 상품 설명 입력 함수 (제한 없이)
    const handleDescriptionChange = (e) => {
        setForm({ ...form, description: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('category', form.category);
        formData.append('price', form.price);
        formData.append('startDate', form.startDate);
        formData.append('endDate', form.endDate);
        formData.append('description', form.description);

        images.forEach((image, index) => {
            formData.append('images', image);
        });

        if (video) {
            formData.append('video', video);
        }

        // FormData 내용 확인 (디버깅용)
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        try {
            const response = await axios.post('/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert('상품 등록에 성공했습니다.');
                setForm({
                    title: '',
                    category: '',
                    price: '',
                    startDate: '',
                    endDate: '',
                    description: ''
                });
                setImages([]);
                setVideo(null);
            }
        } catch (error) {
            alert('상품 등록에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className={style.productAdd_container}>
            <h2 className={style.productAdd_title}>상품 등록</h2>
            <form onSubmit={handleSubmit}>
                <div className={style.productAdd_formGroup}>
                    <label className={style.productAdd_label}>제목</label>
                    <input
                        type="text"
                        name="title"
                        className={style.productAdd_inputText}
                        value={form.title}
                        onChange={handleInputChange}
                        placeholder="상품 이름"
                    />
                </div>

                <div className={style.productAdd_mediaSection}>
                    <div className={`${style.productAdd_formGroup} ${style.productAdd_imageSection}`}>
                        <label className={style.productAdd_label}>사진 첨부</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                        <div className={style.productAdd_imagePreview}>
                            {images.length > 0 &&
                                images.map((image, index) => (
                                    <img key={index} src={URL.createObjectURL(image)} alt="preview" />
                                ))}
                        </div>
                    </div>

                    <div className={`${style.productAdd_formGroup} ${style.productAdd_videoSection}`}>
                        <label className={style.productAdd_label}>영상 첨부</label>
                        <input type="file" accept="video/*" onChange={handleVideoChange} />
                        <div className={style.productAdd_videoPreview}>
                            {video && <video controls src={URL.createObjectURL(video)} width="100%" height="100%" />}
                        </div>
                    </div>
                </div>

                <div className={style.productAdd_categoryPriceSection}>
                    <div className={style.productAdd_formGroup}>
                        <label className={style.productAdd_label}>카테고리</label>
                        <select name="category" className="productAdd_select" value={form.category} onChange={handleInputChange}>
                            <option value="">카테고리 선택</option>
                            <option value="electronics">전자제품</option>
                            <option value="furniture">가구</option>
                            <option value="clothing">의류</option>
                            <option value="books">도서</option>
                        </select>
                    </div>

                    <div className={style.productAdd_graphPlaceholder}>
                        <label className={style.productAdd_label}>유사 상품 가격 분포</label>
                        <div className={style.productAdd_graphBox}>
                            <span>그래프 공간</span>
                        </div>
                    </div>

                    <div className={style.productAdd_formGroup}>
                        <label className={style.productAdd_label}>렌탈 가격</label>
                        <input
                            type="number"
                            name="price"
                            className={style.productAdd_inputNumber}
                            value={form.price}
                            onChange={handleInputChange}
                            placeholder="렌탈 가격"
                        />
                    </div>
                </div>

                <div className={`${style.productAdd_formGroup} ${style.productAdd_datePicker}`}>
                    <label className={style.productAdd_label}>렌탈 가능 날짜</label>
                    <input
                        type="date"
                        name="startDate"
                        className={style.productAdd_inputDate}
                        value={form.startDate}
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        name="endDate"
                        className={style.productAdd_inputDate}
                        value={form.endDate}
                        onChange={handleInputChange}
                    />
                </div>

                <div className={style.productAdd_formGroup}>
                    <label className="productAdd_label">상품 설명</label>
                    <textarea
                        name="description"
                        className={style.productAdd_textarea}
                        value={form.description}
                        onChange={handleDescriptionChange}
                        placeholder="설명"
                    />
                </div>

                <button type="submit" className={style.productAdd_button}>상품 등록</button>
            </form>
        </div>
    );
}

export default ProductAdd;
