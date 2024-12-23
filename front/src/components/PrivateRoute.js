import React from 'react'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ isLogin, children}) {
  // 로그인이 안 되어 있으면 로그인 페이지로 리디렉션
  if (!isLogin) {
    return <Navigate to='/login' />;
  }

  // 로그인이 되어 있으면 자식 컴포넌트를 렌더링
  return children;
}
