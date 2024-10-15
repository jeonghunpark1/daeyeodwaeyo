import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
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

export default function App() {

  const [token, setToken] = useState("");

  const [isLogin, setIsLogin] = useState(false);
  const [headerUserInfo, setHeaderUserInfo] = useState(null);

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
    })
    .catch((err) => {
      console.log("유저 정보 불러오기 실패: ", err);
      setIsLogin(false);
      setHeaderUserInfo(null);
    })
  }

  return (

      <div className="App">
        {(location.pathname !== '/findId' &&
          location.pathname != '/findIdResult' &&
          location.pathname != '/findPassword' &&
          location.pathname != '/findPasswordResult' &&
          location.pathname != '/changeInfo') && (
          <Header getterIsLogin={getterIsLogin} headerUserInfo={headerUserInfo} />
        )}
        <Routes>
          {/* <Route path="/" element={<Index />}></Route> */}
          <Route path="/login" element={<Login setterIsLogin={setterIsLogin} fetchUserInfo={fetchUserInfo}/>}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/main" element={<Main />}></Route>
          <Route path="/productAdd" element={<ProductAdd />}></Route>
          <Route path="/product" element={<Product />}></Route>
          {/* <Route path="/myPage" element={<MyPage />}></Route> */}
          <Route path="/findId" element={<FindId />}></Route>
          <Route path="/findIdResult" element={<FindIdResult />}></Route>
          <Route path="/findPassword" element={<FindPassword />}></Route>
          <Route path="/findPasswordResult" element={<FindPasswordResult />}></Route>
          <Route path="/changeInfo" element={<ChangeInfo />}></Route>
          <Route path="/searchResult" element={<SearchResult />}></Route>

          {/* PrivateRoute를 통한 Route */}
          <Route
            path="myPage"
            element={
              <PrivateRoute isLogin={isLogin}>
                <MyPage />
              </PrivateRoute>
            }
          />
        </Routes>
        {(location.pathname !== '/findId' &&
          location.pathname != '/findIdResult' &&
          location.pathname != '/findPassword' &&
          location.pathname != '/findPasswordResult' &&
          location.pathname != '/changeInfo') && (
          <Footer />
        )}
      </div>

  );
}
