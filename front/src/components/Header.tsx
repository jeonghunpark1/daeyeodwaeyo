import React from 'react'
import style from "../styles/header.module.css"

const Header:React.FC = () => {
  return (
    <div className={style.header_box}>
      <div className={style.header_top}>
        <div className={style.header_logo}>
          <h1>대여돼요</h1>
        </div>
        <div className={style.header_search}>
          <label className={style.search_box}>
            {/* <div className='search-input-box'>
              <input type="text" />
            </div> */}
            <input type="text" />
            <div className='search-button'>검색</div>
          </label>
        </div>
        <div className={style.header_user}>
          <div className={style.user_image}>이미지</div>
          <div className={style.user_nickname}>닉네임</div>
          <button className={style.login_button}>로그인</button>
        </div>
      </div>
      <div className={style.header_nav}>
        <ul>
          <li>쇼츠</li>
          <li>Q&A</li>
          <li>마이페이지</li>
        </ul>
      </div>
    </div>
  )
}

export default Header