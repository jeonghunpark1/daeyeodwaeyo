import React from 'react'
import style from "../styles/header.module.css"
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Header:React.FC = () => {
  return (
    <div className={style.header_box}>
      <div className={style.header_top}>
        <div className={style.header_logo}>
          <h1>대여돼요</h1>
        </div>
        <div className={style.header_search}>
          <div className={style.search_box}>
            {/* <div className='search-input-box'>
              <input type="text" />
            </div> */}
            <label className={style.search_input_label}>
              <input type="text" className={style.search_input} placeholder='검색어를 입력하세요.' />
            </label>
            <label className={style.search_button_label}>
              <button className={style.search_button}>
                <FaSearch />
              </button>
            </label>
          </div>
        </div>
        <div className={style.header_user}>
          <div className={style.user_image_box}>
            <div className={style.user_image}>
              <img src="https://placehold.co/90x90" />
            </div>
          </div>
          <div className={style.user_info_box}>
            <div className={style.user_nickname}>OOO 님</div>
            <button className={style.login_button}>로그인</button>
          </div>
        </div>
      </div>
      <div className={style.header_nav}>
        <ul>
          <li>
            <Link className={style.nav_menu} to={'/shorts'}>쇼츠</Link>
          </li>
          <li>
            <Link className={style.nav_menu} to={'/QnA'}>Q&A</Link>
          </li>
          <li>
            <Link className={style.nav_menu} to={'/myPage'}>마이페이지</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Header