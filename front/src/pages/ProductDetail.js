import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function ProductDetail() {

  const location = useLocation();

  const productId = location.state.productId || "";

  const [productDetail, setProductDetail] = useState(null);

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
    <div>
      <div>ProductDetail</div>
      {productId}
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
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}
