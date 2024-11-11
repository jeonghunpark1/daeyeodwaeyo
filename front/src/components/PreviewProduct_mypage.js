import React from 'react'
import { Tooltip } from "react-tooltip"

import style from "../styles/previewProduct_mypage.module.css"
import { useNavigate } from 'react-router-dom';

export default function PreviewProduct_mypage({ product }) {

  const navigate = useNavigate();

  const requestProductImageURL = (productImage) => {
    const productImageURL = "http://localhost:8080/productImagePath/" + productImage;
    return productImageURL;
  };

  // 상품을 클리하면 상세페이지로 넘어감
  const handleProductClick = (productId) => {
    navigate("/productDetail", { state: { productId } });
  };

  return (
    <div className={style.previewProduct_box} key={product.id} onClick={() => {handleProductClick(product.id)}}>
      <div className={style.previewProduct_title_wrap} data-tooltip-content={product.title} data-tooltip-id="title">
        <div className={style.previewProduct_title}>
          {product.title}
        </div>
        <Tooltip
          id="title"
          place="top"
          // float
        />
      </div>
      <div className={style.previewProduct_image_wrap}>
        <img className={style.product_image} src={requestProductImageURL(product.imageUrl)} alt='상품 사진' />
      </div>
      <div className={style.product_info_wrap}>
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
  )
}
