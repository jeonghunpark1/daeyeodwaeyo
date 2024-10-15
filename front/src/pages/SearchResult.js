import React, { useState } from 'react'

import style from "../styles/searchResult.module.css"
import { useLocation } from 'react-router-dom'

export default function SearchResult() {

  const location = useLocation(); // navigate로 전달된 데이터 접근
  const productList = location.state || [] // 만약 state가 없을 경우 빈 배열로 처리

  console.log("SearchResult / productList: ", productList);

  const requestProductImageURL = (productImage) => {
    const productImageURL = "http://localhost:8080/productImagePath/" + productImage;
    return productImageURL;
  };

  return (
    <div className={style.searchResult_page}>
      <div className={style.searchResult_title_wrap}>
        <h2 className={style.searchResult_title}>검색 결과</h2>
      </div>
      <div className={style.searchResult_content_wrap}>

        <div className={style.product_box}>
          <div className={style.product_image_wrap}>
            <img className={style.product_image} src="https://placehold.co/90x90" alt='상품 사진' />
          </div>
          <div className={style.product_title_wrap}>
            <p className={style.product_title}></p>
          </div>
          <div className={style.product_price_warp}>
            <p className={style.product_price}></p>
          </div>
        </div>
        <div className={style.product_box}>
          <div className={style.product_image_wrap}>
            <img className={style.product_image} src="https://placehold.co/90x90" alt='상품 사진' />
          </div>
          <div className={style.product_title_wrap}>
            <p className={style.product_title}></p>
          </div>
          <div className={style.product_price_warp}>
            <p className={style.product_price}></p>
          </div>
        </div>
        <div className={style.product_box}>
          <div className={style.product_image_wrap}>
            <img className={style.product_image} src="https://placehold.co/90x90" alt='상품 사진' />
          </div>
          <div className={style.product_title_wrap}>
            <p className={style.product_title}></p>
          </div>
          <div className={style.product_price_warp}>
            <p className={style.product_price}></p>
          </div>
        </div>
        <div className={style.product_box}>
          <div className={style.product_image_wrap}>
            <img className={style.product_image} src="https://placehold.co/90x90" alt='상품 사진' />
          </div>
          <div className={style.product_title_wrap}>
            <p className={style.product_title}></p>
          </div>
          <div className={style.product_price_warp}>
            <p className={style.product_price}></p>
          </div>
        </div>
        <div className={style.product_box}>
          <div className={style.product_image_wrap}>
            <img className={style.product_image} src="https://placehold.co/90x90" alt='상품 사진' />
          </div>
          <div className={style.product_title_wrap}>
            <p className={style.product_title}></p>
          </div>
          <div className={style.product_price_warp}>
            <p className={style.product_price}></p>
          </div>
        </div>
        <div className={style.product_box}>
          <div className={style.product_image_wrap}>
            <img className={style.product_image} src="https://placehold.co/90x90" alt='상품 사진' />
          </div>
          <div className={style.product_title_wrap}>
            <p className={style.product_title}></p>
          </div>
          <div className={style.product_price_warp}>
            <p className={style.product_price}></p>
          </div>
        </div>
        <div className={style.product_box}>
          <div className={style.product_image_wrap}>
            <img className={style.product_image} src="https://placehold.co/90x90" alt='상품 사진' />
          </div>
          <div className={style.product_title_wrap}>
            <p className={style.product_title}></p>
          </div>
          <div className={style.product_price_warp}>
            <p className={style.product_price}></p>
          </div>
        </div>
        <div className={style.product_box}>
          <div className={style.product_image_wrap}>
            <img className={style.product_image} src="https://placehold.co/90x90" alt='상품 사진' />
          </div>
          <div className={style.product_title_wrap}>
            <p className={style.product_title}></p>
          </div>
          <div className={style.product_price_warp}>
            <p className={style.product_price}></p>
          </div>
        </div>

        {productList.length > 0 ? (
          <>
            {productList.map((product) => (
              <div className={style.product_box}>
                <div className={style.product_id} key={product.id}></div>
                <div className={style.product_image_wrap}>
                  <img className={style.product_image} src={requestProductImageURL(product.imageUrl[0])} alt='상품 사진' />
                </div>
                <div className={style.product_info_wrap}>
                  <div className={style.product_title_wrap}>
                    ㅁㄴㅇ;ㅣ럼ㄴ;ㅣㅇ ㅁㄴ이ㅏㅓ ㅁㄴㅇ; ㅣㄴㅇ러ㅣ ㅁㄴ; ㅁ ;ㅁㄴㅇ;ㅣㅓㅏ ㅁ  ㅁㄴ이ㅏ ㅓㅁㄴ어 ㅓ ㅁ ㅁㄴ이ㅓㅏ ㅁㄴㅇ리;  ㅁㄴㅇㄹ  ㅁㄴㅇ ㅁㄴㅇㄹ  ㅁㄴㅇ리ㅓㅁㄴ어
                  </div>
                  <div className={style.product_category_wrap}>
                    {product.category}
                  </div>
                  <div className={style.product_price_wrap}>
                    {product.price}원
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className={style.product_box}>
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
