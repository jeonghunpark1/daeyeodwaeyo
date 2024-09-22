import React, { useState } from 'react';
import '../styles/ProductAdd.css';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form, images, video);
    };

    return (
        <div className="product-add-container">
            <h2>상품 등록</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>제목</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleInputChange}
                        placeholder="상품 이름"
                    />
                </div>

                {/* 이미지 및 동영상 첨부 */}
                <div className="media-section">
                    <div className="form-group image-section">
                        <label>사진 첨부</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                        <div className="image-preview">
                            {images.length > 0 &&
                                images.map((image, index) => (
                                    <img key={index} src={URL.createObjectURL(image)} alt="preview" />
                                ))}
                        </div>
                    </div>

                    <div className="form-group video-section">
                        <label>영상 첨부</label>
                        <input type="file" accept="video/*" onChange={handleVideoChange} />
                        <div className="video-preview">
                            {video && <video controls src={URL.createObjectURL(video)} width="100%" height="100%" />}
                        </div>
                    </div>
                </div>

                {/* 카테고리, 그래프, 렌탈 가격 */}
                <div className="category-price-section">
                    <div className="form-group">
                        <label>카테고리</label>
                        <select name="category" value={form.category} onChange={handleInputChange}>
                            <option value="">카테고리 선택</option>
                            <option value="electronics">전자제품</option>
                            <option value="furniture">가구</option>
                            <option value="clothing">의류</option>
                            <option value="books">도서</option>
                        </select>
                    </div>

                    <div className="graph-placeholder">
                        <label>유사 상품 가격 분포</label>
                        <div className="graph-box">
                            {/* 그래프는 나중에 구현 */}
                            <span>그래프 공간</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>렌탈 가격</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleInputChange}
                            placeholder="렌탈 가격"
                        />
                    </div>
                </div>

                {/* 렌탈 가능 날짜 */}
                <div className="form-group date-picker">
                    <label>렌탈 가능 날짜</label>
                    <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleInputChange}
                    />
                </div>

                {/* 상품 설명 */}
                <div className="form-group">
                    <label>상품 설명</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleInputChange}
                        placeholder="설명"
                    />
                </div>

                <button type="submit">상품 등록</button>
            </form>
        </div>
    );
}

export default ProductAdd;