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

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // 현재 경로 확인
  const location = useLocation()

  const setterIsLogin = (value) => {
    setIsLogin(value);
  };

  const getterIsLogin = () => {
    return isLogin;
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    console.log("토큰:", token);

    if (token) {
      //백엔드에 토큰을 보내 사용자 정보를 가져옴
      axios.get('http://localhost:8080/api/users/headerUserInfo', {
        headers: {
          'Authorization': `Bearer ${token}` // Bearer 토큰 형태로 전송
        }
      })
      .then(response => {
        console.log("response.data: ", response.data);
        setIsLogin(true);
        console.log("isLogin:", isLogin);
        setUserInfo(response.data);
        console.log("userInfo: ", userInfo);
      })
      .catch(err => {
        console.error('유저 정보 불러오기 실패:', err);
        setIsLogin(false);
        setUserInfo(null);
      });
    }
  }, [isLogin]);

  return (

      <div className="App">
        {(location.pathname !== '/findId' && location.pathname != '/findIdResult' && location.pathname != '/findPassword' && location.pathname != '/findPasswordResult') && (
          <Header getterIsLogin={getterIsLogin} userInfo={userInfo} />
        )}
        <Routes>
          {/* <Route path="/" element={<Index />}></Route> */}
          <Route path="/login" element={<Login setterIsLogin={setterIsLogin}/>}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/main" element={<Main />}></Route>
          <Route path="/productAdd" element={<ProductAdd />}></Route>
          <Route path="/product" element={<Product />}></Route>
          <Route path="/myPage" element={<MyPage />}></Route>
          <Route path="/findId" element={<FindId />}></Route>
          <Route path="/findIdResult" element={<FindIdResult />}></Route>
          <Route path="/findPassword" element={<FindPassword />}></Route>
          <Route path="/findPasswordResult" element={<FindPasswordResult />}></Route>
        </Routes>
        {(location.pathname !== '/findId' && location.pathname != '/findIdResult' && location.pathname != '/findPassword' && location.pathname != '/findPasswordResult') && (
          <Footer />
        )}
      </div>

  );
}
