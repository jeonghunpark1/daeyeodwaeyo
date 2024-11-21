import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Routes, Route, BrowserRouter, useLocation, useParams } from "react-router-dom";
import { SearchProvider } from './components/SearchProvider';
import axios from 'axios';
import Header from './components/Header';
import Login from './pages/Login';
import Main from './pages/Main';
import SignUp from './pages/SignUp';
import Footer from './components/Footer';
import ProductAdd from './pages/ProductAdd';
import MyPage from './pages/MyPage';
import Product from './pages/Product';
import FindId from './pages/FindId';
import FindIdResult from './pages/FindIdResult';
import FindPassword from './pages/FindPassword';
import FindPasswordResult from './pages/FindPasswordResult';
import ChangeInfo from './pages/ChangeInfo';
import PrivateRoute from './components/PrivateRoute';
import SearchResult from './pages/SearchResult';
import ProductDetail from './pages/ProductDetail';
import Shorts from './pages/Shorts';
import ImageSearch from './components/ImageSearch';
import ImageSearchResult from './pages/ImageSearchResult';

import ChatWindow from './pages/chatting/ChatWindow';
import Chat from './pages/chatting/Chat';
import ChatHome from './pages/chatting/ChatHome';
import ChatMidPoint from './pages/chatting/ChatMidPoint'; // 추가한 컴포넌트

export default function App() {

  const [token, setToken] = useState("");

  const [isLogin, setIsLogin] = useState(false);
  const [headerUserInfo, setHeaderUserInfo] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState("");

  const chatWindowRef = useRef(null);

  // 현재 경로 확인
  const location = useLocation();

  const setterIsLogin = (value) => {
    setIsLogin(value);
    localStorage.setItem("isLogin", value); // 로그인 상태를 로컬 스토리지에 저장
  };

  const getterIsLogin = () => {
    return isLogin;
  }

  // 페이지가 로드될 때 로컬 스토리지에서 로그인 상태를 확인
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedLoginStatus = localStorage.getItem("isLogin") === "true";

    if (token && storedLoginStatus) {
      setIsLogin(true);
      fetchUserInfo(token);
    }
  }, []);

  const fetchUserInfo = (token) => {
    axios.get('http://localhost:8080/api/users/headerUserInfo', {
      headers: {
        'Authorization': `Bearer ${token}`, // Bearer 토큰 형태로 전송
      },
    })
    .then((response) => {
      setIsLogin(true);
      setHeaderUserInfo(response.data);
      setLoggedInUserId(response.data.id);
    })
    .catch((err) => {
      console.log("유저 정보 불러오기 실패: ", err);
      setIsLogin(false);
      setHeaderUserInfo(null);
    })
  }

  return (

      <div className="App">
        <SearchProvider>
          {(location.pathname !== '/findId' &&
            location.pathname != '/findIdResult' &&
            location.pathname != '/findPassword' &&
            location.pathname != '/findPasswordResult' &&
            location.pathname != '/changeInfo' &&
            location.pathname !== '/ChatHome' &&
            location.pathname !== '/ChatMidPoint' && // ChatMidPoint 경로에서는 Header를 제외
            !/^\/ChatWindow\/[^/]+$/.test(location.pathname)) && (
            <Header getterIsLogin={getterIsLogin} headerUserInfo={headerUserInfo} />
          )}
          <Routes>
            {/* <Route path="/" element={<Index />}></Route> */}
            <Route path="/login" element={<Login setterIsLogin={setterIsLogin} fetchUserInfo={fetchUserInfo}/>}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/main" element={<Main />}></Route>
            <Route path="/productAdd" element={<ProductAdd />}></Route>
            {/* <Route path="/product" element={<Product />}></Route> */}
            {/* <Route path="/myPage" element={<MyPage />}></Route> */}
            <Route path="/findId" element={<FindId />}></Route>
            <Route path="/findIdResult" element={<FindIdResult />}></Route>
            <Route path="/findPassword" element={<FindPassword />}></Route>
            <Route path="/findPasswordResult" element={<FindPasswordResult />}></Route>
            <Route path="/changeInfo" element={<ChangeInfo />}></Route>
            <Route path="/searchResult" element={<SearchResult />}></Route>
            <Route path="/productDetail" element={<ProductDetail loggedInUserId={loggedInUserId} chatWindowRef={chatWindowRef}/>}></Route>
            <Route path="/shorts" element={<Shorts />}></Route>
            <Route path="/imageSearch" element={<ImageSearch />}></Route>
            <Route path="/imageSearchResult" element={<ImageSearchResult />}></Route>

            <Route path="/ChatWindow/:roomId" element={<ChatWindowWrapper token={token} />} />
            <Route path="/ChatHome" element={<ChatHome token={token} />} />
            <Route path="/ChatMidPoint" element={<ChatMidPoint />} /> {/* ChatMidPoint 경로 추가 */}

            {/* PrivateRoute를 통한 Route */}
            <Route
              path="myPage"
              element={
                <PrivateRoute isLogin={isLogin}>
                  <MyPage />
                </PrivateRoute>
              }
            />
            <Route
              path="product"
              element={
                <PrivateRoute isLogin={isLogin}>
                  <Product />
                </PrivateRoute>
              }
            />
          </Routes>
          {(location.pathname !== '/findId' &&
            location.pathname != '/findIdResult' &&
            location.pathname != '/findPassword' &&
            location.pathname != '/findPasswordResult' &&
            location.pathname != '/changeInfo' && 
            location.pathname != '/shorts' &&
            location.pathname !== '/ChatMidPoint' && // ChatMidPoint 경로에서는 Footer를 제외
            !/^\/ChatWindow\/[^/]+$/.test(location.pathname)) && (
            <Footer />
          )}
          {isLogin && 
          location.pathname !== '/ChatHome' && 
          location.pathname !== '/ChatMidPoint' && 
          !/^\/ChatWindow\/[^/]+$/.test(location.pathname) && 
          location.pathname !== '/changeInfo' &&(
              <Chat chatWindowRef={chatWindowRef}/>
          )}
        </SearchProvider>
      </div>

  );
}

function ChatWindowWrapper({ token }) {
  const { roomId } = useParams();
  return <ChatWindow token={token} roomId={roomId} />;
}
