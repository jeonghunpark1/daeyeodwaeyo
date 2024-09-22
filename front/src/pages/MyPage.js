import {React, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';

import style from "../styles/myPage.module.css";

export default function MyPage() {

  const myProducts = () => {
    const result = [];
    for (let i = 0; i < 10; i++) {
      result.push(
        <div className={`${style.myProduct_preview_warp} ${style.product_preview_wrap}`}>
          <div className={`${style.myProduct_preview_title} ${style.product_preview_title}`}>
            내상품 {i+1}
          </div>
          <div className={`${style.myProduct_preview_image} ${style.product_preview_image}`}>
            <img src="http://localhost:8080/imagePath/ca224281-2bc3-42bd-b6c0-91d9a66599f2_image_2e3a2f8b554a5.jpeg" alt='상품 사진 미리보기'></img>
          </div>
        </div>
      );
    }
    return result;
  };

  const borrowedProducts = () => {
    const result = [];
    for (let i = 0; i < 10; i++) {
      result.push(
        <div className={`${style.borrowedProduct_preview_warp} ${style.product_preview_wrap}`}>
          <div className={`${style.borrowedProduct_preview_title} ${style.product_preview_title}`}>
            빌린상품 {i+1}
          </div>
          <div className={`${style.borrowedProduct_preview_image} ${style.product_preview_image}`}>
            <img src="https://placehold.co/100x100" alt='상품 사진 미리보기'></img>
          </div>
        </div>
      );
    }
    return result;
  };

  return (
    <div className={style.mypage_page}>
      <div className={style.mypage_content_wrap}>
        <div className={style.mypage_title_wrap}>
          <h1>마이페이지</h1>
        </div>
        <div className={style.mypage_content}>
          {/* 마이페이지 메뉴 */}
          <div className={style.mypage_menu_box}>
            <div className={`${style.update_myInfo_menu_wrap} ${style.mypage_menu_wrap}`}>
              <button className={`${style.update_myInfo_menu} ${style.mypage_menu}`}>
                내정보 <br/> 변경
              </button>
            </div>
            <div className={`${style.manner_level_menu_wrap} ${style.mypage_menu_wrap}`}>
              <button className={`${style.manner_level_menu} ${style.mypage_menu}`}>
                매너등급
              </button>
            </div>
            <div className={`${style.report_menu_wrap} ${style.mypage_menu_wrap}`}>
              <button className={`${style.report_menu} ${style.mypage_menu}`}>
                신고접수
              </button>
            </div>
            <div className={`${style.review_menu_wrap} ${style.mypage_menu_wrap}`}>
              <button className={`${style.review_menu} ${style.mypage_menu}`}>
                후기
              </button>
            </div>
            <div className={`${style.transaction_history_menu_wrap} ${style.mypage_menu_wrap}`}>
              <button className={`${style.transaction_history_menu} ${style.mypage_menu}`}>
                거래내역
              </button>
            </div>
          </div>
          {/* 내상품 목록 보기 */}
          <div className={`${style.myProduct_preview_content_wrap} ${style.product_preview_content_wrap}`}>
            <div className={`${style.myProduct_preview_list_title} ${style.product_preview_list_title}`}>
              <p>내상품</p>
              <Link className={style.more_show_button} to={'/myProduct'}>+더보기</Link>
            </div>
            <div className={`${style.myProduct_preview_list_box} ${style.product_preview_box}`}>
              {myProducts()}
            </div>
          </div>
          {/* 빌린상품 목록 보기 */}
          <div className={`${style.borrowedProduct_preview_content_wrap} ${style.product_preview_content_wrap}`}>
            <div className={`${style.borrowedProduct_preview_list_title} ${style.product_preview_list_title}`}>
                <p>빌린상품</p>
                <Link className={style.more_show_button} to={'/borrowedProduct'}>+더보기</Link>
              </div>
            <div className={`${style.borrowedProduct_preview_list_box} ${style.product_preview_box}`}>
              {borrowedProducts()}          
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
