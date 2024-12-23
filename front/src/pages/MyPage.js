import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PreviewProduct_mypage from "../components/PreviewProduct_mypage";
import style from "../styles/myPage.module.css";
import axios from "axios";

import { API_BASE_URL } from "../utils/constants";

export default function MyPage() {
  const [myProductList, setMyProductList] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [chatRoomIds, setChatRoomIds] = useState([]);
  const [productList, setProductList] = useState([]); // 빌린 상품 정보

  const [isOpenMenu, setIsOpenMenu] = useState({
    menu1: false,
    menu2: false,
    menu3: false,
    menu4: false,
    menu5: false,
  });

  const toggleMenu = (menu) => {
    setIsOpenMenu((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedLoginStatus = localStorage.getItem("isLogin") === "true";

    if (token && storedLoginStatus) {
      console.log("로그인 상태 확인: 로그인됨");
      setIsLogin(true);
      fetchUserInfo(token);
    } else {
      console.log("로그인 상태 확인: 로그아웃 상태");
      setIsLogin(false);
    }
  }, []);

  const fetchUserInfo = (token) => {
    axios
        .get(`${API_BASE_URL}/api/users/headerUserInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("사용자 정보 가져오기 성공:", response.data);
          setUserInfo(response.data);
        })
        .catch((err) => {
          console.error("유저 정보 가져오기 실패:", err);
          setIsLogin(false);
          setUserInfo(null);
        });
  };

  useEffect(() => {
    const fetchChatRoomIds = async () => {
      if (!userInfo) {
        console.log("유저 정보가 없습니다. userInfo:", userInfo);
        return;
      }

      try {
        console.log("서버로 요청 보낼 userId:", userInfo.id);
        const response = await axios.get(
            `${API_BASE_URL}/api/applications/returned-chatrooms`,
            {
              params: { userId: userInfo.id },
            }
        );
        console.log("ChatRoom IDs:", response.data);
        setChatRoomIds(response.data);
      } catch (error) {
        console.error("ChatRoom ID 가져오기 실패:", error);
      }
    };

    if (userInfo) {
      fetchChatRoomIds();
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!chatRoomIds || chatRoomIds.length === 0) {
        console.log("ChatRoom ID가 없습니다. chatRoomIds:", chatRoomIds);
        return;
      }

      try {
        console.log("서버로 요청 보낼 ChatRoom IDs:", chatRoomIds);

        const productIds = await Promise.all(
            chatRoomIds.map(async (chatRoomId) => {
              try {
                console.log("ChatRoom ID로 Product ID 요청:", chatRoomId);

                const response = await axios.get(
                    `${API_BASE_URL}/api/chat/${chatRoomId}/productId`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                );

                console.log(`ChatRoom ID ${chatRoomId} -> Product ID: ${response.data.productId}`);
                return response.data.productId;
              } catch (error) {
                console.error(`ChatRoom ID ${chatRoomId}에서 Product ID 가져오기 실패:`, error);
                return null;
              }
            })
        );

        const validProductIds = productIds.filter((id) => id !== null);
        console.log("유효한 Product IDs:", validProductIds);

        if (validProductIds.length === 0) {
          console.log("유효한 Product ID가 없습니다.");
          return;
        }

        const productResponse = await axios.post(
            `${API_BASE_URL}/api/products/borrowed`,
            validProductIds,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
        );

        console.log("빌린 상품 정보 가져오기 성공:", productResponse.data);
        setProductList(productResponse.data);
      } catch (error) {
        console.error("Product 정보 가져오기 실패:", error);
      }
    };

    fetchProducts();
  }, [chatRoomIds]);

  const fetchMyProducts = async () => {
    try {
      const response = await axios.get(
          `${API_BASE_URL}/api/products/myProduct`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
      );
      setMyProductList(response.data);
      console.log("내 상품 리스트:", response.data);
    } catch (error) {
      console.error("Failed to fetch my products:", error);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleChangeInfo = () => {
    window.open(
        `http://localhost:3000/changeInfo`,
        "내정보 변경",
        "width=815px, height=451px, scrollbars=no, left=350px, top=200px"
    );
  };

  const handleTransaction = () => {
    window.open(
        `http://localhost:3000/transaction`,
        "거래 내역",
        "width=815px, height=451px, scrollbars=no, left=350px, top=200px"
    );
  };

  return (
      <div className={style.mypage_page}>
        <div className={style.mypage_content_wrap}>
          <div className={style.mypage_title_wrap}>
            <h1>마이페이지</h1>
          </div>
          <div className={style.mypage_content}>
            <div className={style.mypage_menu_box}>
              <div
                  className={`${style.update_myInfo_menu_wrap} ${style.mypage_menu_wrap}`}
              >
                <button
                    className={`${style.update_myInfo_menu} ${style.mypage_menu}`}
                    onClick={handleChangeInfo}
                >
                  내정보 변경
                </button>
              </div>
              <div
                  className={`${style.transaction_history_menu_wrap} ${style.mypage_menu_wrap}`}
              >
                <button
                    className={`${style.transaction_history_menu} ${style.mypage_menu}`}
                    onClick={handleTransaction}
                >
                  거래내역
                </button>
              </div>
            </div>

            {/* 내 상품 */}
            <div
                className={`${style.myProduct_preview_content_wrap} ${style.product_preview_content_wrap}`}
            >
              <div
                  className={`${style.myProduct_preview_list_title} ${style.product_preview_list_title}`}
              >
                <p>내상품</p>
                <Link className={style.more_show_button} to={"/myProduct"}>
                  +더보기
                </Link>
              </div>
              <div
                  className={`${style.myProduct_preview_list_box} ${style.product_preview_box}`}
              >
                {myProductList.length > 0 ? (
                    myProductList.map((product) => (
                        <PreviewProduct_mypage key={product.id} product={product} />
                    ))
                ) : (
                    <>등록된 상품이 없습니다.</>
                )}
              </div>
            </div>

            {/* 빌린 상품 */}
            <div
                className={`${style.borrowedProduct_preview_content_wrap} ${style.product_preview_content_wrap}`}
            >
              <div
                  className={`${style.borrowedProduct_preview_list_title} ${style.product_preview_list_title}`}
              >
                <p>빌린상품</p>
                <Link className={style.more_show_button} to={"/borrowedProduct"}>
                  +더보기
                </Link>
              </div>
              <div
                  className={`${style.borrowedProduct_preview_list_box} ${style.product_preview_box}`}
              >
                {productList.length > 0 ? (
                    productList.map((product) => (
                        <PreviewProduct_mypage key={product.id} product={product} />
                    ))
                ) : (
                    <>빌린 상품이 없습니다.</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
