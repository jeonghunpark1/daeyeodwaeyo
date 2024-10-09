import {React, useState} from 'react'
import style from "../styles/changeInfo.module.css"

export default function ChangeInfo() {

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

  return (
    <div className={style.changeInfo_page}>
      <div className={style.changeInfo_title_wrap}>
        <h2 className={style.changeInfo_title}>내정보 변경</h2>
      </div>
      <div className={style.changeInfo_content_box}>
        <div className={style.changeInfo_nav_wrap}>
          <div className={`${style.home_menu_wrap} ${style.menu_wrap}`}>
            <button className={`${style.home_menu} ${style.menu}`} onClick={() => {}}>내정보</button>
          </div>
          <div className={`${style.menu1_wrap} ${style.menu_wrap}`}>
            <button className={`${style.menu1} ${style.menu}`} onClick={() => {toggleMenu("menu1")}}>
              {isOpenMenu.menu1 ? "내정보 변경 닫기" : "내정보 변경 열기"}
            </button>
            {isOpenMenu.menu1 && (
              <ul>
                <li>비밀번호 변경</li>
                <li>주소 변경</li>
                <li>프로필 사진 변경</li>
                <li>닉네임 변경</li>
              </ul>
            )}
          </div>
          {/* <div className={`${style.menu2_wrap} ${style.menu_wrap}`}>
            <button className={`${style.menu2} ${style.menu}`} onClick={() => {toggleMenu("menu2")}}>
              {isOpenMenu.menu2 ? "내정보 변경 닫기" : "내정보 변경 열기"}
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
              {isOpenMenu.menu3 ? "프로필사진 변경 닫기" : "프로필사진 변경 열기"}
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
              {isOpenMenu.menu4 ? "닉네임 변경 닫기" : "닉네임 변경 열기"}
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
          </div> */}
        </div>
        <div className={style.changeInfo_content_wrap}>
          <div className={style.profileImage_box}>
            <div className={style.profileImage_title_wrap}>
              <h3 className={style.profileImage_title}>프로필사진</h3>
            </div>
            <div className={style.profileImage_wrap}>
              <img src="https://placehold.co/150x150"></img>
            </div>
          </div>
          <div className={style.userInfo_box}>
            <div className={style.userInfo_title_wrap}>
              <h3 className={style.userInfo_title}>사용자 정보</h3>
            </div>
            <div className={style.userInfo_wrap}>
              <div className={style.userId_box}>
                <div className={style.userId_label_wrap}>
                  아이디
                </div>
                <div className={style.userId_wrap}>
                  가나다
                </div>
              </div>
              <div className={style.userNickName_box}>
                <div className={style.userNickName_label_wrap}>
                  닉네임
                </div>
                <div className={style.userNickName_wrap}>
                  가나다
                </div>
              </div>
              <div className={style.userName_box}>
                <div className={style.userName_label_wrap}>
                  이름  
                </div>
                <div className={style.userName_wrap}>
                  가나다
                </div>
              </div>
              <div className={style.userEmail_box}>
                <div className={style.userEmail_label_wrap}>
                  이메일
                </div>
                <div className={style.userEmail_wrap}>
                  가나다
                </div>
              </div>
              <div className={style.userPhoneNumber_box}>
                <div className={style.userPhoneNumber_label_wrap}>
                  전화번호
                </div>
                <div className={style.userPhoneNumber_wrap}>
                  가나다
                </div>
              </div>
              <div className={style.userAddress_box}>
                <div className={style.userAddress_label_wrap}>
                  주소
                </div>
                <div className={style.userAddress_wrap}>
                  가나다
                </div>
              </div>
            </div>
          </div>
          {/* 프로필사진
          아이디
          닉네임
          이름
          이메일
          전화번호
          주소 */}
        </div>
      </div>
    </div>
  )
}
