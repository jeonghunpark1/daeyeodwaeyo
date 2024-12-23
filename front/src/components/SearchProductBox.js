import React from 'react'

import style from "../styles/searchProductBox.module.css"
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../utils/constants';

export default function SearchProductBox({ product }) {

  const navigate = useNavigate();

  // price에 천단위 콤마 추가
  const priceAddComma = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handleProductClick = (product_id) => {
    navigate("/productDetail", { state: {productId: product_id} })
  }

  const requestProductImageURL = (productImage) => {
    const productImageURL = `${API_BASE_URL}/api/productImagePath/` + productImage;
    return productImageURL;
  };

  return (
    <div className={style.product_box} key={product.id} onClick={() => {handleProductClick(product.id)}}>
      <div className={style.product_id}></div>
      <div className={style.product_image_wrap}>
        <img className={style.product_image} src={requestProductImageURL(product.imageUrl[0])} alt='상품 사진' />
      </div>
      <div className={style.product_info_wrap}>
        <div className={style.product_title_wrap}>
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
        <div className={style.product_price_wrap}>
          {priceAddComma(product.price)}원
        </div>
      </div>
    </div>
  )
}
