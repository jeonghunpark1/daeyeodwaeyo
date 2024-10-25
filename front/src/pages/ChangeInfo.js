import {React, useEffect, useState} from 'react'
import style from "../styles/changeInfo.module.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import CheckPassword from './changeInfo/CheckPassword';
import ChangePassword from './changeInfo/ChangePassword';

export default function ChangeInfo() {

  const [userInfo, setUserInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [isCheckPassword, setIsCheckPassword] = useState(false);
  const [page, setPage] = useState("");

  const setState = (type, value) => {
    if (type == "currentPage") {
      setCurrentPage(value);
    }
    else if (type == "isCheckPassword") {
      setIsCheckPassword(value);
    }
    else if (type == "page") {
      setPage(value);
    }
  }

  const getState = (type) => {
    if (type == "currentPage") {
      return currentPage;
    }
    else if (type == "isCheckPassword") {
      return isCheckPassword;
    }
    else if (type == "page") {
      return page;
    }
  }

  // content_wrap에 들어갈 페이지
  const contentPage = (currentPage) => {
    if (currentPage == "home") {
      return (
        <>
        <div className={style.profileImage_box}>
            <div className={style.profileImage_title_wrap}>
              <h3 className={style.profileImage_title}>프로필사진</h3>
            </div>
            <div className={style.profileImage_wrap}>
              <div className={style.userProfileImage_wrap}>
                {userInfo ? (
                  <img src={`http://localhost:8080/profileImagePath/${userInfo.profileImage}`} className={style.userProfileImage} alt='프로필 이미지'></img>  
                ) : (
                  <img src="https://placehold.co/150x150" className={style.userProfileImage} alt='기본 프로필 이미지'></img>
                )}
              </div>
            </div>
          </div>
          <div className={style.userInfo_box}>
            <div className={style.userInfo_title_wrap}>
              <h3 className={style.userInfo_title}>사용자 정보</h3>
            </div>
            <div className={style.userInfo_wrap}>
              {userInfo ? (
                <>
                  <div className={style.userId_box}>
                    <div className={style.userId_label_wrap}>
                      아이디
                    </div>
                    <div className={style.userId_wrap}>
                      {userInfo.id}
                    </div>
                  </div>
                  <div className={style.userNickName_box}>
                    <div className={style.userNickName_label_wrap}>
                      닉네임
                    </div>
                    <div className={style.userNickName_wrap}>
                      {userInfo.nickName}
                    </div>
                  </div>
                  <div className={style.userName_box}>
                    <div className={style.userName_label_wrap}>
                      이름  
                    </div>
                    <div className={style.userName_wrap}>
                      {userInfo.name}
                    </div>
                  </div>
                  <div className={style.userEmail_box}>
                    <div className={style.userEmail_label_wrap}>
                      이메일
                    </div>
                    <div className={style.userEmail_wrap}>
                      {userInfo.email}
                    </div>
                  </div>
                  <div className={style.userPhoneNumber_box}>
                    <div className={style.userPhoneNumber_label_wrap}>
                      전화번호
                    </div>
                    <div className={style.userPhoneNumber_wrap}>
                      {userInfo.phoneNumber}
                    </div>
                  </div>
                  <div className={style.userAddress_box}>
                    <div className={style.userAddress_label_wrap}>
                      주소
                    </div>
                    <div className={style.userAddress_wrap}>
                      {userInfo.address}
                    </div>
                  </div>
                </>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </>
      )
    }
    else if (currentPage == false) {
      return (
        <CheckPassword setState={setState} getState={getState}/>
      )
    }
    else if (currentPage == "changePassword") {
      return (
        <ChangePassword />
      )
    }
  }

  useEffect(() => {
    contentPage((page));
  }, [currentPage])

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    console.log("유저 정보 요청");

    if (!userInfo) {
      try {
        axios.get('http://localhost:8080/api/users/userInfo', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("userInfo: ", JSON.stringify(response.data));
          setUserInfo(response.data);
        })
        .catch((err) => {
          console.log("유저 정보 불러오기 실패", err);
          setUserInfo(null);
        })
      } catch (err) {
        alert('유저 정보를 불러오는데 실패했습니다.' + err);
      }
    }
  }, [])

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
            <button className={`${style.home_menu} ${style.menu}`} onClick={() => {setCurrentPage("home")}}>내정보</button>
          </div>
          <div className={`${style.menu1_wrap} ${style.menu_wrap}`}>
            <button className={`${style.menu1} ${style.menu}`} onClick={() => {toggleMenu("menu1")}}>
              {isOpenMenu.menu1 ? "내정보 변경 닫기" : "내정보 변경 열기"}
            </button>
            {isOpenMenu.menu1 && (
              <ul>
                <li>
                  <button className={`${style.changePassword} ${style.lowLevelMenu}`} onClick={() => {setPage("changePassword"); setCurrentPage(isCheckPassword)}}>비밀번호 변경</button>
                </li>
                <button className={`${style.changeAddress} ${style.lowLevelMenu}`} onClick={() => {setPage("changeAddress"); setCurrentPage(isCheckPassword)}}>주소 변경</button>
                <button className={`${style.changeProfileImage} ${style.lowLevelMenu}`} onClick={() => {setPage("changeProfileImage"); setCurrentPage(isCheckPassword)}}>프로필 사진 변경</button>
                <button className={`${style.changeNickName} ${style.lowLevelMenu}`} onClick={() => {setPage("changeNickName"); setCurrentPage(isCheckPassword)}}>닉네임 변경</button>
              </ul>
            )}
          </div>
        </div>
        <div className={style.changeInfo_content_wrap}>
          {contentPage(currentPage)}
        </div>
      </div>
    </div>
  )
}
