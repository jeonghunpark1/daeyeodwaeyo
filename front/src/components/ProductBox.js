import React from 'react'
import { useNavigate } from 'react-router-dom';

import style from "../styles/productBox.module.css"

export default function ProductBox({ product }) {

  const navigate = useNavigate();

  // 상품을 클리하면 상세페이지로 넘어감
  const handleProductClick = (productId) => {
    navigate("/productDetail", { state: { productId } });
  };

  const requestProductImageURL = (productImage) => {
    const productImageURL = "http://localhost:8080/productImagePath/" + productImage;
    return productImageURL;
  };

  return (
    <div className={style.product_box} key={product.id} onClick={() => {handleProductClick(product.id)}}>
      <div className={style.product_id}></div>
      <div className={style.product_image_wrap}>
        <img className={style.product_image} src={requestProductImageURL(product.imageUrl)} alt='상품 사진' />
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
      </div>
    </div>
  )
}
