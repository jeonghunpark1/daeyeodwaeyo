import {React, useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';

import PreviewProduct_mypage from '../components/PreviewProduct_mypage';

import style from "../styles/myPage.module.css";
import axios from 'axios';

export default function MyPage() {

  const [myProductList, setMyProductList] = useState([]);

  const [isOpenMenu, setIsOpenMenu] = useState({
    menu1: false,
    menu2: false,
    menu3: false,
    menu4: false,
    menu5: false
  });

  const toggleMenu = (menu) => {
    setIsOpenMenu(prevState => ({
      ...prevState,
      [menu]: !prevState[menu] // 해당 메뉴 상태를 토글
    }));
  };

  useEffect(() => {
    fetchMyProducts();
  }, [])

  const fetchMyProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/products/myProduct", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      setMyProductList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch my products:", error);
    }
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

  const handleChangeInfo = () => {
    const popup = window.open("http://localhost:3000/changeInfo", "내정보 변경", "width=815px, height=451px, scrollbars=no, left=350px, top=200px");
  }

  return (
    <div className={style.mypage_page}>
      {/* <div className={style.mypage_nav_wrap}>
        <div className={`${style.home_menu_wrap} ${style.menu_wrap}`}>
          <button className={`${style.home_menu} ${style.menu}`} onClick={() => {}}>홈</button>
        </div>
        <div className={`${style.menu1_wrap} ${style.menu_wrap}`}>
          <button className={`${style.menu1} ${style.menu}`} onClick={() => {toggleMenu("menu1")}}>
            {isOpenMenu.menu1 ? "내정보 변경 닫기" : "내정보 변경 열기"}
          </button>
          {isOpenMenu.menu1 && (
            <ul>
              <li>개인정보 수정</li>
              <li>프로필 수정</li>
            </ul>
          )}
        </div>
        <div className={`${style.menu2_wrap} ${style.menu_wrap}`}>
          <button className={`${style.menu2} ${style.menu}`} onClick={() => {toggleMenu("menu2")}}>
            {isOpenMenu.menu2 ? "매너등급 닫기" : "매너등급 열기"}
          </button>
          {isOpenMenu.menu2 && (
            <ul>
              <li>하위 메뉴1</li>
              <li>하위 메뉴2</li>
            </ul>
          )}
        </div>
        <div className={`${style.menu3_wrap} ${style.menu_wrap}`}>
          <button className={`${style.menu3} ${style.menu}`} onClick={() => {toggleMenu("menu3")}}>
            {isOpenMenu.menu3 ? "신고 닫기" : "신고 열기"}
          </button>
          {isOpenMenu.menu3 && (
            <ul>
              <li>하위 메뉴1</li>
              <li>하위 메뉴2</li>
            </ul>
          )}
        </div>
        <div className={`${style.menu4_wrap} ${style.menu_wrap}`}>
          <button className={`${style.menu4} ${style.menu}`} onClick={() => {toggleMenu("menu4")}}>
            {isOpenMenu.menu4 ? "후기 닫기" : "후기 열기"}
          </button>
          {isOpenMenu.menu4 && (
            <ul>
              <li>하위 메뉴1</li>
              <li>하위 메뉴2</li>
            </ul>
          )}
        </div>
        <div className={`${style.menu5_wrap} ${style.menu_wrap}`}>
          <button className={`${style.menu5} ${style.menu}`} onClick={() => {toggleMenu("menu5")}}>
            {isOpenMenu.menu5 ? "거래내역 닫기" : "거래내역 열기"}
          </button>
          {isOpenMenu.menu5 && (
            <ul>
              <li>하위 메뉴1</li>
              <li>하위 메뉴2</li>
            </ul>
          )}
        </div>
      </div> */}
      <div className={style.mypage_content_wrap}>
        <div className={style.mypage_title_wrap}>
          <h1>마이페이지</h1>
        </div>
        <div className={style.mypage_content}>
          {/* 마이페이지 메뉴 */}
          <div className={style.mypage_menu_box}>
            <div className={`${style.update_myInfo_menu_wrap} ${style.mypage_menu_wrap}`}>
              <button className={`${style.update_myInfo_menu} ${style.mypage_menu}`} onClick={() => {handleChangeInfo()}}>
                내정보 <br/> 변경
              </button>
            </div>
            {/* <div className={`${style.manner_level_menu_wrap} ${style.mypage_menu_wrap}`}>
              <button className={`${style.manner_level_menu} ${style.mypage_menu}`}>
                매너등급
              </button>
            </div>
            <div className={`${style.report_menu_wrap} ${style.mypage_menu_wrap}`}>
              <button className={`${style.report_menu} ${style.mypage_menu}`}>
                신고접수
              </button>
            </div> */}
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
              {myProductList && myProductList.length > 0 ? (
                <>
                  {myProductList.map((product) => (
                    <PreviewProduct_mypage product={product} />
                  ))}
                </>
              ) : (
                <>
                  등록된 상품이 없습니다.
                </>
              )}
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
